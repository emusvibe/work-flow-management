import React, { useContext, useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles, useTheme } from "@material-ui/core/styles";
// @material-ui/icons
import Assignment from "@material-ui/icons/Assignment";
// core components
import GridContainer from "../../../components/Grid/GridContainer.js";
import GridItem from "../../../components/Grid/GridItem.js";
import Button from "../../../components/CustomButtons/Button.js";
import Card from "../../../components/Card/Card.js";
import CardBody from "../../../components/Card/CardBody.js";
import CardIcon from "../../../components/Card/CardIcon.js";
import CardHeader from "../../../components/Card/CardHeader.js";
import { cardTitle } from "../../../assets/jss/material-dashboard-pro-react.js";
import { useHistory } from "react-router-dom";
import MaterialTable from "material-table";
import axios from "axios";
import { API_URL } from "utils/constants/index.js";
import { AuthenticationContext } from "contexts/auth-context.js";
import { AUTH_TOKEN_NAME } from "utils/constants/index.js";
import { EditInvoice } from "./EditInvoice.js";
import InvoiceContext from "contexts/invoice-context.js";

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
};
const useStyles = makeStyles(styles);
export default function Invoices() {
  const { user } = useContext(AuthenticationContext);
  const [data, setData] = useState([]);
  const token = localStorage.getItem(AUTH_TOKEN_NAME);

  const config = {
    headers: {
      Authorization: user?.data?.token || token,
    },
  };

  useEffect(() => {
    const getInvoiceByClient = () => {
      axios
        .get(
          `${API_URL}jobs-service/Invoice/GetInvoiceByClient?clientId=${user?.data?.clientId}`,
          config
        )
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {});
    };
    getInvoiceByClient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const [enableEdit, setEnableEdit] = useState(false);
  const [invoiceData, setInvoiceData] = useState({});
  const setEnableEditStatus = (value) => {
    setEnableEdit(value);
  };
  
  return (
    <InvoiceContext.Provider
      value={{
        editInvoiceStatus: enableEdit,
        setEditInvoice: setEnableEditStatus,
      }}
    >
      <GridContainer>
        <GridItem xs={12}>
          <Card>
            <CardHeader color="primary" icon>
              <CardIcon color="primary">
                <Assignment />
              </CardIcon>
              {!enableEdit ? (
                <Button
                  style={{
                    float: "right",
                    marginRight: theme.spacing(1),
                    marginTop: -16,
                    marginBottom: theme.spacing(1),
                  }}
                  className={classes.cardIconTitle}
                  onClick={() => history.push("/admin/create-invoice")}
                >
                  Create new invoice
                </Button>
              ) : (
                ""
              )}
            </CardHeader>
            <CardBody>
              {data && data.data !== undefined && !enableEdit ? (
                <MaterialTable
                  title=""
                  columns={[
                    {
                      title: "Client name",
                      field: "customerName",
                      render: (data) => {
                        return <p key={data.created_at}>{data.customerName}</p>;
                      },
                    },
                    {
                      title: "Invoice Number",
                      field: "invoiceNumber",
                      render: (data) => {
                        return <p>{data.invoiceNumber?`#${data.invoiceNumber}`:'N/A'}</p>;
                      },
                    },
                    {
                      title: "Status",
                      field: "status",
                      render: (data) => {
                        return <p>{data.status}</p>;
                      },
                    },
                    {
                      title: "Priority",
                      field: "priority",
                      render: (data) => {
                        return <p>{data.priority?data.priority:'N/A'}</p>;
                      },
                    },
                    {
                      title: "Due Date",
                      field: "dueDate",
                      render: (data) => {
                        return <p>{(new Date(data.dueDate).toISOString().slice(0, 16)).toString().replace('T',' ')}</p>;
                      },
                    },
                    {
                      title: "Job Card Number",
                      field: "jobNumber",
                      render: (data) => {
                        return <p>{data.jobNumber?data.jobNumber:'N/A'}</p>;
                      },
                    },
                    {
                      title: "Address",
                      field: "address",
                      render: (data) => {
                        return <p>{data.address?data.address:'N/A'}</p>;
                      },
                    },
                    {
                      title: "Created At",
                      field: "created_at",
                      render: (data) => {
                        return <p>{(new Date(data.created_at).toISOString().slice(0, 16)).toString().replace('T',' ')}</p>;
                      },
                    },
                    {
                      title: "Updated At",
                      field: "updated_at",
                      render: (data) => {
                        return <p>{(new Date(data.updated_at).toISOString().slice(0, 16)).toString().replace('T',' ')}</p>;
                      },
                    },
                  ]}
                  data={data.data.reverse()}
                  actions={[
                    {
                      icon: "visibility",
                      tooltip: "View Invoice",
                      onClick: (event, rowData) => {
                        setEnableEditStatus(true);
                        setInvoiceData(rowData);
                      },
                    },
                  ]}
                  options={{
                    actionsColumnIndex: -1,
                  }}
                />
              ) : (
                <EditInvoice invoiceData={invoiceData} />
              )}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </InvoiceContext.Provider>
  );
}
