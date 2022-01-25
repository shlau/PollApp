import React from "react";
import App from "./App";
import Poll from "./Poll";
import Results from "./Results";
import { Routes, Route } from "react-router-dom";
const MainRouter = ({ database }) => {
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<App database={database} />} />
        <Route path="/poll/:pollId" element={<Poll database={database} />} />
        <Route
          path="/results/:pollId"
          element={<Results database={database} />}
        />
      </Routes>
    </div>
  );
};
export default MainRouter;
