import React, { useContext, useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles, useTheme } from "@material-ui/core/styles";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardText from "components/Card/CardText.js";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { cardTitle } from "../../../assets/jss/material-dashboard-pro-react.js";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { API_URL } from "utils/constants/index.js";
import { Field, FieldArray, Form, Formik } from "formik";
import _ from "lodash";
import CustomInput from "components/CustomInput/CustomInput.js";
import CardBody from "components/Card/CardBody.js";
import {
  Input,
  Select,
  Typography,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  CircularProgress,
  TextField
} from "@material-ui/core";
import { AuthenticationContext } from "contexts/auth-context";
import { AUTH_TOKEN_NAME } from "utils/constants";
import Snackbar from "components/Snackbar/Snackbar.js";
import { Check, Close } from "@material-ui/icons";

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
};
const useStyles = makeStyles(styles);
export default function CreateInvoice() {
  const { user } = useContext(AuthenticationContext);
  const token = localStorage.getItem(AUTH_TOKEN_NAME);
  const config = {
    headers: {
      Authorization: user?.data?.token || token,
    },
  };

  const [initialValues, setInitialValues] = useState({
    invoiceItems:
      
      [
        {
          name: "",
          title: "",
          quantity: 0,
          price: 0,
          tax: 0.15,
          amount: 0,
          invoiceId: "",
          itemId: "",
          isRemoved: 0,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
  });
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const state = history.location.state || {};
  const customerInitialValues = {
    name: "",
    email: "",
    phone_number: "",
    vatNumber: "",
    companyReg: "",
  };
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState(customerInitialValues);
  const [editData, setEditData] = useState();
  const [tax, setTax] = useState(0);
  useEffect(() => {
    if (!_.isEmpty(state)) {
      setEditData(state?.data?.rowData);
    }
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
    const setItemValues = () => {
      if(state?.data?.rowData?.jobItems !== undefined){
        setInitialValues({...initialValues, invoiceItems: state?.data?.rowData?.jobItems})
      }
      else if(state?.data?.rowData?.quotationItems !== undefined){
        setInitialValues({...initialValues, invoiceItems: state?.data?.rowData?.quotationItems})
      }
    }
    const getTaxConfiguration = () => {
      axios
        .get(
          `${API_URL}accounts-service/Account/GetSystemConfig?clientId=${user?.data?.clientId}`,
          config
        )
        .then((response) => {
          const { quotationTax } = response?.data?.data;
          setTax(quotationTax);
        })
        .catch((error) => {});
    };
    getTaxConfiguration()
    setItemValues();
    getCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [customerId, setCustomerId] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [priority, setPriority] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("");
  const [openModal, setModal] = useState({ modal: false, text: "" });
  const [dueDate, setDueDate] = useState("");
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const radioGroupRef = React.useRef(null);

  const handleCustomerId = (event) => {
    if(editData !== undefined){
      setEditData({...editData, customerId: event.target.value});
    } else{
      setCustomerId(event.target.value);
    }
  };
  const handleStatus = (event) => {
    setStatus(event.target.value);
  };

  const handlePaymentType = (event) => {
    setPaymentType(event.target.value);
  };

  const handlePriority = (event) => {
    setPriority(event.target.value);
  };

  const handleCancel = () => {
    setModal(false);
  };

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };
  const [openFailureSnackbar, setFailureSnackbar] = useState(false);
  const [openSuccessSnackbar, setSuccessSnackbar] = useState(false);
  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="rose" text>
            <CardText color="rose">
              <h4 className={classes.cardTitle}>
                {state.data === undefined ? "New Invoice" : "Update Invoice"}
              </h4>
            </CardText>
          </CardHeader>
          <CardBody>
            <Snackbar
              place="tr"
              color="success"
              icon={Check}
              message="A new invoice has been created successfully"
              open={openSuccessSnackbar}
              closeNotification={() => setSuccessSnackbar(false)}
              close
            />
            <Snackbar
              place="tr"
              color="danger"
              icon={Close}
              message="Something went wrong could not create an invoice, 
              please check that you filled all fields"
              open={openFailureSnackbar}
              closeNotification={() => setFailureSnackbar(false)}
              close
            />
            <GridContainer>
              <GridItem>
                <Formik
                  initialValues={initialValues}
                  enableReinitialize
                  onSubmit={(values) => {
                    state?.data?.rowData !== undefined ?
                      axios
                        .put(
                          `${API_URL}jobs-service/Invoice/UpdateInvoice`,
                          [
                            {
                              invoiceId:
                                state?.data?.rowData !== undefined
                                  ? state?.data?.rowData?.invoiceId : state?.data ? state?.data?.invoiceId : "",
                              customerId:
                                state.data?.rowData !== undefined
                                  ? state?.data?.rowData?.customerId
                                  : state?.data ? state?.data?.customerId : "",
                              clientId: user?.data?.clientId,
                              employeeId: user?.data?.employeeId,
                              quotationId:
                                state.data !== undefined
                                  ? user?.data?.quotationId
                                  : "",
                              customerName: state.data?.rowData?.customerName !== undefined
                              ? state?.data?.rowData?.customerName
                              : state?.data ? state?.data?.customerName : "",
                              status,
                              paymentType,
                              priority,
                              dueDate,
                              address,
                              created_at: new Date(),
                              updated_at: new Date(),
                              invoiceItems: values.invoiceItems,
                            },
                          ],
                          config
                        )
                        .then((response) => {
                          if(response.data.statusCode === 200){
                            setSuccessSnackbar(true);
                            setTimeout(() => {
                              history.push("/admin/invoices");
                              setLoading(false);
                            }, 3000);
                          } else {
                            setFailureSnackbar(true)
                          }
                        })
                        .catch((error) => {
                          setFailureSnackbar(true);
                          setTimeout(() => setFailureSnackbar(false), 3000)
                        })
                      :
                        axios
                        .post(
                          `${API_URL}jobs-service/Invoice/CreateInvoice`,
                          [
                            {
                              invoiceId:
                                state.data !== undefined
                                  ? user?.data?.invoiceId
                                  : "",
                              clientId: user?.data?.clientId,
                              employeeId: user?.data?.employeeId,
                              quotationId:
                                state.data !== undefined
                                  ? user?.data?.quotationId
                                  : "",
                              customerName: "",
                              status,
                              customerId,
                              paymentType,
                              priority,
                              address,
                              dueDate,
                              created_at: new Date(),
                              updated_at: new Date(),
                              invoiceItems: values.invoiceItems,
                            },
                          ],
                          config
                        )
                        .then((response) => {
                          if(response.data.statusCode === 200){
                            setSuccessSnackbar(true);
                            setTimeout(() => {
                              history.push("/admin/invoices");
                              setLoading(false);
                            }, 3000);
                          } else {
                            setFailureSnackbar(true);
                          }
                        })
                        .catch((error) => {
                          setFailureSnackbar(true);
                          setTimeout(() => setFailureSnackbar(false), 3000);
                        });
                  }}
                  render={({ values }) => {
                    
                    return (
                      <Form>
                        <div style={{ display: "flex" }}>
                          <FormControl
                            required
                            fullWidth
                            style={{
                              marginBottom: theme.spacing(2),
                            }}
                          >
                            <InputLabel
                              htmlFor="simple-select"
                              className={classes.selectLabel}
                            >
                              Customer
                            </InputLabel>
                            <Select
                              value={editData !== undefined 
                                ? editData?.customerId 
                                : customerId}
                              onChange={handleCustomerId}
                            >
                              {customers?.map((customer) => (
                                <MenuItem
                                  key={customer.customerId}
                                  value={customer.customerId}
                                >
                                  {customer.name}
                                </MenuItem>
                              ))}
                              <Button
                                fullWidth
                                onClick={() =>
                                  setModal({
                                    modal: true,
                                    text: "Create New Customer",
                                  })
                                }
                              >
                                Add New Customer
                              </Button>
                            </Select>
                          </FormControl>
                          <FormControl
                            required
                            fullWidth
                            style={{
                              marginBottom: theme.spacing(2),
                              marginLeft: theme.spacing(1),
                            }}
                          >
                            <InputLabel
                              htmlFor="simple-select"
                              className={classes.selectLabel}
                            >
                              Payment Type
                            </InputLabel>
                            <Select
                              value={paymentType}
                              onChange={handlePaymentType}
                            >
                              <MenuItem disabled>Select Payment type</MenuItem>
                              <MenuItem value="Cash">
                                Cash
                              </MenuItem>
                              <MenuItem value="EFT">
                                EFT
                              </MenuItem>
                              <MenuItem value="Bank Card">
                                Bank Card
                              </MenuItem>
                            </Select>
                          </FormControl>
                          <FormControl
                            required
                            fullWidth
                            style={{
                              marginBottom: theme.spacing(2),
                              marginLeft: theme.spacing(1),
                            }}
                          >
                            <InputLabel
                              htmlFor="simple-select"
                              className={classes.selectLabel}
                            >
                              Priority
                            </InputLabel>
                            <Select
                              value={priority}
                              onChange={handlePriority}
                            >
                              <MenuItem disabled>Select Priority</MenuItem>
                              <MenuItem value="High">
                                High
                              </MenuItem>
                              <MenuItem value="Medium">
                                Medium
                              </MenuItem>
                              <MenuItem value="Low">
                                Low
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </div>
                        <div style={{ display: "flex" }}>
                          <FormControl
                            fullWidth
                            style={{
                              marginRight: theme.spacing(1),
                            }}
                          >
                            <CustomInput
                              labelText="Address"
                              id="address"
                              required
                              formControlProps={{
                                fullWidth: true,
                              }}
                              inputProps={{
                                value: address,
                                onChange: (e) => {
                                  setAddress(e.target.value);
                                },
                              }}
                            />
                          </FormControl>
                          <FormControl
                            fullWidth
                            style={{
                              marginTop: theme.spacing(2),
                              marginRight: theme.spacing(1),
                            }}
                          >
                            <TextField
                              id="dueDate"
                              label="Due Date"
                              type="datetime-local"
                              required
                              value={
                                editData?.dueDate !== undefined
                                  ? new Date(editData?.dueDate)
                                      ?.toISOString()
                                      .split("Z")[0]
                                  : dueDate
                              }
                              onChange={(e) => {
                                setDueDate(e.target.value);
                                if (dueDate !== undefined) {
                                  setEditData({
                                    ...editData,
                                    dueDate: e.target.value,
                                  });
                                }
                              }}
                              InputLabelProps={{
                                fullWidth: true,
                              }}
                            />
                          </FormControl>
                          <FormControl
                            required
                            fullWidth
                            style={{
                              marginTop: 11,
                            }}
                          >
                            <InputLabel
                              htmlFor="simple-select"
                              className={classes.selectLabel}
                            >
                              Status
                            </InputLabel>
                            <Select
                              value={status}
                              onChange={handleStatus}
                              defaultValue={"unpaid"}
                            >
                              <MenuItem disabled>Select status</MenuItem>
                              <MenuItem value="paid">Paid</MenuItem>
                              <MenuItem value="unpaid">Unpaid</MenuItem>
                              <MenuItem value="pending">Pending</MenuItem>
                            </Select>
                          </FormControl>
                        </div>
                        <FieldArray
                          name="invoiceItems"
                          render={({ insert, remove, push, setFieldValue }) => (
                            <>
                              <div style={{ marginTop: theme.spacing(2) }}>
                                <div className="container">
                                  <div className="row clearfix">
                                    <div className="col-md-12 column">
                                      <table
                                        className="table table-bordered table-hover"
                                        id="tab_logic"
                                      >
                                        <thead>
                                          <tr>
                                            <th className="text-center"> </th>
                                            <th className="text-center">
                                              {" "}
                                              Item Code{" "}
                                            </th>
                                            <th className="text-center">
                                              {" "}
                                              Description{" "}
                                            </th>
                                            <th className="text-center">
                                              {" "}
                                              Quantity{" "}
                                            </th>
                                            <th className="text-center">
                                              {" "}
                                              Price{" "}
                                            </th>
                                            <th className="text-center">
                                              {" "}
                                              VAT{" "}
                                            </th>
                                            <th className="text-center">
                                              {" "}
                                              Amount{" "}
                                            </th>
                                            <th className="text-center"> </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {values &&
                                            values.invoiceItems &&
                                            values.invoiceItems.length > 0 &&
                                            values.invoiceItems.map(
                                              (invoiceItems, index) => {
                                                return (
                                                  <tr id="name">
                                                    <td>{index + 1}</td>
                                                    <td>
                                                      <Field
                                                        name={`invoiceItems.${index}.name`}
                                                        type="text"
                                                        render={({
                                                          field,
                                                          form,
                                                        }) => (
                                                          <Input
                                                            {...field}
                                                            type="text"
                                                            value={invoiceItems?.name}
                                                            onChange={(e) => {
                                                              const name =
                                                                e.target.value;
                                                              form.setFieldValue(
                                                                `invoiceItems.${index}.name`,
                                                                name
                                                              );
                                                            }}
                                                          />
                                                        )}
                                                      />
                                                    </td>
                                                    <td>
                                                      <Field
                                                        name={`invoiceItems.${index}.title`}
                                                        type="text"
                                                        render={({
                                                          field,
                                                          form,
                                                        }) => (
                                                          <Input
                                                            {...field}
                                                            type="text"
                                                            onChange={(e) => {
                                                              const title =
                                                                e.target.value;
                                                              form.setFieldValue(
                                                                `invoiceItems.${index}.title`,
                                                                title
                                                              );
                                                            }}
                                                          />
                                                        )}
                                                      />
                                                    </td>
                                                    <td>
                                                      <Field
                                                        name={`invoiceItems.${index}.quantity`}
                                                        type="number"
                                                        render={({
                                                          field,
                                                          form,
                                                        }) => (
                                                          <Input
                                                            {...field}
                                                            type="number"
                                                            onChange={(e) => {
                                                              const quantity =
                                                                e.target.value;
                                                              form.setFieldValue(
                                                                `invoiceItems.${index}.quantity`,
                                                                parseFloat(
                                                                  quantity
                                                                )
                                                              );
                                                              form.setFieldValue(
                                                                `invoiceItems.${index}.amount`,
                                                                quantity *
                                                                  values
                                                                    .invoiceItems[
                                                                    index
                                                                  ].price
                                                              );
                                                            }}
                                                          />
                                                        )}
                                                      />
                                                    </td>
                                                    <td>
                                                      <Field
                                                        name={`invoiceItems.${index}.price`}
                                                        type="number"
                                                        render={({
                                                          field,
                                                          form,
                                                        }) => (
                                                          <Input
                                                            {...field}
                                                            type="number"
                                                            onChange={(e) => {
                                                              const price =
                                                                e.target.value;
                                                              form.setFieldValue(
                                                                `invoiceItems.${index}.price`,
                                                                parseFloat(
                                                                  price
                                                                )
                                                              );
                                                              form.setFieldValue(
                                                                `invoiceItems.${index}.amount`,
                                                                values
                                                                  .invoiceItems[
                                                                  index
                                                                ].quantity *
                                                                  price
                                                              );
                                                            }}
                                                          />
                                                        )}
                                                      />
                                                    </td>
                                                    <td>
                                                      <Field
                                                        name={`invoiceItems.${index}.tax`}
                                                        type="number"
                                                        render={({field}) => (
                                                          <Input
                                                            {...field}
                                                            type="number"
                                                            disabled={true}
                                                            value={tax}
                                                          />
                                                        )}
                                                      />
                                                    </td>
                                                    <td>
                                                      <Input
                                                        name={`invoiceItems.${index}.amount`}
                                                        type="number"
                                                        value={
                                                          values.invoiceItems[
                                                            index
                                                          ].quantity *
                                                          values.invoiceItems[
                                                            index
                                                          ].price
                                                        }
                                                        disabled={true}
                                                      />
                                                    </td>
                                                    <td>
                                                      {values.invoiceItems
                                                        .length === 1 ? null : (
                                                        <Field
                                                          name={`invoiceItems.${index}.isRemoved`}
                                                          type="number"
                                                          render={({
                                                            field,
                                                            form,
                                                          }) => (
                                                            <Button
                                                              variant="outlined"
                                                              color="secondary"
                                                              onClick={() => {
                                                                if (
                                                                  state.data
                                                                ) {
                                                                  form.setFieldValue(
                                                                    `invoiceItems.${index}.isRemoved`,
                                                                    1
                                                                  );
                                                                  remove(index);
                                                                } else {
                                                                  remove(index);
                                                                }
                                                              }}
                                                              className="btn btn-outline-danger btn-sm"
                                                            >
                                                              Remove
                                                            </Button>
                                                          )}
                                                        />
                                                      )}
                                                    </td>
                                                  </tr>
                                                );
                                              }
                                            )}
                                        </tbody>
                                      </table>
                                      <div
                                        style={{
                                          textAlign: "end",
                                          paddingRight: 94,
                                        }}
                                      >
                                        <Typography variant="p" align="right">
                                          Subtotal: R
                                          {_.sumBy(
                                            values.invoiceItems,
                                            (quotation) => {
                                              if (state.data !== undefined) {
                                                return quotation.amount;
                                              } else {
                                                return (
                                                  quotation.quantity *
                                                  quotation.price
                                                );
                                              }
                                            }
                                          )}
                                        </Typography>
                                        <p>
                                          Total (ZAR): R
                                          {_.sumBy(
                                            values && values.invoiceItems,
                                            (quotation) => {
                                              if (state.data !== undefined) {
                                                return quotation.amount;
                                              } else {
                                                return (values.invoiceItems &&
                                                  values.invoiceItems[0].tax) ||
                                                  0
                                                  ? quotation.quantity *
                                                      quotation.price
                                                  : quotation.quantity *
                                                      quotation.price *
                                                      ((values.invoiceItems &&
                                                        values.invoiceItems[0]
                                                          .tax) ||
                                                        0 / 100) +
                                                      quotation.quantity *
                                                        quotation.price;
                                              }
                                            }
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <Button
                                variant="outlined"
                                color="primary"
                                onClick={() =>
                                  push({
                                    name: "",
                                    title: "",
                                    quantity: 0,
                                    price: 0,
                                    tax: 0,
                                    amount: 0,
                                    itemId: "",
                                    updatedAt: "",
                                    createdAt: "",
                                  })
                                }
                                style={{ marginRight: 16 }}
                                className="btn btn-primary"
                              >
                                Add Line
                              </Button>

                              <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                style={{ marginRight: 16 }}
                                className="btn btn-primary"
                              >
                                Save
                              </Button>
                            </>
                          )}
                        />
                      </Form>
                    );
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
                    initialValues={customerInitialValues}
                    onSubmit={async (values) => {
                      setLoading(true);
                      await axios
                        .post(
                          `${API_URL}customer-service/Customer/CreateCustomer`,
                          [
                            {
                              name: customer.name,
                              clientId: user.data.clientId,
                              customerId: "",
                              phone_number: customer.phone_number,
                              status: "ACTIVE",
                              isDeleted: false,
                              email: customer.email,
                              vatNumber: customer.vatNumber,
                              companyReg: customer.companyReg,
                            },
                          ],
                          config
                        )
                        .then(async (response) => {
                          const newCustomer = response?.data?.data[0];
                          setCustomer([newCustomer]);
                          setCustomers([...customers[0], ...customer]);
                          setLoading(false);
                          setModal(false);
                        })
                        .catch((error) => {
                          setLoading(false);
                          setModal(false);
                        });
                    }}
                  >
                    {(props) => (
                      <Form>
                        <DialogTitle id="confirmation-dialog-title">
                          {openModal.text}
                        </DialogTitle>
                        <DialogContent dividers>
                          <CustomInput
                            labelText="Name"
                            id="name"
                            required
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              onChange: (e) => {
                                setCustomer({
                                  ...customer,
                                  name: e.target.value,
                                });
                              },
                            }}
                          />
                          <CustomInput
                            labelText="Email"
                            id="email"
                            required
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              onChange: (e) => {
                                setCustomer({
                                  ...customer,
                                  email: e.target.value,
                                });
                              },
                            }}
                          />
                          <CustomInput
                            labelText="Contact number"
                            id="phone_number"
                            required
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              onChange: (e) => {
                                setCustomer({
                                  ...customer,
                                  phone_number: e.target.value,
                                });
                              },
                            }}
                          />
                          <CustomInput
                            labelText="VAT number"
                            id="vatNumber"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              onChange: (e) => {
                                setCustomer({
                                  ...customer,
                                  vatNumber: e.target.value,
                                });
                              },
                            }}
                          />
                          <CustomInput
                            labelText="Company Reg. Number"
                            id="name"
                            required
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              onChange: (e) => {
                                setCustomer({
                                  ...customer,
                                  companyReg: e.target.value,
                                });
                              },
                            }}
                          />
                        </DialogContent>
                        <DialogActions>
                          <Button
                            autoFocus
                            onClick={handleCancel}
                            color="primary"
                          >
                            Cancel
                          </Button>
                          <Button type="submit" color="primary">
                            {loading ? (
                              <CircularProgress size="medium" />
                            ) : (
                              "Create"
                            )}
                          </Button>
                        </DialogActions>
                      </Form>
                    )}
                  </Formik>
                </Dialog>
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
