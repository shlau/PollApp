import React, { useState } from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { set, ref, get } from "firebase/database";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
const Footer = ({ pollId, database, userVotes, updatePollData }) => {
  const [toastOpen, setToastOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const classes = useStyles();
  const confirmVotes = () => {
    setLoading(true);
    const username = localStorage.getItem("username");
    const currentTimestamp = new Date().getTime();
    get(ref(database, `polls/${pollId}/questions`)).then((snapshot) => {
      let questions = {};
      if (snapshot.exists()) {
        questions = snapshot.val();
      }
      let updatedUserVotes = { ...userVotes };
      for (const key in updatedUserVotes) {
        if (questions[key] == null) {
          updatedUserVotes[key] = null;
        }
      }
      const promise1 = set(
        ref(database, `polls/${pollId}/voters/${username}`),
        currentTimestamp
      );
      const promise2 = set(
        ref(database, `polls/${pollId}/votes/${username}`),
        updatedUserVotes
      );
      Promise.all([promise1, promise2]).then(() => {
        setLoading(false);
        navigate(`/results/${pollId}`);
      });
    });
  };
  return (
    <div style={{ width: "50%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
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
            marginTop: 10,
          }}
        >
          <input
            readOnly
            type="text"
            id="copyText"
            value={window.location.href}
            style={{ marginRight: 4 }}
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
        <div
          style={{ display: "flex", flexWrap: "wrap" }}
          className={classes.navButton}
        >
          <Button
            sx={{ marginRight: 1 }}
            onClick={() => {
              navigate(`/results/${pollId}`);
            }}
            variant="contained"
          >
            View Results
          </Button>
          <Button
            sx={{ marginRight: 1 }}
            onClick={updatePollData}
            variant="contained"
          >
            Refresh
          </Button>
          <Button onClick={confirmVotes} variant="contained">
            Confirm Votes
          </Button>
        </div>
      </div>
      {loading && (
        <Box sx={{ width: "100%", marginTop: "30px" }}>
          <LinearProgress />
        </Box>
      )}
    </div>
  );
};
const useStyles = makeStyles({
  navButton: {
    "& > .MuiButton-root": {
      height: 30,
      marginTop: 10,
    },
  },
});
export default Footer;
