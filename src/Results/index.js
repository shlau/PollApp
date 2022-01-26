import React, { useEffect, useState } from "react";
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
const Results = ({ database }) => {
  const { pollId } = useParams();
  const [pollData, setPollData] = useState({});
  useEffect(() => {
    get(ref(database, `polls/${pollId}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setPollData(data);
        console.log(data);
      }
    });
  }, [database, pollId]);
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
      if (votes[voter][key]) {
        count++;
      }
    });
    return count;
  };
  questions.forEach((question) => {
    const voteCount = getVoteCount(question);
    chartData.push({ arg: question.text, val: voteCount });
  });
  const classes = useStyles();
  return (
    <div className="App-header">
      <TableContainer className={classes.table} component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{""}</TableCell>
              {voters.map((voter) => (
                <TableCell key={voter}> {voter} </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.map((questionData) => {
              const row = [];
              const text = questionData.text;
              row.push(
                <TableCell key={text} component="th" scope="row">
                  {text}
                </TableCell>
              );
              voters.forEach((voter) => {
                const checked = votes[voter][questionData.key];
                row.push(
                  <TableCell key={text + voter}>
                    {checked ? "Yes" : "No"}
                  </TableCell>
                );
              });
              return <TableRow key={questionData.key}>{row}</TableRow>;
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Paper sx={{ minWidth: 560, marginTop: 10, padding: 10 }}>
        <Chart title={"Results"} dataSource={chartData} id="chart">
          <Series type="bar" />
          <Legend visible={false} />
        </Chart>
      </Paper>
    </div>
  );
};
const useStyles = makeStyles({
  table: {
    "&": {
      width: "fit-content",
    },
  },
});
export default Results;
