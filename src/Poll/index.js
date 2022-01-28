import React, { useCallback, useEffect, useState } from "react";
import CircularLoading from "../CircularLoading";
import { useParams } from "react-router-dom";
import UsernameDialog from "./components/UsernameDialog";
import Footer from "./components/Footer";
import AddQuestionField from "./components/AddQuestionField";
import { get, ref } from "firebase/database";
import Entries from "./components/Entries";
import { getArrFromObj } from "../utils";
import { useNavigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { styled } from "@mui/material/styles";
const localStorage = window.localStorage;
const Root = styled("div")(({ theme }) => ({
  width: "100%",
  [theme.breakpoints.up("md")]: {
    width: "50%",
  },
}));
const Poll = ({ database }) => {
  const navigate = useNavigate();
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
    get(pollRef)
      .then((snapshot) => {
        const data = snapshot.val();
        const pollQuestions = data.questions;
        const formattedQuestions = getArrFromObj(pollQuestions, "key");
        const users = data.votes ? data.votes[username] : {};
        setQuestions(formattedQuestions);
        setTitle(data["title"] || "");
        setUserVotes(users);
        setUsers(data["voters"] || {});
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
        navigate("/");
      });
  }, [pollId, database, navigate]);
  const changeVote = (key, checked) => {
    setUserVotes((prevVotes) => ({ ...prevVotes, [key]: checked }));
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
    <HelmetProvider>
      <div className={"App-header"}>
        <Helmet>
          <meta charSet="utf-8" content={`${title}`} />
          <title>Cyan Poll</title>
        </Helmet>
        {loading && <CircularLoading />}
        {!loading && (
          <>
            <Root>
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
            </Root>
            <Footer
              pollId={pollId}
              database={database}
              userVotes={userVotes}
              updatePollData={updatePollData}
            />
          </>
        )}
      </div>
    </HelmetProvider>
  );
};
export default Poll;
