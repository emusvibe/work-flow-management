import { AuthenticationContext } from "./contexts/auth-context";
import React from "react";
import { Switch, Route } from "react-router-dom";
import AuthLayout from "./layouts/Auth.js";
import AdminLayout from "./layouts/Admin.js";
import { builder } from "@builder.io/react";
import { CircularProgress, Grid, Typography } from "@material-ui/core";
//TODO: Use environment variables (bitbucket)
builder.init("9dfd2aeaa8114534b3b1af83f28a94ef");
const App = () => {
  return (
    <Switch>
      <Route
        path="/"
        render={() => (
          <AuthenticationContext.Consumer>
            {({ allowedAccess, authenticating }) => {
              if (allowedAccess) {
                return (
                  <Route exact to="/admin/dashboard" component={AdminLayout} />
                );
              }
              if (authenticating) {
                return (
                  <Grid
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      height: "100%",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <Typography
                        variant="body1"
                        style={{ marginBottom: "8px" }}
                      >
                        Please wait
                      </Typography>
                      <CircularProgress color={"primary"} />
                    </div>
                  </Grid>
                );
              }
              return (
                <Route exact to="/auth/login-page" component={AuthLayout} />
              );
            }}
          </AuthenticationContext.Consumer>
        )}
      />
    </Switch>
  );
};

export default App;
