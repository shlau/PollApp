import React, { useState } from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { makeStyles } from "@mui/styles";
const CopyLink = (props) => {
  const [toastOpen, setToastOpen] = useState(false);
  const classes = useStyles();
  return (
    <div
      style={{
        display: "flex",
        height: 30,
        marginTop: 10,
        ...props.style,
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
      <input
        readOnly
        type="text"
        id="copyText"
        value={window.location.href}
        style={{ marginRight: 4 }}
      />
      <Button
        className={classes.btn}
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
  );
};
const useStyles = makeStyles({
  btn: {
    "&.MuiButton-root": {
      backgroundColor: "#cc9100",
      "&:hover": {
        backgroundColor: "#7a5700",
      },
    },
  },
});
export default CopyLink;
