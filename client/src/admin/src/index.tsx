import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import "../../../public/css/global.css";
import "../../../public/css/bulma.min.css";
import "../admin.css";
import { BrowserRouter as Router } from "react-router-dom";
import "../favicon.png";

import { App } from "./components/App";
import ErrorBoundary from "./components/ErrorBoundary";
import NavBar from "./components/navbar";
// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept();
}

const appBase = (
  <Router basename="/admin">
    <ErrorBoundary>
      <NavBar />
      <App />

    </ErrorBoundary>
  </Router>
);

ReactDOM.render(
  appBase,
  document.getElementById("root")
);
