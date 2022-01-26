import React, { useCallback, useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import UsernameDialog from "./components/UsernameDialog";
import Footer from "./components/Footer";
import AddQuestionField from "./components/AddQuestionField";
import { ref, onValue } from "firebase/database";
import Entries from "./components/Entries";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import { getArrFromObj } from "../utils";
const localStorage = window.localStorage;
const Poll = ({ database }) => {
  const [questions, setQuestions] = useState([]);
  const [userVotes, setUserVotes] = useState({});
  const [title, setTitle] = useState("");
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const { pollId } = useParams();
  const updatePollData = useCallback(() => {
    const pollRef = ref(database, `polls/${pollId}`);
    const username = localStorage.getItem("username");
    onValue(pollRef, (snapshot) => {
      const data = snapshot.val();
      const pollQuestions = data.questions;
      const formattedQuestions = getArrFromObj(pollQuestions, "key");
      setQuestions(formattedQuestions);
      setTitle(data["title"]);
      setUserVotes(data["votes"][username]);
      setUsers(data["voters"]);
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
  const classes = useStyles();
  return (
    <div className={"App-header"}>
      {loading && (
        <Box sx={{ display: "flex" }}>
          <CircularProgress className={classes.loading} />
        </Box>
      )}
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
              />
              <AddQuestionField pollId={pollId} database={database} />
              <UsernameDialog />
            </div>
          </div>
          <Footer pollId={pollId} database={database} userVotes={userVotes} />
        </>
      )}
    </div>
  );
};
const useStyles = makeStyles({
  loading: {
    "&": {
      width: "240px !important",
      height: "240px !important",
    },
  },
});
export default Poll;
