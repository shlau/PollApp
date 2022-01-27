import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import MainRouter from "./MainRouter";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import firebaseConfig from "./config";
import { getDatabase } from "firebase/database";
import { initializeApp } from "firebase/app";
import { Helmet, HelmetProvider } from "react-helmet-async";
import "devextreme/dist/css/dx.light.css";
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
ReactDOM.render(
  <React.StrictMode>
    <HelmetProvider>
      <Helmet>
        <meta charSet="utf-8" content="Create a poll" />
        <title>Cyan Poll</title>
      </Helmet>
      <BrowserRouter>
        <MainRouter database={database} />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
