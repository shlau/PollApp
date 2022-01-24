import logo from "./logo.svg";
import "./App.css";
import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push } from "firebase/database";
import { useNavigate } from "react-router-dom";

const firebaseConfig = {
  apiKey: "AIzaSyCYpfY6-nwPPKZp7O5BClCmQYy3okNn_GM",
  authDomain: "cyan-poll-14eb3.firebaseapp.com",
  databaseURL: "https://cyan-poll-default-rtdb.firebaseio.com/",
  storageBucket: "gs://cyan-poll.appspot.com",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
function App() {
  const navigate = useNavigate();
  const createNewPoll = () => {
    const pollsRef = ref(database, "polls");
    const pollId = push(pollsRef, { title: pollName }).key;
    navigate(`/poll/${pollId}`);
  };
  const [pollName, setPollName] = useState("");
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <input
          type="text"
          value={pollName}
          onChange={(e) => setPollName(e.target.value)}
        />
        <button onClick={createNewPoll}>Create New Poll</button>
      </header>
    </div>
  );
}

export default App;
