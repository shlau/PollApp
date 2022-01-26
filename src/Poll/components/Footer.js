import React, { useState } from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { set, ref } from "firebase/database";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
const Footer = ({ pollId, database, userVotes }) => {
  const [toastOpen, setToastOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const classes = useStyles();
  const confirmVotes = () => {
    setLoading(true);
    const username = localStorage.getItem("username");
    const currentTimestamp = new Date().getTime();
    const promise1 = set(
      ref(database, `polls/${pollId}/voters/${username}`),
      currentTimestamp
    );
    const promise2 = set(
      ref(database, `polls/${pollId}/votes/${username}`),
      userVotes
    );
    Promise.all([promise1, promise2]).then(() => {
      setLoading(false);
      navigate(`/results/${pollId}`);
    });
  };
  return (
    <div style={{ width: "50%" }}>
      <div
        style={{
          display: "flex",
          marginTop: 10,
          justifyContent: "space-between",
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
        <Button
          onClick={confirmVotes}
          className={classes.confirmButton}
          variant="contained"
        >
          Confirm Votes
        </Button>
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
  confirmButton: {
    "&": {
      height: 30,
    },
  },
});
export default Footer;
