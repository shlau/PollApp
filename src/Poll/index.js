import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { makeStyles } from "@mui/styles";
import Checkbox from "@mui/material/Checkbox";
import {
  getDatabase,
  child,
  push,
  get,
  set,
  ref,
  remove,
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
  const invalidUsername = !username || username.trim().length < 1;
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
  const handleDialogClose = (event, reason) => {
    if (reason && reason === "backdropClick") {
      return;
    }
    if (!invalidUsername) {
      localStorage.setItem("username", username);
      setDialogOpen(false);
    }
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
    const userVoteRef = ref(database, `votes/${username}/${key}`);
    set(userVoteRef, !wantRemove);
  };
  const removeQuestion = (key) => {
    const questionRef = child(questionsRef, `${key}`);
    remove(questionRef);
    const userVoteRef = ref(database, `votes/${username}/${key}`);
    remove(userVoteRef);
  };
  useEffect(() => {
    updatePollData();
    updateUserVoteData();
  }, [updatePollData, updateUserVoteData]);
  const classes = useStyles();
  return (
    <div className={"App-header"}>
      <div style={{ width: "50%" }}>
        <div
          style={{ background: "cadetblue", textAlign: "center", padding: 10 }}
        >
          {pollData.title}
        </div>
        <div
          style={{
            background: "#f0f2f5",
            color: "black",
            padding: "5px 10px 30px 10px",
            fontSize: 20,
          }}
        >
          {questions.map((obj) => {
            return (
              <div
                key={obj.key}
                style={{ display: "flex", borderBottom: "3px solid cadetblue" }}
              >
                <p style={{ flex: 1 }}>{obj.text}</p>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <p style={{ margin: "0px 0px 3px 0px", fontWeight: "bold" }}>
                    {obj.votes}
                  </p>
                  {/* <Button
                    size="small"
                    variant="contained"
                    disabled={userVotes && userVotes[obj.key]}
                    onClick={() => {
                      changeVote(obj.key);
                    }}
                  >
                    +
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    disabled={!userVotes || !userVotes[obj.key]}
                    onClick={() => {
                      changeVote(obj.key, true);
                    }}
                  >
                    -
                  </Button> */}
                  <Checkbox
                    checked={userVotes[obj.key] ? true : false}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      changeVote(obj.key, !checked);
                    }}
                  />
                  <Button
                    size="small"
                    variant="contained"
                    className={classes.button}
                    onClick={() => {
                      removeQuestion(obj.key);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            );
          })}
          <div style={{ display: "flex", marginTop: 20, height: 40 }}>
            <TextField
              className={classes.textfield}
              variant="outlined"
              size="small"
              label="Enter a new question"
              onChange={(e) => {
                setNewQuestion(e.target.value);
              }}
            />
            <Button variant="contained" onClick={addNewQuestion}>
              Add
            </Button>
          </div>
          <Dialog onClose={handleDialogClose} open={dialogOpen}>
            <TextField
              error={invalidUsername}
              variant="filled"
              label="Enter a username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <Button onClick={handleDialogClose}>Ok</Button>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
const useStyles = makeStyles({
  textfield: {
    "&": {
      flex: 1,
    },
  },
  button: {
    "&": {
      height: 40,
    },
  },
});
export default Poll;
