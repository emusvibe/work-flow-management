import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { AUTH_TOKEN_NAME } from "utils/constants";
import { USER_ID } from "utils/constants";
import { API_URL } from "utils/constants";
import { isLoggedIn } from "../utils/isLoggedIn";

const DEFAULT_STATE = {
  authenticating: true,
  signout: () => Promise.resolve(),
  allowedAccess: false,
  setUserAuthenticated: () => {},
  setAllowedAccess: () => {},
  setUserData: () => {},
  user: {},
};

export const AuthenticationContext = createContext(DEFAULT_STATE);

const AuthenticationContextProvider = ({ children }) => {
  const token = localStorage.getItem(AUTH_TOKEN_NAME);
  const userId = localStorage.getItem(USER_ID);
  const [allowAccess, setAllowedAccess] = useState(false);
  const [authenticate, setAuthenticating] = useState(true);
  const [user, setUser] = useState({});
  const history = useHistory();
  const userAuthenticated = (value) => {
    setAuthenticating(value);
  };
  const setUserDetails = (value) => {
    setUser(value);
  };
  const setAllowAccess = (value) => {
    setAllowedAccess(value);
  };

  const signout = () => {
    localStorage.removeItem(AUTH_TOKEN_NAME);
    localStorage.removeItem(USER_ID);
    setAuthenticating(false);
    setAllowedAccess(false);
    setUser({});
    history.push("/auth/login-page");
  };
  const config = {
    headers: {
      Authorization: user?.data?.token || token,
    },
  };
  useEffect(() => {
    if (isLoggedIn()) {
      axios
        .get(
          `${API_URL}accounts-service/Account/GetUserProfile?userId=${
            user?.data?.userId || userId
          }`,
          config
        )
        .then((response) => {
          setAuthenticating(false);
          setUser(response.data);
        })
        .catch((error) => {
          setAuthenticating(false);
        });
      setAllowAccess(true);
    } else {
      history.push("/auth/login-page");
      setAuthenticating(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthenticationContext.Provider
      value={{
        authenticating: authenticate,
        signout,
        allowedAccess: allowAccess,
        setUserAuthenticated: userAuthenticated,
        setAllowedAccess: setAllowAccess,
        setUserData: setUserDetails,
        user: user,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationContextProvider;
