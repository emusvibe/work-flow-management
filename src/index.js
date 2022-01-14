import React from "react";
import ReactDOM from "react-dom";
import "assets/scss/material-dashboard-pro-react.scss?v=1.9.0";
import App from "./App";
import { Router } from "react-router";
import { createBrowserHistory } from "history";
import AuthenticationContextProvider from "contexts/auth-context";

//TODO: Add api key to env variable (bitbucket)

const RouterWrapper = ({ children }) => {
  const history = createBrowserHistory();
  return <Router history={history}>{children}</Router>;
};
ReactDOM.render(
  <RouterWrapper>
    <AuthenticationContextProvider>
      <App />
    </AuthenticationContextProvider>
  </RouterWrapper>,
  document.getElementById("root")
);
