import React, { useEffect, useState, useContext } from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// react plugin for creating vector maps
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
// import ContentCopy from "@material-ui/icons/ContentCopy";
import Store from "@material-ui/icons/Store";
// import InfoOutline from "@material-ui/icons/InfoOutline";
import DateRange from "@material-ui/icons/DateRange";
import Update from "@material-ui/icons/Update";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardFooter from "components/Card/CardFooter.js";
import axios from "axios";
import { API_URL } from "utils/constants/index.js";
import { AuthenticationContext } from "contexts/auth-context.js";
import { AUTH_TOKEN_NAME } from "utils/constants/index.js";
import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
const useStyles = makeStyles(styles);
export default function Dashboard() {
  const classes = useStyles();
  const { user } = useContext(AuthenticationContext);
  const [jobData, setJobData] = useState([]);
  const [invoiceData, setInvoiceData] = useState([]);
  const [quotationData, setQuotationData] = useState([]);
  const token = localStorage.getItem(AUTH_TOKEN_NAME);
  const config = {
    headers: {
      Authorization: user?.data?.token || token,
    },
  };
  useEffect(() => {
    const completedJobs = () => {
      user?.data?.clientId &&
        axios
          .get(
            `${API_URL}jobs-service/Jobs/GetJobCards?clientId=${user?.data?.clientId}`,
            config
          )
          .then((response) => {
            setJobData(response.data.data);
          })
          .catch((error) => {});
    };
    const getInvoiceByClient = () => {
      axios
        .get(
          `${API_URL}jobs-service/Invoice/GetInvoiceByClient?clientId=${user?.data?.clientId}`,
          config
        )
        .then((response) => {
          setInvoiceData(response.data.data);
        })
        .catch((error) => {});
    };
    const getQoutations = () => {
      axios
        .get(
          `${API_URL}jobs-service/Quotation/GetAllQuotationsByClient?clientId=${user?.data?.clientId}`,
          config
        )
        .then((response) => {
          setQuotationData(response.data.data.quotationList);
        })
        .catch((error) => {});
    };
    getInvoiceByClient();
    completedJobs();
    getQoutations();
  }, []);
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <Icon>content_copy</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Jobs Completed</p>
              <h3 className={classes.cardTitle}>
                {jobData.length} <small></small>
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                Last job {jobData[jobData.length - 1]?.created_at?.substring(0, 10)}
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <Store />
              </CardIcon>
              <p className={classes.cardCategory}>Invoices Issued</p>
              <h3 className={classes.cardTitle}>{invoiceData.length}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                Last invoice {invoiceData[invoiceData.length - 1]?.created_at?.substring(0, 10)}
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <Icon>info_outline</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Unpaid Invoices</p>
              <h3 className={classes.cardTitle}>
                {invoiceData.length}/{quotationData.length}
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                Last 24 Hours
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <Icon>content_copy</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Quotations Issued</p>
              <h3 className={classes.cardTitle}>
                {quotationData.length} <small></small>
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Update />
                Last quotation{" "}
                {quotationData[quotationData.length - 1]?.created_at?.substring(0, 10)}
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}