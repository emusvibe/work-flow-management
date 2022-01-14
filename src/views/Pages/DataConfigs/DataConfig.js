import React, { useContext, useState, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
// core components
import GridContainer from "../../../components/Grid/GridContainer.js";
import GridItem from "../../../components/Grid/GridItem.js";
import Card from "../../../components/Card/Card.js";
import { AuthenticationContext } from "contexts/auth-context";
import { AUTH_TOKEN_NAME } from "utils/constants";
import CardText from "../../../components/Card/CardText.js";
import CardBody from "../../../components/Card/CardBody.js";
import CardHeader from "../../../components/Card/CardHeader.js";
import { cardTitle } from "../../../assets/jss/material-dashboard-pro-react.js";
import Snackbar from "components/Snackbar/Snackbar.js";
import { Check, Close } from "@material-ui/icons";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Paper from "@material-ui/core/Paper";
import TabPanel from "../../../components/TabPanel/TabPanel.js";
import { SystemTable } from "../../Components/SystemConfigTable";
import { StatusTable } from "../../Components/StatusTable";
import { PaymentTable } from "../../Components/PaymentTable";
import { JobEmailTable } from "../../Components/JobEmailTable";

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "8px",
    marginBottom: "0px",
  },
};

const useStyles = makeStyles(styles);

export default function DataConfigs() {
  const classes = useStyles();
  const theme = useTheme();
  const { user } = useContext(AuthenticationContext);
  const token = localStorage.getItem(AUTH_TOKEN_NAME);
  const config = {
    headers: {
      Authorization: user?.data?.token || token,
    },
  };
  const [switchState, setSwitchState] = useState(false);
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [openFailureSnackbar, setFailureSnackbar] = useState(false);
  const [openSuccessSnackbar, setSuccessSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [failMessage, setFailMessage] = useState("");
  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="rose" text>
            <CardText color="rose">
              <h4 className={classes.cardTitle}>Configs</h4>
            </CardText>
          </CardHeader>
          <CardBody>
            <Snackbar
              place="tr"
              color="success"
              icon={Check}
              message={successMessage}
              open={openSuccessSnackbar}
              closeNotification={() => setSuccessSnackbar(false)}
              close
            />
            <Snackbar
              place="tr"
              color="danger"
              icon={Close}
              message={failMessage}
              open={openFailureSnackbar}
              closeNotification={() => setFailureSnackbar(false)}
              close
            />
            <Paper square elevation={0}>
              <Tabs
                value={value}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleChange}
              >
                <Tab label="System Configs" />
                <Tab label="Status Configs" />
                <Tab label="Payment Configs" />
                <Tab label="Job Email Configs" />
              </Tabs>

              <TabPanel value={value} index={0}>
                <SystemTable clientId={user?.data?.clientId} config={config}/>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <StatusTable clientId={user?.data?.clientId} config={config} />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <PaymentTable clientId={user?.data?.clientId} config={config} />
              </TabPanel>
              <TabPanel value={value} index={3}>
              <JobEmailTable clientId={user?.data?.clientId} config={config} />
              </TabPanel>
            </Paper>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
