import React, { useState } from "react";
import "./App.css";
import { ref, push } from "firebase/database";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
function App({ database }) {
  const navigate = useNavigate();
  const classes = useStyles();
  const createNewPoll = () => {
    const pollsRef = ref(database, "polls");
    const pollId = push(pollsRef, { title: pollName }).key;
    navigate(`/poll/${pollId}`);
  };
  const [pollName, setPollName] = useState("");
  return (
    <div className={"App-header"}>
      <TextField
        className={classes.textfield}
        variant="outlined"
        value={pollName}
        onChange={(e) => setPollName(e.target.value)}
        placeholder={"Poll Title"}
      />
      <Button
        className={classes.button}
        variant="contained"
        onClick={createNewPoll}
      >
        Create New Poll
      </Button>
    </div>
  );
}
const useStyles = makeStyles({
  textfield: {
    "& .MuiOutlinedInput-root": { height: 40, width: 300, background: "white" },
  },
  button: {
    "&": {
      width: 300,
      marginTop: "20px !important",
    },
  },
});
export default App;
