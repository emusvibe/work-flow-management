import React, { useContext, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import { Formik, Form } from "formik";
import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";
import { CircularProgress, Typography } from "@material-ui/core";
import { API_URL } from "utils/constants";
import { useHistory } from "react-router-dom";
import { AuthenticationContext } from "../../contexts/auth-context";
import axios from "axios";
import { AUTH_TOKEN_NAME } from "utils/constants";
import { USER_ID } from "utils/constants";
const useStyles = makeStyles(styles);

export default function LoginPage() {
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  React.useEffect(() => {
    let id = setTimeout(function () {
      setCardAnimation("");
    }, 700);
    // Specify how to clean up after this effect:
    return function cleanup() {
      window.clearTimeout(id);
    };
  });
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(false);
  const { setAllowedAccess, setAuthenticating, setUserData } = useContext(
    AuthenticationContext
  );
  const history = useHistory();
  return (
    <div className={classes.container}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={6} md={4}>
          <Formik
            initialValues={{ username: "", password: "" }}
            onSubmit={async (values) => {
              setLoading(true);
              setError(false);
              try {
                await axios
                  .post(`${API_URL}accounts-service/Account/Login`, state)
                  .then((response) => {
                    if (response.data.statusCode === 200) {
                      localStorage.setItem(
                        AUTH_TOKEN_NAME,
                        response.data.data.token
                      );
                      localStorage.setItem(USER_ID, response.data.data.userId);

                      setUserData(response.data);
                      setAllowedAccess(true);
                      setAuthenticating(false);
                      history.push("/admin/dashboard");

                      setLoading(false);
                    } else {
                      setAllowedAccess(false);
                      setAuthenticating(false);
                      setError(true);
                      setLoading(false);
                    }
                  });
              } catch (err) {
                setError(true);
                setLoading(false);
              }
            }}
          >
            {(props) => (
              <Form onSubmit={props.handleSubmit}>
                <Card login className={classes[cardAnimaton]}>
                  <CardHeader
                    className={`${classes.cardHeader} ${classes.textCenter}`}
                    color="rose"
                  >
                    <h4 className={classes.cardTitle}>
                      Welcome to Worxflow360
                    </h4>
                  </CardHeader>
                  <CardBody>
                    <CustomInput
                      labelText="Username"
                      id="username"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        onChange: (e) =>
                          setState({
                            ...state,
                            username: e.target.value,
                          }),

                        endAdornment: (
                          <InputAdornment position="end">
                            <Email className={classes.inputAdornmentIcon} />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <CustomInput
                      labelText="Password"
                      id="password"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        onChange: (e) =>
                          setState({
                            ...state,
                            password: e.target.value,
                          }),
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon className={classes.inputAdornmentIcon}>
                              lock_outline
                            </Icon>
                          </InputAdornment>
                        ),
                        type: "password",
                        autoComplete: "off",
                      }}
                    />
                    {error && (
                      <Typography variant="caption" color="error">
                        Username / Password incorrect
                      </Typography>
                    )}
                  </CardBody>
                  <CardFooter className={classes.justifyContentCenter}>
                    <Button
                      color="rose"
                      simple
                      size="lg"
                      block
                      type="submit"
                      disabled={state.email === "" || state.password === ""}
                    >
                      {loading ? <CircularProgress size="medium" /> : "Sign In"}
                    </Button>
                  </CardFooter>
                </Card>
              </Form>
            )}
          </Formik>
        </GridItem>
      </GridContainer>
    </div>
  );
}
