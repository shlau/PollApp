import React from "react";
import App from "./App";
import Poll from "./Poll";
import { Routes, Route } from "react-router-dom";
const MainRouter = (props) => {
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<App />} />
        {/* <Route exact path="/poll" element={<Poll/>} /> */}
        <Route path="/poll/:pollId" element={<Poll />} />
      </Routes>
    </div>
  );
};
export default MainRouter;
