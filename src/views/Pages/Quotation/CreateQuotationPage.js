import React, { useEffect, useState, useContext, useRef } from "react";
// @material-ui/core components
import { makeStyles, useTheme } from "@material-ui/core/styles";
// @material-ui/icons
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import {statusStyle} from "../../../utils/statusStyles"
import CardText from "components/Card/CardText.js";
import CardBody from "components/Card/CardBody.js";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import _ from "lodash";
import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  CircularProgress,
  TextField
} from "@material-ui/core";
import CustomInput from "components/CustomInput/CustomInput.js";
import Input from "@material-ui/core/Input";
import { Formik, Field, Form, FieldArray } from "formik";
import axios from "axios";
import { API_URL } from "utils/constants/index.js";
import { useHistory } from "react-router-dom";
import { AuthenticationContext } from "contexts/auth-context";
import { AUTH_TOKEN_NAME } from "utils/constants/index.js";
import Snackbar from "components/Snackbar/Snackbar.js";
import { Check, Close } from "@material-ui/icons";
import * as Yup from "yup";

const useStyles = makeStyles(styles);

const validationSchema = Yup.object().shape({
  quotationItems: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required("Required"),
        title: Yup.string().required("Required"),
      })
    )
    .required("Required"),
});

export default function CreateQuotation() {
  const { user } = useContext(AuthenticationContext);
  const token = localStorage.getItem(AUTH_TOKEN_NAME);
  const [quotation, setQuotation] = useState({
      customerId:"",
      address:"",
      status:""
  });
  const [initialValues, setInitialValues] = useState({
    quotationItems: [
      {
        name: "",
        title: "",
        quantity: 1.0,
        price: 0,
        tax: 0,
        amount: 1.0,
        clientId: user?.data?.clientId,
        quotationItemId: "",
        quotationId: "",
      },
    ],
  });
  const config = {
    headers: {
      Authorization: user?.data?.token || token,
    },
  };
  const classes = useStyles();

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
  const [statuses, setStatuses] = useState([]);
  const [editData, setEditData] = useState();
  const [address, setAddress] = useState();
  const [tax, setTax] = useState(0.0);

  useEffect(() => {
    if (!_.isEmpty(state)) {
      state?.data?.rowData
        ? setEditData(state?.data?.rowData)
        : setEditData(state?.data);
        console.log("state==>", state);
    }

    axios
      .get(
        `${API_URL}jobs-service/Jobs/GetJobStatusesByClient?clientId=${user?.data?.clientId}`,
        config
      )
      .then((response) => {
        if (response.data.statusCode === 200) {
          setStatuses(response.data.data);
        }
      })
      .catch((error) => {});

    const getCustomers = () => {
      axios
        .get(
          `${API_URL}customer-service/Customer/GetClientCustomers?clientId=${user?.data?.clientId}`,
          config
        )
        .then((response) => {
          console.log("customers response==>", response);
          setCustomers(response.data.data);
        })
        .catch((err) => {});
    };

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
    const setItemValues = () => {
      if (state?.data?.rowData !== undefined) {
        setInitialValues({
          ...initialValues,
          quotationItems: state?.data?.rowData?.jobItems,
        });
      }
    };
    getTaxConfiguration();
    setItemValues();
    getCustomers();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusInitialValues = {
    name: "",
    clientId: user?.data?.clientId,
  };

  const theme = useTheme();
  const [customerId, setCustomerId] = useState("");
  const [openModal, setModal] = useState({ modal: false, text: "" });
  const [statusData, setStatusData] = useState(statusInitialValues);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const radioGroupRef = useRef(null);

  const handleCustomerId = (event) => {
    console.log("event==>", event);
    let add = "";
    customers.map((item)=>{
      console.log("item==>", item);
      if(item.customerId == event.target.value){
       axios
        .get(
          `${API_URL}jobs-service/Quotation/GetAddressById?addressId=${item.addressId}`,
          config
        )
        .then((response) => {
          console.log("address response==>", response);
          setAddress(response.data.data);
        })
        .catch((err) => {});
      }
    })
    if (editData !== undefined) {
      setEditData({ ...editData, customerId: event.target.value });
    } else {
      setQuotation({...quotation, customerId: event.target.value, address: address?.fullAddress})
    }
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
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="rose" text>
            <CardText color="rose">
              <h4 className={classes.cardTitle}>
                {state.data === undefined
                  ? "New Quotation"
                  : "Update Quotation"}
              </h4>
            </CardText>
          </CardHeader>
          <CardBody>
            <Snackbar
              place="tr"
              color="success"
              icon={Check}
              message="A new quotation has been created successfully"
              open={openSuccessSnackbar}
              closeNotification={() => setSuccessSnackbar(false)}
              close
            />
            <Snackbar
              place="tr"
              color="danger"
              icon={Close}
              message="Something went wrong could not create a quotation, 
              please check that you filled all fields"
              open={openFailureSnackbar}
              closeNotification={() => setFailureSnackbar(false)}
              close
            />
            <GridContainer>
              <GridItem>
                <Formik
                  initialValues={
                    _.isEmpty(editData && editData.quotationItems)
                      ? initialValues
                      : editData
                  }
                  validationSchema={validationSchema}
                  enableReinitialize
                  onSubmit={(values) => {
                    axios
                      .post(
                        `${API_URL}jobs-service/Quotation/${
                          state.data === undefined
                            ? "CreateQuotation"
                            : "UpdateQuotation"
                        }`,
                        {
                          
                          clientId: user.data.clientId,
                          employeeId: user.data.employeeId,
                          customerId: quotation?.customerId,
                          address: quotation?.address,
                          status: quotation?.status,
                          quotationId:
                            state?.data?.rowData !== undefined
                              ? state?.data?.rowData?.quotationId
                              : state?.data
                              ? state?.data?.quotationId
                              : "",
                          quotationNumber: "",
                          jobId:
                            state.data?.rowData !== undefined
                              ? state?.data?.rowData?.jobId
                              : state?.data
                              ? state?.data?.quotationId
                              : "",
                          jobName:
                            state.data?.rowData !== undefined
                              ? state?.data?.rowData?.jobNumber
                              : state?.data
                              ? state?.data?.jobName
                              : "",
                          status: values.status,
                          address: values.address,
                          quotationItems: values.quotationItems,
                        },
                        config
                      ) //create modal to edit and create
                      .then((response) => {
                        if (response.data.statusCode) {
                          setSuccessSnackbar(true);
                          const newStatus = response?.data?.data;
                          setStatuses([newStatus, ...statuses]);
                          setTimeout(
                            () => history.push("/admin/quotations"),
                            2000
                          );
                          setLoading(false);
                        }
                      })
                      .catch((error) => {
                        setFailureSnackbar(true);
                        setTimeout(() => setFailureSnackbar(false), 3000);
                      });
                  }}
                  render={({ values, errors, touched }) => {
                    return (
                      <Form>
                        <FormControl
                          required
                          style={{
                            marginBottom: theme.spacing(0),
                            width: "30%",
                            verticalAlign: "middle"
                          }}
                        >
                          <InputLabel
                            htmlFor="simple-select"
                            className={classes.selectLabel}
                          >
                            Customer Name
                          </InputLabel>
                          <Select
                            value={
                              editData !== undefined
                                ? editData?.customerId
                                : quotation.customerId
                            }

                            onChange={handleCustomerId}
                          >
                            {customers?.map((customer) => (
                              console.log("customer", customer.name),
                              <MenuItem
                                key={customer?.customerId}
                                value={customer?.customerId}
                              >
                                { customer.name }
                              </MenuItem>
                            ))}
                            <Button
                              onClick={() =>
                                setModal({
                                  modal: true,
                                  text: "Create New Customer",
                                })
                              }
                            >
                              Add New Client
                            </Button>
                          </Select>
                        </FormControl>
                        <FormControl
                          required
                          style={{
                            marginBottom: theme.spacing(0),
                            marginLeft: theme.spacing(4),
                            width: "30%",
                            verticalAlign: "middle"
                          }}
                        >
                          {console.log("address==>", address?.fullAddress)}
                         <CustomInput
                              labelText="Address"
                              id="address"
                              required
                              formControlProps={{
                                fullWidth: true,
                              }}
                            // inputProps={{
                            //   value: address?.fullAddress || '',
                            // }}
                            inputProps={{
                              value: address?.fullAddress || quotation?.address || '',
                              onChange: (e) => {
                                setQuotation({
                                  ...quotation,
                                  address: e.target.value,
                                });
                              },
                            }}
                          />  
                            
                        </FormControl>                     
                        <FormControl
                            required
                            fullWidth
                            style={{
                              marginBottom: theme.spacing(0),
                              marginLeft: theme.spacing(4),
                              width: "30%",
                              verticalAlign: "middle"
                            }}
                          >
                            <InputLabel
                              htmlFor="simple-select"
                              className={classes.selectLabel}
                            >
                              Status
                            </InputLabel>
                            <Select
                              value={
                                editData !== undefined
                                  ? editData?.status
                                  : statusData.status
                              }
                              onChange={(e) => {
                                if (editData !== undefined) {
                                  setStatusData({
                                    ...statusData,
                                    name: e.target.value,
                                  });
                                } else {
                                  setQuotation({ ...quotation, status: e.target.value });
                                }
                              }}
                            >
                              <MenuItem disabled>Select status</MenuItem>
                              <MenuItem value="NOT STARTED">
                                NOT STARTED
                              </MenuItem>
                              {statuses !== [] &&
                                statuses?.map((status) => (
                                  <MenuItem
                                    value={status.name}
                                    key={status.statusId}
                                    style={statusStyle(status.name)}
                                  >
                                    {status?.name?.toUpperCase()}
                                  </MenuItem>
                                ))}
                              <Button
                                fullWidth
                                onClick={() =>
                                  setModal({
                                    modal: true,
                                    text: "Create New Status",
                                  })
                                }
                              >
                                Create new status
                              </Button>
                            </Select>
                          </FormControl>
                        <FieldArray
                          name="quotationItems"
                          render={({
                            insert,
                            remove,
                            push,
                            setFieldValue,
                            errors,
                            touched,
                          }) => (
                            <>
                              <div>
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
                                            values.quotationItems &&
                                            values.quotationItems.length > 0 &&
                                            values.quotationItems.map(
                                              (quotationItems, index) => {
                                                return (
                                                  <tr id="name">
                                                    <td>{index + 1}</td>
                                                    <td>
                                                      <Field
                                                        name={`quotationItems.${index}.name`}
                                                        type="text"
                                                        render={({
                                                          field,
                                                          form,
                                                          meta,
                                                        }) => (
                                                          <Input
                                                            {...field}
                                                            type="text"
                                                            error={
                                                              meta.error &&
                                                              meta.touched
                                                            }
                                                            value={
                                                              quotationItems?.name
                                                            }
                                                            onChange={(e) => {
                                                              const name =
                                                                e.target.value;
                                                              form.setFieldValue(
                                                                `quotationItems.${index}.name`,
                                                                name
                                                              );
                                                              form.setFieldValue(
                                                                `quotationItems.${index}.clientId`,
                                                                user.data
                                                                  .clientId
                                                              );
                                                              form.setFieldValue(
                                                                `quotationItems.${index}.quotationId`,
                                                                ""
                                                              );
                                                              form.setFieldValue(
                                                                `quotationItems.${index}.quotationItemId`,
                                                                ""
                                                              );
                                                            }}
                                                          />
                                                        )}
                                                      />
                                                    </td>
                                                    <td>
                                                      <Field
                                                        name={`quotationItems.${index}.title`}
                                                        type="text"
                                                        render={({
                                                          form,
                                                          meta,
                                                          field,
                                                        }) => (
                                                          <Input
                                                            {...field}
                                                            error={
                                                              meta.error &&
                                                              meta.touched
                                                            }
                                                            value={
                                                              quotationItems?.title
                                                            }
                                                            onChange={(e) => {
                                                              const title =
                                                                e.target.value;
                                                              form.setFieldValue(
                                                                `quotationItems.${index}.title`,
                                                                title
                                                              );
                                                            }}
                                                          />
                                                        )}
                                                      />
                                                    </td>
                                                    <td>
                                                      <Field
                                                        name={`quotationItems.${index}.quantity`}
                                                        type="number"
                                                        render={({
                                                          field,
                                                          form,
                                                        }) => (
                                                          <Input
                                                            required
                                                            {...field}
                                                            type="number"
                                                            onChange={(e) => {
                                                              const quantity =
                                                                e.target.value;
                                                              form.setFieldValue(
                                                                `quotationItems.${index}.quantity`,
                                                                parseFloat(
                                                                  quantity
                                                                )
                                                              );
                                                              form.setFieldValue(
                                                                `quotationItems.${index}.amount`,
                                                                quantity *
                                                                  values
                                                                    .quotationItems[
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
                                                        name={`quotationItems.${index}.price`}
                                                        type="number"
                                                        render={({
                                                          field,
                                                          form,
                                                        }) => (
                                                          <Input
                                                            required
                                                            {...field}
                                                            type="number"
                                                            onChange={(e) => {
                                                              const price =
                                                                e.target.value;
                                                              form.setFieldValue(
                                                                `quotationItems.${index}.price`,
                                                                parseFloat(
                                                                  price
                                                                )
                                                              );
                                                              form.setFieldValue(
                                                                `quotationItems.${index}.amount`,
                                                                values
                                                                  .quotationItems[
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
                                                        name={`quotationItems.${index}.tax`}
                                                        type="number"
                                                        render={({
                                                          field,
                                                          form,
                                                        }) => (
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
                                                        required
                                                        name={`quotationItems.${index}.amount`}
                                                        type="number"
                                                        value={
                                                          values.quotationItems[
                                                            index
                                                          ].quantity *
                                                          values.quotationItems[
                                                            index
                                                          ].price
                                                        }
                                                        disabled={true}
                                                      />
                                                    </td>
                                                    <td>
                                                      {values.quotationItems
                                                        .length === 1 ? null : (
                                                        <Field
                                                          name={`quotationItems.${index}.isRemoved`}
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
                                                                    `quotationItems.${index}.isRemoved`,
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
                                            values.quotationItems,
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
                                        {/* <p>
                                          Tax (%):{" "}
                                          {
                                            // (values.quotationItems &&
                                            //   values.quotationItems[0].tax )
                                            0
                                          }
                                        </p> */}
                                        <p>
                                          Total (ZAR): R
                                          {_.sumBy(
                                            values && values.quotationItems,
                                            (quotation) => {
                                              if (state.data !== undefined) {
                                                return quotation.amount;
                                              } else {
                                                return (values.quotationItems &&
                                                  values.quotationItems[0]
                                                    .tax) ||
                                                  0
                                                  ? quotation.quantity *
                                                      quotation.price
                                                  : quotation.quantity *
                                                      quotation.price *
                                                      ((values.quotationItems &&
                                                        values.quotationItems[0]
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
                              <FormControl
                                required
                                style={{
                                  marginBottom: theme.spacing(0),
                                  marginLeft: theme.spacing(0),
                                  width: "100%",
                                  verticalAlign: "middle"
                                }}
                              >
                              <CustomInput
                                    labelText="Terms and conditions"
                                    id="termsAndConditions"
                                    required
                                    formControlProps={{
                                      fullWidth: true,
                                    }}
                                  inputProps={{
                                    value: null
                                  }}
                                />  
                                  
                              </FormControl> 
                              <br/>
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
