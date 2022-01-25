import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UsernameDialog from "./components/UsernameDialog";
import Footer from "./components/Footer";
import AddQuestionField from "./components/AddQuestionField";
import { ref, onValue } from "firebase/database";
import Entries from "./components/Entries";
const localStorage = window.localStorage;
const Poll = ({ database }) => {
  const [questions, setQuestions] = useState([]);
  const [voteCounts, setVoteCounts] = useState({});
  const [userVotes, setUserVotes] = useState({});
  const [title, setTitle] = useState("");
  const { pollId } = useParams();
  const updateUserVoteData = useCallback(() => {
    const username = localStorage.getItem("username");
    if (username) {
      const userVotesRef = ref(database, `votes/${username}`);
      onValue(userVotesRef, (snapshot) => {
        if (snapshot.exists()) {
          const userVotes = snapshot.val();
          setUserVotes(userVotes);
        }
      });
    }
  }, [database]);
  const updatePollData = useCallback(() => {
    const pollRef = ref(database, `polls/${pollId}`);
    onValue(pollRef, (snapshot) => {
      const data = snapshot.val();
      const pollQuestions = data.questions;
      const formattedQuestions = [];
      for (const key in pollQuestions) {
        const questionData = pollQuestions[key];
        formattedQuestions.push({
          ...questionData,
          key: key,
        });
      }
      setQuestions(formattedQuestions);
      setVoteCounts(data["vote-count"]);
      setTitle(data["title"]);
    });
  }, [pollId, database]);
  const changeVote = (key, wantRemove) => {
    setUserVotes((prevVotes) => ({ ...prevVotes, [key]: !wantRemove }));
    setVoteCounts((prevCounts) => ({
      ...prevCounts,
      [key]: prevCounts[key] + (wantRemove ? -1 : 1),
    }));
  };
  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      updatePollData();
      updateUserVoteData();
    }
    return () => {
      isMounted = false;
    };
  }, [updatePollData, updateUserVoteData]);
  return (
    <div className={"App-header"}>
      <div style={{ width: "50%" }}>
        <div
          style={{ background: "cadetblue", textAlign: "center", padding: 10 }}
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
            voteCounts={voteCounts}
            changeVote={changeVote}
            pollId={pollId}
            database={database}
          />
          <AddQuestionField pollId={pollId} database={database} />
          <UsernameDialog />
        </div>
      </div>
      <Footer
        pollId={pollId}
        database={database}
        userVotes={userVotes}
        voteCounts={voteCounts}
      />
    </div>
  );
};
export default Poll;
