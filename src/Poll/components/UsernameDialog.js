import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
const UsernameDialog = (props) => {
  const localStorage = window.localStorage;
  const [dialogOpen, setDialogOpen] = useState(
    localStorage.getItem("username") == null
  );
  const [username, setUsername] = useState("");
  const invalidUsername = !username || username.trim().length < 1;
  const handleDialogClose = (event, reason) => {
    if (reason && reason === "backdropClick") {
      return;
    }
    if (!invalidUsername) {
      localStorage.setItem("username", username);
      setDialogOpen(false);
    }
  };
  return (
    <Dialog
      onClose={handleDialogClose}
      fullWidth={true}
      open={dialogOpen}
    >
      <div style={{ display: "flex", flexDirection: "column", padding: 10 }}>
        <TextField
          autoFocus={true}
          error={invalidUsername}
          variant="filled"
          label="Enter a username :"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <Button onClick={handleDialogClose}>Ok</Button>
      </div>
    </Dialog>
  );
};
export default UsernameDialog;
