import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { ref, remove } from "firebase/database";
const RemoveDialog = ({
  pollId,
  database,
  removeKey,
  removeDialogOpen,
  setRemoveDialogOpen,
}) => {
  const handleRemoveDialogClose = () => {
    setRemoveDialogOpen(false);
  };
  const removeQuestion = () => {
    const username = localStorage.getItem("username");
    const questionRef = ref(database, `polls/${pollId}/questions/${removeKey}`);
    remove(questionRef);
    const userVoteRef = ref(database, `votes/${username}/${removeKey}`);
    remove(userVoteRef);
    const voteCountRef = ref(
      database,
      `polls/${pollId}/vote-count/${removeKey}`
    );
    remove(voteCountRef);
    setRemoveDialogOpen(false);
  };
  return (
    <Dialog onClose={handleRemoveDialogClose} open={removeDialogOpen}>
      <p style={{ fontWeight: "bold", padding: 5 }}>
        Are you sure you want to remove this question?
      </p>
      <div style={{ display: "flex", alignSelf: "center" }}>
        <Button onClick={handleRemoveDialogClose}>No</Button>
        <Button onClick={removeQuestion}>Yes</Button>
      </div>
    </Dialog>
  );
};
export default RemoveDialog;
