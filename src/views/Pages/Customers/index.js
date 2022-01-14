import React, { useState, useContext, useEffect } from "react";
// @material-ui/core components
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import MaterialTable from "material-table";
import { Form, Formik } from "formik";
import TextField from "@material-ui/core/TextField";
import Button from "../../../components/CustomButtons/Button.js";
// @material-ui/icons
import Assignment from "@material-ui/icons/Assignment";
// core components
import GridContainer from "../../../components/Grid/GridContainer.js";
import GridItem from "../../../components/Grid/GridItem.js";
import Card from "../../../components/Card/Card.js";
import CardBody from "../../../components/Card/CardBody.js";
import CardIcon from "../../../components/Card/CardIcon.js";
import CardHeader from "../../../components/Card/CardHeader.js";
import { cardTitle } from "../../../assets/jss/material-dashboard-pro-react.js";
import axios from "axios";
import { API_URL } from "utils/constants/index.js";
import { AuthenticationContext } from "contexts/auth-context.js";
import { AUTH_TOKEN_NAME } from "utils/constants/index.js";
import { useHistory } from "react-router-dom";

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
  formControl: {
    marginTop: "15px",
  },
};

const useStyles = makeStyles(styles);

export default function Customers() {
  const { user } = useContext(AuthenticationContext);
  const token = localStorage.getItem(AUTH_TOKEN_NAME);
  const history = useHistory();
  const config = {
    headers: {
      Authorization: user?.data?.token || token,
    },
  };
  const columns = 
  [
    { title: "Customer", field: "name" },
    { title: "Documents", field: "vatNumber" },
    { title: "Payments", field: "email-" },
    { title: "Paid Amount", field: "vatNumber" },
    { title: "Total", field: "phone_number" },
  ];
  const [customers, setCustomers] = useState([]);

  const getCustomers = () => {
    axios
      .get(
        `${API_URL}customer-service/Customer/GetClientCustomers?clientId=${user?.data?.clientId}`,
        config
      )
      .then((response) => {
        setCustomers(response.data.data);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    getCustomers();
  }, [user?.data]);

  const classes = useStyles();
  const [openModal, setModal] = useState({ modal: false, text: "" });

  const radioGroupRef = React.useRef(null);

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };
  const [userData, setUserData] = useState({});
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [cellNumber, setCellNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [customerStatements, setCustomerStatements] = useState("");

  const getCustomerStatement = (customerId) => {
    setLoading(true);
    axios
      .get(
        `${API_URL}jobs-service/Invoice/GetInvoiceByCustomer?customerId=${customerId}`,
        config
      )
      .then((response) => {
        if (response.statusCode === 200) {
          setLoading(false);
          setCustomerStatements(response?.data?.data[0]?.invoiceId);
        } else {
          setLoading(false);
          setCustomerStatements("");
        }
      })
      .catch((error) => {});
  };
  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="primary" icon>
            <CardIcon color="primary">
              <Assignment />
            </CardIcon>
          </CardHeader>
          <CardBody>
            <MaterialTable
              title=""
              columns={columns}
              data={customers}
              actions={[
                {
                  icon: "email",
                  tooltip: "Email Statement",
                  onClick: (event, rowData) => {
                    getCustomerStatement(`${rowData?.customerId}`);
                    if (customerStatements !== "") {
                      setModal({
                        modal: true,
                        text: "Email Statement",
                      });
                      setUserData({ ...userData, rowData });
                    } else {
                      alert("No invoices for this customer");
                    }
                    setCustomerStatements("");
                  },
                },
                {
                  icon: "visibility",
                  tooltip: "View Customer",
                  onClick: (event, rowData) => {
                    history.push({
                      pathname: "/admin/view-client",
                      state: { data: rowData },
                    });
                  },
                },
              ]}
              options={{
                actionsColumnIndex: -1,
              }}
            />
            <Dialog
              disableBackdropClick
              disableEscapeKeyDown
              maxWidth="xs"
              onEntering={handleEntering}
              aria-labelledby="confirmation-dialog-title"
              fullWidth
              open={openModal.modal}
            >
              <Formik
                initialValues={{
                  convertQuotation: "",
                }}
                onSubmit={() => {
                  axios
                    .post(
                      `${API_URL}customer-service/Email/SendEmail`,
                      {
                        toEmail: email,
                        fromEmail: "peniel.chingombe@gmail.com",
                        subject: "Statement Emailing",
                        body: message,
                      },
                      config
                    )
                    .then((response) => {
                      setCustomers(response.data.data);
                      setModal({
                        modal: false,
                        text: "",
                      });
                    })
                    .catch((err) => {
                      setModal({
                        modal: false,
                        text: "",
                      });
                    });
                  axios
                    .post(
                      `${API_URL}customer-service/Sms/SendSms`,
                      {
                        to: cellNumber,
                        body: message,
                      },
                      config
                    )
                    .then((response) => {
                      //setCustomers(response.data.data);
                      setModal({
                        modal: false,
                        text: "",
                      });
                    })
                    .catch((err) => {
                      setModal({
                        modal: false,
                        text: "",
                      });
                    });
                }}
              >
                {({ values }) => (
                  <Form>
                    <DialogTitle id="confirmation-dialog-title">
                      {openModal.text}
                    </DialogTitle>
                    <DialogContent dividers>
                      <TextField
                        id="email"
                        label="Email"
                        defaultValue={userData.rowData.email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        fullWidth={true}
                      />
                      <TextField
                        id="cellNumber"
                        label="Cell number"
                        defaultValue={userData.rowData.cellNumber}
                        onChange={(e) => {
                          setCellNumber(e.target.value);
                        }}
                        fullWidth={true}
                      />
                      <TextField
                        id="message"
                        label="Message"
                        placeholder="message..."
                        onChange={(e) => {
                          setMessage(e.target.value);
                        }}
                        fullWidth={true}
                        multiline
                      />
                      <TextField
                        id="customerInvoice"
                        label="Customer Invoice"
                        disabled
                        defaultValue={
                          customerStatements === null || ""
                            ? "No invoices for this customer"
                            : customerStatements
                        }
                        fullWidth={true}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button
                        autoFocus
                        color="primary"
                        onClick={() =>
                          setModal({
                            modal: false,
                            text: "",
                          })
                        }
                      >
                        Cancel
                      </Button>
                      <Button color="primary" type="submit">
                        Send Email
                      </Button>
                    </DialogActions>
                  </Form>
                )}
              </Formik>
            </Dialog>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
