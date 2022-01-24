import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  child,
  push,
  get,
  set,
  ref,
  onValue,
} from "firebase/database";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
const firebaseConfig = {
  apiKey: "AIzaSyCYpfY6-nwPPKZp7O5BClCmQYy3okNn_GM",
  authDomain: "cyan-poll-14eb3.firebaseapp.com",
  databaseURL: "https://cyan-poll-default-rtdb.firebaseio.com/",
  storageBucket: "gs://cyan-poll.appspot.com",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const localStorage = window.localStorage;

const Poll = (props) => {
  const [newQuestion, setNewQuestion] = useState("");
  const [pollData, setPollData] = useState({});
  const [userVotes, setUserVotes] = useState({});
  const [dialogOpen, setDialogOpen] = useState(
    localStorage.getItem("username") == null
  );
  const [username, setUsername] = useState(
    localStorage.getItem("username"),
    ""
  );
  const { pollId } = useParams();
  const pollRef = ref(database, `polls/${pollId}`);
  const questionsRef = child(pollRef, "questions");
  const updateUserVoteData = useCallback(() => {
    if (username) {
      const userVotesRef = ref(database, `votes/${username}`);
      onValue(userVotesRef, (snapshot) => {
        if (snapshot.exists()) {
          const userVotes = snapshot.val();
          setUserVotes(userVotes);
        }
      });
    }
  }, [username]);
  const handleDialogClose = () => {
    localStorage.setItem("username", username);
    setDialogOpen(false);
  };
  const getQuestions = () => {
    const questions = pollData.questions;
    const formattedQuestions = [];
    for (const key in questions) {
      const questionData = questions[key];
      formattedQuestions.push({
        ...questionData,
        key: key,
      });
    }
    return formattedQuestions;
  };
  const questions = getQuestions();
  const updatePollData = useCallback(() => {
    onValue(pollRef, (snapshot) => {
      const data = snapshot.val();
      setPollData(data);
    });
  }, [pollId]);
  const addNewQuestion = () => {
    push(questionsRef, { text: newQuestion, votes: 0 });
  };
  const changeVote = (key, wantRemove) => {
    const votesRef = child(questionsRef, `${key}/votes`);
    get(votesRef).then((snapshot) => {
      if (snapshot.exists()) {
        const votes = snapshot.val();
        set(votesRef, votes + (wantRemove ? -1 : 1));
      }
    });
    const usersRef = ref(database, `votes/${username}/${key}`);
    set(usersRef, !wantRemove);
  };
  useEffect(() => {
    updatePollData();
    updateUserVoteData();
  }, [updatePollData, updateUserVoteData]);
  return (
    <div>
      {pollId}
      {pollData.title}
      {questions.map((obj) => {
        return (
          <div key={obj.key} style={{ display: "flex" }}>
            <p>{obj.text}</p>
            <Button
              disabled={userVotes && userVotes[obj.key]}
              onClick={() => {
                changeVote(obj.key);
              }}
            >
              +
            </Button>
            <Button
              disabled={!userVotes || !userVotes[obj.key]}
              onClick={() => {
                changeVote(obj.key, true);
              }}
            >
              -
            </Button>
            <p style={{ fontWeight: "bold" }}>{obj.votes}</p>
          </div>
        );
      })}
      <div style={{ display: "flex" }}>
        <TextField
          variant="outlined"
          label="Enter a new question"
          onChange={(e) => {
            setNewQuestion(e.target.value);
          }}
        />
        <Button onClick={addNewQuestion}>Add</Button>
      </div>
      <Dialog open={dialogOpen}>
        <TextField
          variant="outlined"
          label="Enter a username"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <Button onClick={handleDialogClose}>Ok</Button>
      </Dialog>
    </div>
  );
};
export default Poll;
