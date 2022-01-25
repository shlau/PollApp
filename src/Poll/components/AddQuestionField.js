import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { push, set, ref } from "firebase/database";
const AddQuestionField = ({ pollId, database }) => {
  const [newQuestion, setNewQuestion] = useState("");
  const classes = useStyles();
  const addNewQuestion = () => {
    if (newQuestion && newQuestion.trim().length > 0) {
      const questionsRef = ref(database, `polls/${pollId}/questions`);
      const questionId = push(questionsRef, { text: newQuestion }).key;
      set(ref(database, `polls/${pollId}/vote-count/${questionId}`), 0);
    }
  };
  return (
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
      <Button
        className={classes.addButton}
        variant="contained"
        onClick={addNewQuestion}
      >
        Add
      </Button>
    </div>
  );
};
const useStyles = makeStyles({
  textfield: {
    "&": {
      flex: 1,
      marginRight: "10px !important",
    },
  },
  addButton: {
    "&": {
      background: "green !important",
    },
  },
});
export default AddQuestionField;
