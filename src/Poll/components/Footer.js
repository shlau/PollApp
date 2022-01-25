import React, { useState } from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { set, ref } from "firebase/database";
const Footer = ({ pollId, database, userVotes, voteCounts }) => {
  const [toastOpen, setToastOpen] = useState(false);
  const navigate = useNavigate();
  const classes = useStyles();
  const confirmVotes = () => {
    const username = localStorage.getItem("username");
    const currentTimestamp = new Date().getTime();
    set(ref(database, `polls/${pollId}/voters/${username}`), currentTimestamp);
    set(ref(database, `votes/${username}`), userVotes);
    set(ref(database, `polls/${pollId}/vote-count/`), voteCounts);
  };
  return (
    <div
      style={{
        display: "flex",
        marginTop: 10,
        justifyContent: "space-between",
        width: "50%",
      }}
    >
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
      >
        <Alert severity="success" onClose={() => setToastOpen(false)}>
          Link Copied!
        </Alert>
      </Snackbar>
      <div
        style={{
          display: "flex",
          height: 30,
        }}
      >
        <input
          readOnly
          type="text"
          id="copyText"
          value={window.location.href}
        />
        <Button
          variant="contained"
          onClick={() => {
            if (!navigator.clipboard) {
              const copyText = document.querySelector("#copyText");
              copyText.select();
              document.execCommand("copy");
              setToastOpen(true);
            } else {
              navigator.clipboard
                .writeText(window.location.href)
                .then(() => {
                  console.log("link copied");
                  setToastOpen(true);
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          }}
        >
          Copy
        </Button>
      </div>
      <Button
        onClick={() => {
          confirmVotes();
          navigate(`/results/${pollId}`);
        }}
        className={classes.confirmButton}
        variant="contained"
      >
        Confirm Votes
      </Button>
    </div>
  );
};
const useStyles = makeStyles({
  confirmButton: {
    "&": {
      height: 30,
    },
  },
});
export default Footer;
