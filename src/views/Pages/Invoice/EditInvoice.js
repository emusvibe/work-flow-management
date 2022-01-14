import React, { useContext, useState, useRef } from "react";
// @material-ui/core components
import { makeStyles, useTheme } from "@material-ui/core/styles";
// core components
import GridItem from "../../../components/Grid/GridItem.js";
import { cardTitle } from "../../../assets/jss/material-dashboard-pro-react.js";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { BuilderComponent } from "@builder.io/react";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import { API_URL } from "utils/constants/index.js";
import { AuthenticationContext } from "contexts/auth-context.js";
import { AUTH_TOKEN_NAME } from "utils/constants/index.js";
import { Field, FieldArray, Form, Formik } from "formik";
import _ from "lodash";
import { Input,
  Select, 
  Typography, 
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
} from "@material-ui/core";
import InvoiceContext from "contexts/invoice-context.js";

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
};
const useStyles = makeStyles(styles);
export const EditInvoice = ({ invoiceData }) => {
  const { user } = useContext(AuthenticationContext);
  const { editInvoiceStatus, setEditInvoice } = useContext(InvoiceContext);
  const token = localStorage.getItem(AUTH_TOKEN_NAME);
  const [status, setStatus] = useState("NEW");
  const [showField, setShowField] = useState(true);
  const config = {
    headers: {
      Authorization: user?.data?.token || token,
    },
  };
  const radioGroupRef = useRef(null);
  const handleChange = (event) => {
    setStatus(event.target.value);
    setEditInvoice(false);
  };
  const handleFieldChange = () => {
    setShowField(!showField);
  };
  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };
  const [openModal, setModal] = useState({ modal: false, text: "" });
  const initialValues = {
    invoiceItems: [
      {
        name: "",
        title: "",
        quantity: 0,
        price: 0,
        tax: 0,
        amount: 0,
        isRemoved: 0,
        quotationItemId: "",
        quotationId: "",
      },
    ],
  };
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const state = history.location.state || {};
  const [convertInvoice, setConvert] = useState("Job");
  const handleRadioChange = (event) => {
    setConvert(event.target.value);
  };
  
  return (
    <GridItem xs={12}>
      <div style={{ padding: theme.spacing(3), paddingTop: theme.spacing(4) }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <strong>Customer name:</strong> {invoiceData.customerName}{" "}
          </div>
          <div>
            <strong>Invoice #:</strong> {invoiceData.invoiceNumber}{" "}
          </div>
          <div>
            <strong>Invoice type:</strong> {invoiceData.invoiceType}{" "}
          </div>
          <div style={{ display: "flex" }}>
            <strong>Status:</strong>
            <Select
              fullWidth
              onChange={handleChange}
              value={status}
              disabled={editInvoiceStatus}
              style={{
                marginLeft: theme.spacing(1),
                marginTop: 0,
                width: "100%",
                height: 20,
              }}
            >
              <option value={status}>{invoiceData.status}</option>
              <option value={"pending"}>{"Pending"}</option>
              <option value={"paid"}>{"Paid"}</option>
            </Select>
          </div>
          <div>
            {editInvoiceStatus && (
              <>
                <Button
                  style={{
                    marginRight: theme.spacing(1),
                    marginTop: -16,
                    marginBottom: theme.spacing(1),
                  }}
                  className={classes.cardIconTitle}
                  variant="outlined"
                  color="secondary"
                  onClick={handleFieldChange}
                >
                  Edit
                </Button>
                <Button
                  style={{
                    marginRight: theme.spacing(1),
                    marginTop: -16,
                    marginBottom: theme.spacing(1),
                  }}
                  variant="outlined"
                  color="secondary"
                  className={classes.cardIconTitle}
                  onClick={() =>
                    history.push({
                      pathname: "/admin/view-invoice",
                      state: { data: invoiceData },
                    })
                  }
                >
                  Print View
                </Button>
                <Button
                  style={{
                    marginRight: theme.spacing(1),
                    marginTop: -16,
                    marginBottom: theme.spacing(1),
                  }}
                  variant="outlined"
                  color="secondary"
                  className={classes.cardIconTitle}
                  onClick={() => {
                    setModal({
                      modal: true,
                      text: "Convert Invoice",
                    })
                  }}
                >
                  Convert
                </Button>
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
                      convertInvoice: "",
                    }}
                    onSubmit={(values) => {}}
                  >
                    {({ values }) => (
                      <Form>
                        <DialogTitle id="confirmation-dialog-title">
                          {openModal.text}
                        </DialogTitle>
                        <DialogContent dividers>
                          <RadioGroup
                            aria-label={openModal.text}
                            name="convert"
                            value={convertInvoice}
                            onChange={handleRadioChange}
                          >
                            <FormControlLabel
                              value="Job"
                              control={<Radio />}
                              label="Job"
                            />
                            <FormControlLabel
                              value="Quotation"
                              control={<Radio />}
                              label="Quotation"
                            />
                          </RadioGroup>
                        </DialogContent>
                        <DialogActions>
                          <Button
                            autoFocus
                            onClick={() => {
                              setModal({
                                modal: false,
                                text: "",
                              });
                            }}
                            color="primary"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => {
                              convertInvoice === "Job"
                                ? history.push({
                                    pathname: "/admin/create-job",
                                    state: { data: invoiceData },
                                  })
                                : history.push({
                                    pathname: "/admin/create-quotation",
                                    state: { data: invoiceData },
                                  });
                            }}
                            color="primary"
                          >
                            Convert
                          </Button>
                        </DialogActions>
                      </Form>
                    )}
                  </Formik>
                </Dialog>
              </>
            )}
          </div>
        </div>
        <div
          style={{
            justifyContent: "space-between",
            width: "50%",
            marginTop: theme.spacing(2),
            display: "none",
          }}
        >
          <div>
            <strong>Address :</strong>
          </div>
          <div>
            <strong>Contact no :</strong>
          </div>
          <div>
            <strong>Email :</strong>
          </div>
        </div>

        <Formik
          initialValues={
            _.isEmpty(invoiceData && invoiceData.invoiceItems)
              ? initialValues
              : invoiceData
          }
          enableReinitialize
          onSubmit={(values) => {
            axios
              .put(
                `${API_URL}jobs-service/Invoice/UpdateInvoice`,
                [
                  {
                    clientId: user.data.clientId,
                    employeeId: user.data.employeeId,
                    quotationId: invoiceData.quotationId,
                    status: invoiceData.status,
                    invoiceItems: values.invoiceItems,
                    invoiceType: invoiceData.invoiceType,
                    customerId: invoiceData.customerId,
                    customerName: invoiceData.customerName,
                    invoiceNumber: invoiceData.invoiceNumber,
                  },
                ],
                config
              ) //create modal to edit and create
              .then((response) => {
                history.push("/admin/invoices");
              })
              .catch((error) => {});
          }}
          render={({ values }) => {
            return (
              <Form style={{ marginTop: theme.spacing(2) }}>
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
                                    <th className="text-center"> Item </th>
                                    <th className="text-center">
                                      {" "}
                                      Description{" "}
                                    </th>
                                    <th className="text-center"> Quantity </th>
                                    <th className="text-center"> Price </th>
                                    <th className="text-center"> Tax </th>
                                    <th className="text-center"> Amount </th>
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
                                                render={({ field, form }) => (
                                                  <Input
                                                    {...field}
                                                    type="text"
                                                    disabled={showField}
                                                    onChange={(e) => {
                                                      const name =
                                                        e.target.value;
                                                      form.setFieldValue(
                                                        `invoiceItems.${index}.name`,
                                                        name
                                                      );
                                                      form.setFieldValue(
                                                        `invoiceItems.${index}.clientId`,
                                                        user.data.clientId
                                                      );
                                                      form.setFieldValue(
                                                        `invoiceItems.${index}.quotationId`,
                                                        ""
                                                      );
                                                      form.setFieldValue(
                                                        `invoiceItems.${index}.quotationItemId`,
                                                        ""
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
                                                render={({ field, form }) => (
                                                  <Input
                                                    {...field}
                                                    type="text"
                                                    disabled={showField}
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
                                                render={({ field, form }) => (
                                                  <Input
                                                    {...field}
                                                    type="number"
                                                    disabled={showField}
                                                    onChange={(e) => {
                                                      const quantity =
                                                        e.target.value;
                                                      form.setFieldValue(
                                                        `invoiceItems.${index}.quantity`,
                                                        parseFloat(quantity)
                                                      );
                                                      form.setFieldValue(
                                                        `invoiceItems.${index}.amount`,
                                                        quantity *
                                                          values.invoiceItems[
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
                                                render={({ field, form }) => (
                                                  <Input
                                                    {...field}
                                                    type="number"
                                                    disabled={showField}
                                                    onChange={(e) => {
                                                      const price =
                                                        e.target.value;
                                                      form.setFieldValue(
                                                        `invoiceItems.${index}.price`,
                                                        parseFloat(price)
                                                      );
                                                      form.setFieldValue(
                                                        `invoiceItems.${index}.amount`,
                                                        values.invoiceItems[
                                                          index
                                                        ].quantity * price
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
                                                value={
                                                  values.invoiceItems[index].tax
                                                }
                                                render={() => (
                                                  <Input
                                                    name={`invoiceItems.${index}.tax`}
                                                    type="number"
                                                    value={
                                                      values.invoiceItems[index]
                                                        .tax
                                                    }
                                                    disabled={true}
                                                  />
                                                )}
                                              />
                                            </td>
                                            <td>
                                              <Input
                                                name={`invoiceItems.${index}.amount`}
                                                type="number"
                                                value={
                                                  values.invoiceItems[index]
                                                    .quantity *
                                                  values.invoiceItems[index]
                                                    .price
                                                }
                                                disabled={true}
                                              />
                                            </td>
                                            <td>
                                              {!showField ? (
                                                <Field
                                                  name={`invoiceItems.${index}.isRemoved`}
                                                  type="number"
                                                  render={({ field, form }) => (
                                                    <Button
                                                      variant="outlined"
                                                      color="secondary"
                                                      onClick={() => {
                                                        if (state.data) {
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
                                              ) : (
                                                ""
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
                                  {_.sumBy(values.invoiceItems, (quotation) => {
                                    if (state.data !== undefined) {
                                      return quotation.amount;
                                    } else {
                                      return (
                                        quotation.quantity * quotation.price
                                      );
                                    }
                                  })}
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
                                          ? quotation.quantity * quotation.price
                                          : quotation.quantity *
                                              quotation.price *
                                              ((values.invoiceItems &&
                                                values.invoiceItems[0].tax) ||
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
                      {editInvoiceStatus && (
                        <>
                          {!showField && (
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
                          )}

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
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        style={{ marginRight: 16 }}
                        className="btn btn-primary"
                        onClick={() => setEditInvoice(false)}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                />
              </Form>
            );
          }}
        />
      </div>
    </GridItem>
  );
};
