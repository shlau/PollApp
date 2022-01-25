import React from "react";
import { useParams } from "react-router-dom";
const Results = (props) => {
  const { pollId } = useParams();
  return <p>{pollId}</p>;
};
export default Results;
