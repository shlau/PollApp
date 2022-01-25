import React, { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import RemoveDialog from "./RemoveDialog";
const Entries = ({
  questions,
  userVotes,
  voteCounts,
  changeVote,
  pollId,
  database,
}) => {
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [removeKey, setRemoveKey] = useState("");
  const onRemove = (key) => {
    setRemoveKey(key);
    setRemoveDialogOpen(true);
  };
  const classes = useStyles();
  return (
    <>
      {questions.map((obj) => {
        return (
          <div
            key={obj.key}
            style={{ display: "flex", borderBottom: "3px solid cadetblue" }}
          >
            <p style={{ flex: 1 }}>{obj.text}</p>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={{ margin: "0px 0px 3px 0px", fontWeight: "bold" }}>
                {voteCounts[obj.key]}
              </p>
              <Checkbox
                checked={userVotes[obj.key] ? true : false}
                onChange={(e) => {
                  const checked = e.target.checked;
                  changeVote(obj.key, !checked);
                }}
              />
              <Button
                size="small"
                variant="contained"
                className={classes.removeButton}
                onClick={() => {
                  onRemove(obj.key);
                }}
              >
                Remove
              </Button>
            </div>
          </div>
        );
      })}
      <RemoveDialog
        pollId={pollId}
        database={database}
        removeKey={removeKey}
        removeDialogOpen={removeDialogOpen}
        setRemoveDialogOpen={setRemoveDialogOpen}
      />
    </>
  );
};
const useStyles = makeStyles({
  removeButton: {
    "&": {
      height: 40,
      background: "#D53614 !important",
    },
  },
});
export default Entries;
