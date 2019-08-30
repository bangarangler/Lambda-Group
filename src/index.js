import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import "semantic-ui-css/semantic.min.css";
import Root from "../src/logic/Root";
import { BrowserRouter } from "react-router-dom";
import { ContextProvider } from "./context/providerComposer";

require("dotenv").config();

ReactDOM.render(
  <BrowserRouter>
    <ContextProvider>
      <Root />
    </ContextProvider>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
