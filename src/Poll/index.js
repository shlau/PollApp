import React, { useCallback, useEffect, useState } from "react";
import CircularLoading from "../CircularLoading";
import { useParams } from "react-router-dom";
import UsernameDialog from "./components/UsernameDialog";
import Footer from "./components/Footer";
import AddQuestionField from "./components/AddQuestionField";
import { get, ref } from "firebase/database";
import Entries from "./components/Entries";
import { getArrFromObj } from "../utils";
const localStorage = window.localStorage;
const Poll = ({ database }) => {
  const [questions, setQuestions] = useState([]);
  const [userVotes, setUserVotes] = useState({});
  const [title, setTitle] = useState("");
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const { pollId } = useParams();
  const updateQuestion = (key, newVal) => {
    if (newVal != null) {
      setQuestions((prevQuestions) => [
        ...prevQuestions,
        { key: key, text: newVal },
      ]);
    } else {
      setQuestions((prevQuestions) => {
        const newQuestions = prevQuestions.map((questionData) =>
          questionData.key === key ? null : questionData
        );
        return newQuestions;
      });
      setUserVotes((prevVotes) => ({ ...prevVotes, [key]: null }));
    }
  };
  const updatePollData = useCallback(() => {
    const pollRef = ref(database, `polls/${pollId}`);
    const username = localStorage.getItem("username");
    setLoading(true);
    get(pollRef).then((snapshot) => {
      const data = snapshot.val();
      const pollQuestions = data.questions;
      const formattedQuestions = getArrFromObj(pollQuestions, "key");
      const users = data.votes ? data.votes[username] : {};
      setQuestions(formattedQuestions);
      setTitle(data["title"] || "");
      setUserVotes(users);
      setUsers(data["voters"] || {});
      setLoading(false);
    });
  }, [pollId, database]);
  const changeVote = (key, wantRemove) => {
    setUserVotes((prevVotes) => ({ ...prevVotes, [key]: !wantRemove }));
  };
  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      updatePollData();
    }
    return () => {
      isMounted = false;
    };
  }, [updatePollData]);
  return (
    <div className={"App-header"}>
      {loading && <CircularLoading />}
      {!loading && (
        <>
          <div style={{ width: "50%" }}>
            <div
              style={{
                background: "cadetblue",
                textAlign: "center",
                padding: 10,
              }}
            >
              {title}
            </div>
            <div
              style={{
                background: "#f0f2f5",
                color: "black",
                padding: "5px 10px 30px 10px",
                fontSize: 20,
              }}
            >
              <Entries
                questions={questions}
                userVotes={userVotes}
                changeVote={changeVote}
                pollId={pollId}
                database={database}
                users={users}
                updateQuestion={updateQuestion}
              />
              <AddQuestionField
                pollId={pollId}
                database={database}
                updateQuestion={updateQuestion}
              />
              <UsernameDialog />
            </div>
          </div>
          <Footer
            pollId={pollId}
            database={database}
            userVotes={userVotes}
            updatePollData={updatePollData}
          />
        </>
      )}
    </div>
  );
};
export default Poll;
