import React, { useState, useEffect, useContext } from "react";
// @material-ui/core components
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MaterialTable from "material-table";
// @material-ui/icons
import Assignment from "@material-ui/icons/Assignment";
// core components
import GridContainer from "../../../components/Grid/GridContainer.js";
import GridItem from "../../../components/Grid/GridItem.js";
import Card from "../../../components/Card/Card.js";
import { cardTitle } from "../../../assets/jss/material-dashboard-pro-react.js";
import CardBody from "../../../components/Card/CardBody.js";
import CardIcon from "../../../components/Card/CardIcon.js";
import CardHeader from "../../../components/Card/CardHeader.js";
import TabPanel from "../../../components/TabPanel/TabPanel.js";
import { useHistory } from "react-router-dom";
import { BuilderComponent } from "@builder.io/react";
import axios from "axios";
import { API_URL } from "utils/constants/index.js";
import { AuthenticationContext } from "contexts/auth-context.js";
import { AUTH_TOKEN_NAME } from "utils/constants/index.js";

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
};
const useStyles = makeStyles(styles);

export default function ViewCustomer() {
  const history = useHistory();
  const { user } = useContext(AuthenticationContext);
  const token = localStorage.getItem(AUTH_TOKEN_NAME);
  const state = history.location.state || {};
  const classes = useStyles();
  const theme = useTheme();
  const statements = [
    {
      name: "QU8983984348",
      date: "2021-02-14",
    },
    {
      name: "QU3393447234",
      date: "2021-02-03",
    },
    {
      name: "IN4734837475",
      date: "2021-02-13",
    },
    { 
      name: "IN4387487332", 
      date: "2021-02-22", 
    },
    { 
      name: "QU2344445534", 
      date: "2021-02-28" 
    },
    { 
      name: "IN3338322445", 
      date: "2021-03-16" 
    },
    { 
      name: "IN9984423445", 
      date: "2021-03-23" 
    },
  ];
  const [tableData, setTableData] = useState([]);
  const templateData = [];
  const [value, setValue] = React.useState(0);
  const config = {
    headers: {
      Authorization: user?.data?.token || token,
    },
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const invoiceData = statements?.filter((statement) => {
    
    if(statement.name.startsWith("IN")){
      const data = {
        "name": statement.name,
        "date": statement.date
      }
      return data;
    } 
  });
  const quotationData = statements?.filter((statement) => {
    
    if(statement.name.startsWith("QU")){
      const data = {
        "name": statement.name,
        "date": statement.date
      }
      return data;
    }
  });
  useEffect(() => {
    const getTableData = () => {
      axios
        .get(
          `${API_URL}jobs-service/Invoice/GetInvoiceByCustomer?customerId=Nh10%2BsRi8VlwxW6NYT63ag%3D%3D`,
          config
        )
        .then((response) => {
          setTableData(response.data);
        })
        .catch((error) => {
          
        })
    }
    getTableData();
  }, []);
  templateData.push(tableData.data, state.data);
  let newData =state?.data;
  newData["invoiceItems"] = tableData?.data
  
  return (
    state?.data === undefined ? <h4>Please select a Client</h4> :
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="primary" icon>
            <CardIcon color="primary">
              <Assignment />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>
              {state?.data?.name?.toUpperCase()}
            </h4>
            <Button
              style={{
                float: "right",
                marginRight: theme.spacing(1),
                marginTop: -16,
                marginBottom: theme.spacing(1),
                color: "primary",
              }}
              className={classes.cardIconTitle}
              onClick={() => history.push("/admin/customers")}
            >
              Back to Customers
            </Button>
          </CardHeader>
          <CardBody>
            <Paper square>
              <Tabs
                value={value}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleChange}
              >
                <Tab label="Invoices" />
                <Tab label="Quotations" />
              </Tabs>
            
              <TabPanel value={value} index={0}>
                <MaterialTable
                  title=""
                  columns={[
                    { title: "Name", field: "name" },
                    { title: "Data", field: "date" },
                  ]}
                  data={invoiceData}
                  options={{
                    actionsColumnIndex: -1,
                    search: false,
                  }}
                />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <MaterialTable
                  title=""
                  columns={[
                    { title: "Name", field: "name" },
                    { title: "Date", field: "date" },
                  ]}
                  data={quotationData}
                  options={{
                    actionsColumnIndex: -1,
                    search: false,
                  }}
                />
              </TabPanel>
            </Paper>
            <BuilderComponent
              data={{
                data: newData,
              }}
              name="page"
              entry="1c0f553c6d1d48d08bf694c0c47a08b5"
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
