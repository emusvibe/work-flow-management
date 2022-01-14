import React, { useEffect, useState, useContext } from "react";
// @material-ui/core components
// @material-ui/icons
// core components
import { Button, Paper } from "@material-ui/core";
import { BuilderComponent } from "@builder.io/react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { API_URL } from "utils/constants/index.js";
import { AuthenticationContext } from "contexts/auth-context.js";
import { AUTH_TOKEN_NAME } from "utils/constants/index.js";

export default function ViewJob() {
  const { user } = useContext(AuthenticationContext);
  const history = useHistory();
  const state = history.location.state || {};
  const token = localStorage.getItem(AUTH_TOKEN_NAME);
  const config = {
    headers: {
      Authorization: user?.data?.token || token,
    },
  };
  const [clientData, setClientData] = useState([]);
  const [bigData, setBigData] = useState([])
  useEffect(() => {
    axios
      .post(
        `${API_URL}customer-service/Customer/GetCustomersById`,
        [state?.data?.customerId],
        config
      )
      .then((response) => {
        setClientData(...clientData, response?.data?.data);
        setBigData(arr => [...arr, response?.data?.data]);
      })
      .catch((error) => {})
    
    setBigData(arr => [...arr, [state?.data]])
    setTimeout(() => {
      setBigData(arr => [...arr, [user?.data]])
    }, 1000)
    
  }, [])

  return (
    state?.data === undefined ? <h4>Please select a Job</h4> : 
      <Paper style={{ padding: 24 }}>
        <Button
          style={{ marginBottom: "16px" }}
          color="primary"
          variant="outlined"
          onClick={() => history.push("/admin/jobs")}
        >
          Go Back
        </Button>
        <BuilderComponent
          data={{
            data: bigData,
          }}
          name="page"
          entry="ce1c9b1d660d494983e02126bdc2010f"
        />
      </Paper>
  );
}
