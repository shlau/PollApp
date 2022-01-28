import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { update, ref } from "firebase/database";
const RemoveDialog = ({
  pollId,
  database,
  removeKey,
  removeDialogOpen,
  setRemoveDialogOpen,
  users,
  updateQuestion,
}) => {
  const handleRemoveDialogClose = () => {
    setRemoveDialogOpen(false);
  };
  const removeQuestion = () => {
    const updates = {};
    updates[`polls/${pollId}/questions/${removeKey}`] = null;
    for (const user in users) {
      updates[`polls/${pollId}/votes/${user}/${removeKey}`] = null;
    }
    update(ref(database), updates);
    updateQuestion(removeKey);
    setRemoveDialogOpen(false);
  };
  return (
    <Dialog
      fullWidth={true}
      onClose={handleRemoveDialogClose}
      open={removeDialogOpen}
    >
      <p style={{ fontWeight: "bold", padding: 5, width: 'fit-content' }}>
        Are you sure you want to remove this question? This will remove the
        question for everyone in the poll.
      </p>
      <div style={{ display: "flex", alignSelf: "center" }}>
        <Button onClick={handleRemoveDialogClose}>No</Button>
        <Button onClick={removeQuestion}>Yes</Button>
      </div>
    </Dialog>
  );
};
export default RemoveDialog;
