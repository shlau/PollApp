import React, { useCallback, useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import { makeStyles } from "@mui/styles";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useParams } from "react-router-dom";
import { getArrFromObj } from "../utils";
import { ref, get } from "firebase/database";
import Chart, { Legend, Series } from "devextreme-react/chart";
import CircularLoading from "../CircularLoading";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import CopyLink from "../CopyLink";
const Results = ({ database }) => {
  const { pollId } = useParams();
  const [pollData, setPollData] = useState({});
  const [loading, setLoading] = useState(true);
  const getPollData = useCallback(() => {
    setLoading(true);
    get(ref(database, `polls/${pollId}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setPollData(data);
        setLoading(false);
      }
    });
  }, [database, pollId]);
  useEffect(() => {
    getPollData();
  }, [getPollData]);
  const voters = pollData.voters ? Object.keys(pollData.voters) : [];
  const votes = pollData.votes;
  const questions = pollData.questions
    ? getArrFromObj(pollData.questions, "key")
    : [];
  const chartData = [];
  const getVoteCount = (question) => {
    let count = 0;
    const key = question.key;
    voters.forEach((voter) => {
      if (votes && votes[voter] && votes[voter][key]) {
        count++;
      }
    });
    return count;
  };
  questions.forEach((question, idx) => {
    const voteCount = getVoteCount(question);
    chartData.push({ arg: `q${idx}`, val: voteCount });
  });
  const classes = useStyles();
  const navigate = useNavigate();
  return (
    <div className="App-header">
      {loading && <CircularLoading />}
      {!loading && (
        <>
          <div>
            <div
              style={{ flexWrap: "wrap", display: "flex", marginBottom: 2 }}
              className={classes.btns}
            >
              <Button variant="contained" onClick={getPollData}>
                Refresh
              </Button>
              <Button
                variant="contained"
                sx={{ marginLeft: 1 }}
                onClick={() => {
                  navigate(`/poll/${pollId}`);
                }}
              >
                Return to Poll
              </Button>
              <Button
                variant="contained"
                sx={{ marginLeft: 1 }}
                onClick={() => {
                  navigate(`/`);
                }}
              >
                New Poll
              </Button>
              <CopyLink
                style={{ marginLeft: 20, marginTop: 0, height: "auto" }}
              />
            </div>
            <TableContainer className={classes.table} component={Paper}>
              <Table>
                <TableHead sx={{ background: "cadetblue" }}>
                  <TableRow>
                    <TableCell>{""}</TableCell>
                    {voters.map((voter) => (
                      <TableCell
                        sx={{ color: "white", fontWeight: "bold" }}
                        key={voter}
                      >
                        {" "}
                        {voter}{" "}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {questions.map((questionData, idx) => {
                    const row = [];
                    const text = `q${idx}) ${questionData.text}`;
                    row.push(
                      <TableCell key={text} component="th" scope="row">
                        {text}
                      </TableCell>
                    );
                    voters.forEach((voter) => {
                      const checked =
                        votes && votes[voter]
                          ? votes[voter][questionData.key]
                          : false;
                      row.push(
                        <TableCell
                          sx={{
                            color: "white",
                            background: checked ? "#24a346" : "#940f1c",
                            borderRight: "1px solid white",
                          }}
                          key={text + voter}
                        >
                          {checked ? "Yes" : "No"}
                        </TableCell>
                      );
                    });
                    return <TableRow key={questionData.key}>{row}</TableRow>;
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <Paper
            className={classes.chart}
            sx={{ width: "fit-content", marginTop: 10 }}
          >
            <Chart title={pollData.title} dataSource={chartData} id="chart">
              <Series type="bar" />
              <Legend visible={false} />
            </Chart>
          </Paper>
        </>
      )}
    </div>
  );
};
const useStyles = makeStyles({
  table: {
    "&": {
      width: "fit-content !important",
    },
  },
  chart: {
    "&": {
      padding: 0,
    },
  },
  btns: {
    "& > *": {
      marginBottom: "5px !important",
    },
  },
});
export default Results;
