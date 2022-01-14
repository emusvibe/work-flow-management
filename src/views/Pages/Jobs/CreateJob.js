import React, { useContext, useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles, useTheme } from "@material-ui/core/styles";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import {statusStyle} from "../../../utils/statusStyles"
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
  FormControlLabel,
  InputLabel,
  MenuItem,
  CircularProgress,
  Checkbox,
  TextField,
} from "@material-ui/core";
import { AuthenticationContext } from "contexts/auth-context";
import { AUTH_TOKEN_NAME } from "utils/constants";
import Snackbar from "components/Snackbar/Snackbar.js";
import { Check, Close } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 400,
  },
};
const useStyles = makeStyles(styles);
export default function CreateJob() {
  const { user } = useContext(AuthenticationContext);

  const token = localStorage.getItem(AUTH_TOKEN_NAME);
  const [data, setData] = useState([]);
  const [intervals, setAutoRecurringIntervals] = useState([]);
  const config = {
    headers: {
      Authorization: user?.data?.token || token,
    },
  };
  const getAutoRecurringIntervals = () => {
    axios
      .get(
        `${API_URL}jobs-service/Jobs/GetAutoRecurringIntervals?clientId=${user?.data?.clientId}`,
        config
      )
      .then((response) => {
        setAutoRecurringIntervals(response.data.data);
      })
      .catch((error) => {});
  };
  const jobLineItems = {
    name: "",
    title: "",
    quantity: 0,
    price: 0,
    tax: 0,
    amount: 0,
    itemId: "",
    updatedAt: "",
    createdAt: "",
  };
  const [initialValues, setInitialValues] = useState({
    jobItems: [
      {
        name: "",
        title: "",
        quantity: 1,
        price: 0,
        tax: 0,
        amount: 0,
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
    surname: "",
    email: "",
    phone_number: "",
    vatNumber: "",
    companyReg: "",
    status: "ACTIVE",
  };

  const jobTypeInitialValues = {
    name: "",
  };
  const paymentInitialValues = {
    name: "",
  };

  const userInitialValues = {
    clientId: user?.data?.clientId,
    username: "",
    password: "password",
    firstName: "",
    surname: "",
    phoneNumber: "",
    email: "",
    status: "",
    userType: 0,
    customerId: "",
    profession: "",
  };

  const statusInitialValues = {
    name: "",
    clientId: user?.data?.clientId,
  };
  const [customers, setCustomers] = useState([]);
  const [quotationTax, setQuotationTax] = useState(0);
  const [termsPlusConditions, setTermsPlusConditions] = useState("");
  const [customer, setCustomer] = useState(customerInitialValues);
  const [editData, setEditData] = useState();
  const [jobTypeData, setJobTypeData] = useState(jobTypeInitialValues);
  const [userData, setUserData] = useState(userInitialValues);
  const [statusData, setStatusData] = useState(statusInitialValues);
  const [jobTypes, setJobTypes] = useState([]);
  const [users, setUsers] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [tableItems, setTableItems] = useState([]);
  const [paymentData, setPaymentData] = useState([]);

  useEffect(() => {
    if (!_.isEmpty(state)) {
      setEditData(state.data);
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

    axios
      .get(
        `${API_URL}jobs-service/Jobs/GetJobCards?clientId=${user?.data?.clientId}`,
        config
      )
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {});

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
    axios
      .get(
        `${API_URL}jobs-service/Jobs/GetPaymentTypesByClient?clientId=${user?.data?.clientId}`,
        config
      )
      .then((response) => {
        if (response.data.statusCode === 200) {
          setPayments(response.data.data);
        }
      })
      .catch((error) => {});

    axios
      .get(
        `${API_URL}jobs-service/Jobs/GetJobTypesByClient?clientId=${user?.data?.clientId}`,
        config
      )
      .then((response) => {
        setJobTypes(response.data.data);
      })
      .catch((error) => {});

    axios
      .get(
        `${API_URL}accounts-service/Account/GetSystemConfig?clientId=${user?.data?.clientId}`,
        config
      )
      .then((response) => {
        setQuotationTax(response?.data?.data?.quotationTax);
        setTermsPlusConditions(response?.data?.data?.termsAndConditions);
      })
      .catch((error) => {});

    axios
      .get(
        `${API_URL}customer-service/Inventory/GetByClientId?clientId=${user?.data?.clientId}`,
        config
      )
      .then((response) => {
        setTableItems(response?.data?.data);
      })
      .catch((error) => {});

    const setEditDate = () => {
      setStartDate(editData?.created_at.substring(0, 10));
    };
    const setItemValues = () => {
      if (state?.data?.rowData?.quotationItems !== undefined) {
        setInitialValues({
          ...initialValues,
          jobItems: state?.data?.rowData?.quotationItems,
        });
      } else if (state?.data?.rowData?.invoiceItems !== undefined) {
        setInitialValues({
          ...initialValues,
          jobItems: state?.data?.rowData?.invoiceItems,
        });
      }
    };
    
    setItemValues();
    setEditDate();
    getCustomers();
    getAutoRecurringIntervals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [customerId, setCustomerId] = useState("");
  const [singleJob, setSingleJob] = useState("");
  const [openModal, setModal] = useState({ modal: false, text: "" });
  const [checked, setChecked] = useState(false);
  const [successOrFailMessage, setSuccessOrFailMessage] = useState("");
  const [startDate, setStartDate] = useState(
    `${new Date().toISOString().substring(0, 10)}T00:00`
  );
  const [endDate, setEndDate] = useState(
    `${new Date().toISOString().substring(0, 10)}T00:00`
  );
  const [job, setJob] = useState({
    jobId: user?.data?.jobId,
    title: "Job Title",
    subtitle: "Job",
    status: "NOT STARTED",
    employeeId: user?.data?.employeeId,
    notes: "",
    duration: 0,
    purchaseOrderNumber: "",
    paymentType: "",
    isActive: true,
    priority: "",
    //technician: "",
    address: "",
    description: "",
    jobType: "",
    isDeleted: false,
    customerName: "",
    customerId: "",
    invoiceId: user?.data?.invoiceId,
    quotationId: user?.data?.quotationId,
    clientId: user?.data?.clientId,
    assignedTo: [],
    autoRecurring: {
      interval: "",
      isActive: false,
    },
    startDate: startDate,
    endDate: endDate,
  });
  const [loading, setLoading] = useState(false);
  const radioGroupRef = React.useRef(null);
  const handleIntervalSelect = (event) => {
    if (editData !== undefined) {
      setEditData({
        ...editData,
        autoRecurring: {
          isActive: checked,
          interval: `${event?.target?.value}`,
        },
      });
    } else {
      setJob({
        ...job,
        autoRecurring: {
          isActive: checked,
          interval: `${event?.target?.value}`,
        },
      });
    }
  };
  
  const handleCustomerId = (event) => {
    if (editData !== undefined) {
      setEditData({ ...editData, customerId: event.target.value });
    } else {
      setCustomerId(event.target.value);
      setJob({ ...job, customerId: event.target.value });
    }
  };
  const handleJobType = (event) => {
    if (editData !== undefined) {
      setEditData({ ...editData, jobType: event.target.value });
    } else {
      setSingleJob(event.target.value);
      getAllUserType(event.target.value);
      setJob({ ...job, jobType: event.target.value });
    }
  };
  const handleCancel = () => {
    setModal({
      modal: false,
      text: "",
    });
  };
  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };
  const handleChange = (event) => {
    if (editData !== undefined) {
      setEditData({
        ...editData,
        autoRecurring: { isActive: event.target.checked },
      });
    } else {
      setJob({
        ...job,
        autoRecurring: { isActive: event.target.checked },
      });
    }
    setChecked(event.target.checked);
  };
  const getAllUserType = (profession) => {
    setUsers([]);
    axios
      .get(
        `${API_URL}accounts-service/Account/GetByClient?clientId=${user?.data?.clientId}`,
        config
      )
      .then((response) => {
        if (response?.data?.data) {
          setUsers(...users, response?.data?.data);
        }
      })
      .catch((error) => {});
  };
  const handleSubmit = (values) => {

    //we want to send an empty array if jobitem is not selected.
    const resetJobItems = values.jobItems.filter(obj => obj.quantity !== 0);    
    values.jobItems = resetJobItems;

    delete editData?.tableData;
    delete editData?.created_at;
    delete editData?.updated_at;
    delete editData?.customerName;
    axios
      .post(
        `${API_URL}jobs-service/Jobs/${
          state.data === undefined ? "CreateJobCard" : "UpdateJobCard"
        }`,
        editData !== undefined
          ? {
              ...editData,
            }
          : {
              ...job,
              ...values,
            },
        config
      )
      .then((response) => {
        setSuccessOrFailMessage(response?.data?.message);
        if (response.data.statusCode === 200) {
          setSuccessSnackbar(true);
          setTimeout(() => {
            if (editData !== undefined) {
              setData([...data, editData]);
              history.push("/admin/jobs");
            } else {
              history.push("/admin/jobs");
              setLoading(false);
            }
          }, 3000);
        } else {
          setFailureSnackbar(true);
          setSuccessOrFailMessage(response?.error?.message)
        }
      })
      .catch((error) => {
        setFailureSnackbar(true);
        setTimeout(() => setFailureSnackbar(false), 5000);
        setLoading(false);
      });
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
                {state.data === undefined ? "New Job" : "Update Job"}
              </h4>
            </CardText>
            {state.data !== undefined && (
              <Button
                style={{
                  float: "right",
                  marginRight: theme.spacing(1),
                  marginTop: -16,
                  marginBottom: theme.spacing(1),
                  color: "white",
                }}
                color="primary"
                variant="contained"
                className={classes.cardIconTitle}
                onClick={() => {
                  history.push({
                    pathname: "/admin/view-job",
                    state: { data: state?.data },
                  });
                }}
              >
                View Job
              </Button>
            )}
          </CardHeader>
          <CardBody>
            <Snackbar
              place="tr"
              color="success"
              icon={Check}
              message={successOrFailMessage}
              open={openSuccessSnackbar}
              closeNotification={() => setSuccessSnackbar(false)}
              close
            />
            <Snackbar
              place="tr"
              color="danger"
              icon={Close}
              message={successOrFailMessage}
              open={openFailureSnackbar}
              closeNotification={() => setFailureSnackbar(false)}
              close
            />
            <GridContainer>
              <GridItem>
                <Formik
                  initialValues={
                    _.isEmpty(editData && editData.jobItems)
                      ? initialValues
                      : editData
                  }
                  enableReinitialize
                  onSubmit={(values) => handleSubmit(values)}
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
                              value={
                                state?.data?.rowData !== undefined
                                  ? state?.data?.rowData?.customerId
                                  : editData !== undefined
                                  ? editData.customerId
                                  : customerId
                              }
                              defaultValue={
                                state.data !== undefined
                                  ? state.data.customerId
                                  : ""
                              }
                              onChange={handleCustomerId}
                            >
                              {_.sortBy(customers, ["name"], ["asc"])?.map((customer) => (
                                <MenuItem
                                  key={customer.customerNumber}
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
                                    text: "Create New Client",
                                  })
                                }
                              >
                                Add New Client
                              </Button>
                            </Select>
                          </FormControl>
                          <FormControl
                            fullWidth
                            className={classes.selectFormControl}
                            style={{
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
                              value={
                                editData !== undefined
                                  ? editData?.priority
                                  : job.priority
                              }
                              onChange={(e) => {
                                if (editData !== undefined) {
                                  setEditData({
                                    ...editData,
                                    priority: e.target.value,
                                  });
                                } else {
                                  setJob({ ...job, priority: e.target.value });
                                }
                              }}
                              inputProps={{
                                name: "priority",
                                id: "priority",
                              }}
                            >
                              <MenuItem disabled>Select Priority</MenuItem>
                              <MenuItem value="high">HIGH</MenuItem>
                              <MenuItem value="medium">MEDIUM</MenuItem>
                              <MenuItem value="low">LOW</MenuItem>
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
                                value:
                                  editData !== undefined
                                    ? editData?.address
                                    : job.address,
                                onChange: () => {
                                  if(job.customerId !== "") {
                                    axios
                                      .post(
                                        `${API_URL}customer-service/Customer/GetCustomersById`,
                                        [job.customerId],
                                        config
                                      )
                                      .then((response) => {
                                        if (editData !== undefined) {
                                          setEditData({
                                            ...editData,
                                            address:
                                              response?.data?.data[0]?.email,
                                          });
                                        } else {
                                          setJob({
                                            ...job,
                                            address:
                                              response?.data?.data[0]?.email,
                                          });
                                        }
                                      })
                                      .catch((err) => {});
                                  }
                                },
                              }}
                            />
                          </FormControl>
                          <FormControl
                            fullWidth
                            style={{
                              marginRight: theme.spacing(1),
                            }}
                          >
                            <CustomInput
                              labelText="PO Number"
                              id="purchaseOrderNumber"
                              required
                              error={job.purchaseOrderNumber.length > 10}
                              helperText="Purchase order number cannot be greater than 10 dig"
                              formControlProps={{
                                fullWidth: true,
                              }}
                              inputProps={{
                                value:
                                  editData !== undefined
                                    ? editData?.purchaseOrderNumber
                                    : job.purchaseOrderNumber,
                                onChange: (e) => {
                                  setJob({...job, purchaseOrderNumber: e.target.value})
                                },
                                maxLength: 10,
                              }}
                            />
                          </FormControl>                        
                        </div>
                        <div>
                          <FormControlLabel
                            control={
                              <>
                                <Checkbox
                                  checked={
                                    job?.autoRecurring?.isActive ||
                                    checked ||
                                    editData?.autoRecurring?.isActive
                                  }
                                  onChange={handleChange}
                                  color="primary"
                                  inputProps={{
                                    "aria-label": "primary checkbox",
                                  }}
                                />
                              </>
                            }
                            label="Auto Recurring"
                          />
                          {checked && (
                            <FormControl
                              fullWidth
                              className={classes.selectFormControl}
                              style={{ marginBottom: theme.spacing(1) }}
                            >
                              <InputLabel
                                htmlFor="simple-select"
                                className={classes.selectLabel}
                              >
                                Auto Recurring Intervals
                              </InputLabel>
                              <Select
                                onChange={handleIntervalSelect}
                                value={
                                  editData !== undefined
                                    ? editData?.autoRecurring?.interval
                                    : job?.autoRecurring?.interval
                                }
                                inputProps={{
                                  name: "interval",
                                  id: "interval",
                                }}
                                fullWidth
                              >
                                <MenuItem disabled>Select Status</MenuItem>
                                {intervals &&
                                  intervals.map((interval) => {
                                    return (
                                      <MenuItem
                                        value={interval.name}
                                        key={interval.name}
                                      >
                                        {interval.name}
                                      </MenuItem>
                                    );
                                  })}
                              </Select>
                            </FormControl>
                          )}
                        </div>
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
                              Job Type
                            </InputLabel>
                            <Select
                              value={
                                state?.data?.rowData !== undefined
                                  ? state?.data?.rowData?.jobType
                                  : editData
                                  ? editData.jobType
                                  : singleJob
                              }
                              defaultValue={
                                state.data !== undefined
                                  ? state.data.jobType
                                  : singleJob
                              }
                              onChange={handleJobType}
                            >
                              {jobTypes?.map((jobType) => (
                                <MenuItem
                                  key={jobType.jobTypeId}
                                  value={jobType.name}
                                >
                                  {jobType.name}
                                </MenuItem>
                              ))}
                              <Button
                                fullWidth
                                onClick={() =>
                                  setModal({
                                    modal: true,
                                    text: "Create New Job Type",
                                  })
                                }
                              >
                                Add New Job Type
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
                              Status
                            </InputLabel>
                            <Select
                              value={
                                editData !== undefined
                                  ? editData?.status
                                  : job.status
                              }
                              onChange={(e) => {
                                if (editData !== undefined) {
                                  setEditData({
                                    ...editData,
                                    status: e.target.value,
                                  });
                                } else {
                                  setJob({ ...job, status: e.target.value });
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
                        </div>
                        <div
                          style={{
                            display: "flex",
                            "justify-content": "flex-start",
                          }}
                        >
                          {users !== [] && (
                            <Autocomplete
                              multiple
                              id="tags-standard"
                              fullWidth={true}
                              options={users}
                              value={users[0]}
                              freeSolo
                              getOptionLabel={(user) => user.firstname}
                              onChange={(e, newValue) => {
                                const employees = newValue?.map((value) => {
                                  return value["employeeId"];
                                });
                                setJob({ ...job, assignedTo: employees });
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="standard"
                                  label="Technicians"
                                  placeholder="Add technician"
                                />
                              )}
                            />
                          )}
                        </div>
                        <div style={{ display: "flex" }}>
                          <FormControl
                            fullWidth
                            style={{
                              marginTop: theme.spacing(2),
                              marginRight: theme.spacing(1),
                            }}
                          >
                            <TextField
                              id="startDate"
                              label="Start Date"
                              type="datetime-local"
                              value={
                                editData?.startDate !== undefined
                                  ? new Date(editData?.startDate)
                                      ?.toISOString()
                                      .split("Z")[0]
                                  : startDate
                              }
                              onChange={(e) => {
                                setStartDate(e.target.value);
                                if (editData !== undefined) {
                                  setEditData({
                                    ...editData,
                                    startDate: e.target.value,
                                  });
                                } else {
                                  setJob({
                                    ...job,
                                    startDate: e.target.value,
                                  });
                                }
                              }}
                              InputLabelProps={{
                                fullWidth: true,
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
                              id="endDate"
                              label="End Date"
                              type="datetime-local"
                              value={
                                editData?.endDate !== undefined
                                  ? new Date(editData?.endDate)
                                      ?.toISOString()
                                      .split("Z")[0]
                                  : endDate
                              }
                              onChange={(e) => {
                                setEndDate(e.target.value);
                                if (editData !== undefined) {
                                  setEditData({
                                    ...editData,
                                    endDate: e.target.value,
                                  });
                                } else {
                                  setJob({
                                    ...job,
                                    endDate: e.target.value,
                                  });
                                }
                              }}
                              InputLabelProps={{
                                fullWidth: true,
                              }}
                            />
                          </FormControl>
                        </div>
                        <div style={{ marginTop: theme.spacing(8) }}>
                          <FieldArray
                            name="jobItems"
                            render={({
                              insert,
                              remove,
                              push,
                              setFieldValue,
                            }) => (
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
                                                Item{" "}
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
                                              values.jobItems &&
                                              values.jobItems.length > 0 &&
                                              values.jobItems.map(
                                                (jobItems, index) => {
                                                  return (
                                                    <tr id="name">
                                                      <td>{index + 1}</td>
                                                      <td>
                                                        <Field
                                                          name={`jobItems.${index}.name`}
                                                          render={({
                                                            field,
                                                            form,
                                                          }) => (
                                                            <Select
                                                              fullWidth
                                                              {...field}
                                                              value={jobItems?.index?.name}
                                                              onChange={(e) => {
                                                                const itemValues =
                                                                  e.target
                                                                    .value;

                                                                form.setFieldValue(
                                                                  `jobItems.${index}.name`,
                                                                  itemValues?.itemType
                                                                );
                                                                form.setFieldValue(
                                                                  `jobItems.${index}.inventoryId`,
                                                                  itemValues?.inventoryId
                                                                );
                                                                form.setFieldValue(
                                                                  `jobItems.${index}.title`,
                                                                  itemValues?.description
                                                                );
                                                                form.setFieldValue(
                                                                  `jobItems.${index}.price`,
                                                                  itemValues?.sellingPrice
                                                                );
                                                              }}
                                                            >
                                                              {tableItems
                                                                ?.filter(
                                                                  (item) =>
                                                                    item?.totalQuantity >
                                                                    0
                                                                )
                                                                ?.map(
                                                                  (item) => (
                                                                    <MenuItem
                                                                      value={
                                                                        item
                                                                      }
                                                                      key={
                                                                        item?.inventoryId
                                                                      }
                                                                    >
                                                                      {
                                                                        item?.itemType
                                                                      }{" "}
                                                                      (
                                                                      {
                                                                        item?.totalQuantity
                                                                      }
                                                                      )
                                                                    </MenuItem>
                                                                  )
                                                                )}
                                                            </Select>
                                                          )}
                                                        />
                                                      </td>
                                                      <td>
                                                        <Field
                                                          name={`jobItems.${index}.title`}
                                                          type="text"
                                                          render={({
                                                            field,
                                                            form,
                                                          }) => (
                                                            <Input
                                                              
                                                              {...field}
                                                              type="text"
                                                              value={
                                                                jobItems?.title
                                                              }
                                                            />
                                                          )}
                                                        />
                                                      </td>

                                                      <td>
                                                        <Field
                                                          name={`jobItems.${index}.quantity`}
                                                          type="number"
                                                          valu
                                                          render={({
                                                            field,
                                                            form,
                                                          }) => (
                                                            <Input
                                                              
                                                              {...field}
                                                              type="number"
                                                              value={
                                                                jobItems?.quantity
                                                              }
                                                              onChange={(e) => {
                                                                const quantity =
                                                                  e.target
                                                                    .value;
                                                                form.setFieldValue(
                                                                  `jobItems.${index}.quantity`,
                                                                  parseFloat(
                                                                    quantity
                                                                  )
                                                                );
                                                                form.setFieldValue(
                                                                  `jobItems.${index}.amount`,
                                                                  quantity *
                                                                    values
                                                                      .jobItems[
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
                                                          name={`jobItems.${index}.price`}
                                                          type="number"
                                                          render={({
                                                            field,
                                                            form,
                                                          }) => (
                                                            <Input
                                                              
                                                              {...field}
                                                              type="number"
                                                              value={
                                                                jobItems?.price
                                                              }
                                                              onChange={(e) => {
                                                                const price =
                                                                  e.target
                                                                    .value;
                                                                form.setFieldValue(
                                                                  `jobItems.${index}.price`,
                                                                  parseFloat(
                                                                    price
                                                                  )
                                                                );
                                                                form.setFieldValue(
                                                                  `jobItems.${index}.amount`,
                                                                  values
                                                                    .jobItems[
                                                                    index
                                                                  ].quantity *
                                                                    price +
                                                                    values
                                                                      .jobItems[
                                                                      index
                                                                    ].quantity *
                                                                      price *
                                                                      quotationTax
                                                                );
                                                              }}
                                                            />
                                                          )}
                                                        />
                                                      </td>
                                                      <td>
                                                        <Field
                                                          name={`jobItems.${index}.tax`}
                                                          type="number"
                                                          value={jobItems.tax}
                                                          render={({
                                                            form,
                                                            field,
                                                          }) => (
                                                            <Input
                                                              
                                                              disabled={true}
                                                              {...field}
                                                              name={`jobItems.${index}.tax`}
                                                              type="number"
                                                              value={parseFloat(
                                                                quotationTax
                                                              )}
                                                              onChange={() => {
                                                                const tax = parseFloat(
                                                                  quotationTax
                                                                );
                                                                form.setFieldValue(
                                                                  `jobItems.${index}.tax`,
                                                                  parseFloat(
                                                                    tax
                                                                  )
                                                                );
                                                              }}
                                                            />
                                                          )}
                                                        />
                                                      </td>
                                                      <td>
                                                        <Field
                                                          name={`jobItems.${index}.amount`}
                                                          type="number"
                                                          render={({
                                                            field,
                                                            form,
                                                          }) => (
                                                            <Input
                                                              {...field}
                                                              type="number"
                                                              value={
                                                                jobItems?.amount
                                                              }
                                                              onChange={(e) => {
                                                                const amount =
                                                                  values
                                                                    .jobItems[
                                                                    index
                                                                  ].quantity *
                                                                  values
                                                                    .jobItems[
                                                                    index
                                                                  ].price;
                                                                form.setFieldValue(
                                                                  `jobItems.${index}.amount`,
                                                                  parseFloat(
                                                                    amount
                                                                  )
                                                                );
                                                              }}
                                                              disabled={true}
                                                            />
                                                          )}
                                                        />
                                                      </td>
                                                      <td>
                                                        {values.jobItems
                                                          .length ===
                                                        1 ? null : (
                                                          <Field
                                                            name={`jobItems.${index}.isRemoved`}
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
                                                                      `jobItems.${index}.isRemoved`,
                                                                      1
                                                                    );
                                                                    remove(
                                                                      index
                                                                    );
                                                                  } else {
                                                                    remove(
                                                                      index
                                                                    );
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
                                            {_.sumBy(values.jobItems, (job) => {
                                              return job.quantity * job.price;
                                            })}
                                          </Typography>
                                          <div>
                                            <Typography
                                              variant="p"
                                              align="right"
                                            >
                                              Vat: R
                                              {_.sumBy(
                                                values.jobItems,
                                                (job) => {
                                                  return (
                                                    (job.quantity *
                                                      job.price *
                                                      quotationTax).toFixed(2)
                                                  )
                                                }
                                              )}
                                            </Typography>
                                          </div>
                                          <div>
                                            <Typography
                                              variant="p"
                                              align="right"
                                            >
                                              Discount: R0
                                            </Typography>
                                          </div>
                                          <p>
                                            Total (ZAR): R
                                            {_.sumBy(
                                              values && values.jobItems,
                                              (job) => {
                                                if (state.data !== undefined) {
                                                  return job.amount;
                                                } else {
                                                  return (values.jobItems &&
                                                    values.jobItems[0].tax) ||
                                                    0
                                                    ? job.quantity * job.price
                                                    : job.quantity *
                                                        job.price *
                                                        ((values.jobItems &&
                                                          quotationTax) ||
                                                          0 / 100) +
                                                        job.quantity *
                                                          job.price;
                                                }
                                              }
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div style={{ display: "flex" }}>
                                  <FormControl
                                    fullWidth
                                    style={{
                                      marginRight: theme.spacing(1),
                                    }}
                                  >
                                    <CustomInput
                                      labelText="Terms and Conditions"
                                      id="terms-conditions"
                                      required
                                      disabled={true}
                                      formControlProps={{
                                        fullWidth: true,
                                      }}
                                      inputProps={{
                                        value:
                                          editData !== undefined
                                            ? editData?.notes
                                            : job.notes,
                                        onChange: (e) => {
                                          if (editData !== undefined) {
                                            setEditData({
                                              ...editData,
                                              notes: e.target.value,
                                            });
                                          } else {
                                            setJob({
                                              ...job,
                                              notes: e.target.value,
                                            });
                                          }
                                        },
                                      }}
                                    />
                                  </FormControl>
                                  <FormControl                                 
                                    fullWidth
                                    style={{
                                      marginTop: 11,
                                      marginRight: theme.spacing(1),
                                    }}
                                  >
                                    <InputLabel
                                      htmlFor="simple-select"
                                      className={classes.selectLabel}
                                    >
                                      Payment Type
                                    </InputLabel>
                                    <Select
                                      value={
                                        editData !== undefined
                                          ? editData?.paymentType
                                          : job.paymentType
                                      }
                                      onChange={(e) => {
                                        if (editData !== undefined) {
                                          setEditData({
                                            ...editData,
                                            paymentType: e.target.value,
                                          });
                                        } else {
                                          setJob({
                                            ...job,
                                            paymentType: e.target.value,
                                          });
                                        }
                                      }}
                                    >
                                      <MenuItem disabled>
                                        Select payment type
                                      </MenuItem>
                                      {payments !== [] &&
                                        payments?.map((payment) => (
                                          <MenuItem
                                            value={payment.name}
                                            key={payment.paymentId}
                                          >
                                            {payment?.name?.toUpperCase()}
                                          </MenuItem>
                                        ))}
                                      <Button
                                        fullWidth
                                        onClick={() =>
                                          setModal({
                                            modal: true,
                                            text: "Create New Payment",
                                          })
                                        }
                                      >
                                        Create payment
                                      </Button>
                                    </Select>
                                  </FormControl>
                                </div>
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  onClick={() => push(jobLineItems)}
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
                        </div>
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
                  {openModal.text === "Create New Client" ? (
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
                            <div style={{ display: "flex" }}>
                              <CustomInput
                                labelText="Name"
                                id="name"
                                required
                                style={{ marginRight: theme.spacing(1) }}
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
                                labelText="Surname"
                                id="surname"
                                required
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  onChange: (e) => {
                                    setCustomer({
                                      ...customer,
                                      surname: e.target.value,
                                    });
                                  },
                                }}
                              />
                            </div>
                            <CustomInput
                              labelText="Company Name"
                              id="company-name"
                              required
                              placeholder="Company name (if company)"
                              style={{ marginRight: theme.spacing(1) }}
                              formControlProps={{
                                fullWidth: true,
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
                              error={customer?.vatNumber?.length < 10}
                              helperText="Vat number must be at least 10 units"
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
                              id="company-registration"
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
                            <CustomInput
                              labelText="Cell Number"
                              id="cell-number"
                              required
                              formControlProps={{
                                fullWidth: true,
                              }}
                              inputProps={{
                                onChange: (e) => {
                                  setCustomer({
                                    ...customer,
                                    cellNumber: e.target.value,
                                  });
                                },
                              }}
                            />
                            <CustomInput
                              labelText="Address"
                              id="address"
                              required
                              formControlProps={{
                                fullWidth: true,
                              }}
                              inputProps={{
                                onChange: (e) => {
                                  setCustomer({
                                    ...customer,
                                    address: e.target.value,
                                  });
                                },
                              }}
                            />
                            <CustomInput
                              labelText="Status"
                              id="status"
                              required
                              defaultValue="active"
                              formControlProps={{
                                fullWidth: true,
                              }}
                              inputProps={{
                                onChange: (e) => {
                                  setCustomer({
                                    ...customer,
                                    status: e.target.value,
                                  });
                                },
                                value: customerInitialValues.status,
                              }}
                            />
                            <CustomInput
                              labelText="Client Type"
                              id="client-type"
                              formControlProps={{
                                fullWidth: true,
                              }}
                            />
                            <CustomInput
                              labelText="Balance"
                              id="balance"
                              formControlProps={{
                                fullWidth: true,
                              }}
                            />
                            <CustomInput
                              labelText="Sage Reference"
                              id="sage-reference"
                              required
                              formControlProps={{
                                fullWidth: true,
                              }}
                              inputProps={{
                                onChange: (e) => {
                                  setCustomer({
                                    ...customer,
                                    sageReference: e.target.value,
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
                            <Button
                              type="submit"
                              color="primary"
                              disabled={
                                customer.email === "" ||
                                customer.name === "" ||
                                customer.surname === "" ||
                                customer.phone_number === ""
                              }
                            >
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
                  ) : openModal.text === "Create New Job Type" ? (
                    <Formik
                      initialValues={jobTypeInitialValues}
                      onSubmit={async (values) => {
                        setLoading(true);
                        await axios
                          .post(
                            `${API_URL}jobs-service/Jobs/CreateJobType`,
                            {
                              name: jobTypeData.name,
                              clientId: user?.data?.clientId,
                              jobTypeId: "",
                            },
                            config
                          )
                          .then(async (response) => {
                            const newJobType = response?.data?.data;
                            setJobTypeData([newJobType]);
                            setJobTypes([newJobType, ...jobTypes]);
                            setSingleJob(newJobType.name);
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
                                  setJobTypeData({
                                    ...jobTypeData,
                                    name: e.target.value,
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
                            <Button
                              type="submit"
                              color="primary"
                              disabled={jobTypeData?.name === ""}
                            >
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
                  ) : openModal.text === "Create New Status" ? (
                    <Formik
                      initialValues={statusInitialValues}
                      onSubmit={async (values) => {
                        setLoading(true);
                        await axios
                          .post(
                            `${API_URL}jobs-service/Jobs/CreateJobStatus`,
                            statusData,
                            config
                          )
                          .then(async (response) => {
                            const newStatus = response?.data?.data;
                            setStatuses([newStatus, ...statuses]);
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
                                  setStatusData({
                                    ...statusData,
                                    name: e.target.value,
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
                  ) : openModal.text === "Create New Payment" ? (
                    <Formik
                      initialValues={paymentInitialValues}
                      onSubmit={async (values) => {
                        setLoading(true);
                        await axios
                          .post(
                            `${API_URL}jobs-service/Jobs/CreatePaymentType`,
                            paymentData,
                            config
                          )
                          .then(async (response) => {
                            const newPayment = response?.data?.data;
                            setPayments([newPayment, ...payments]);
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
                                  setPaymentData({
                                    ...paymentData,
                                    name: e.target.value,
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
                  ) : (
                    <Formik
                      initialValues={jobTypeInitialValues}
                      onSubmit={async (values) => {
                        setLoading(true);
                        await axios
                          .post(
                            `${API_URL}accounts-service/Account/AddUser`,
                            userData,
                            config
                          )
                          .then(async (response) => {
                            const newUser = response?.data?.data;
                            setUserData([newUser]);
                            setUsers([...userData[0], ...users]);
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
                              labelText="Username"
                              id="username"
                              required
                              formControlProps={{
                                fullWidth: true,
                              }}
                              inputProps={{
                                onChange: (e) => {
                                  setUserData({
                                    ...userData,
                                    username: e.target.value,
                                  });
                                },
                              }}
                            />
                            <CustomInput
                              labelText="First name"
                              id="firstname"
                              required
                              formControlProps={{
                                fullWidth: true,
                              }}
                              inputProps={{
                                onChange: (e) => {
                                  setUserData({
                                    ...userData,
                                    firstName: e.target.value,
                                  });
                                },
                              }}
                            />
                            <CustomInput
                              labelText="Last name"
                              id="lastname"
                              required
                              formControlProps={{
                                fullWidth: true,
                              }}
                              inputProps={{
                                onChange: (e) => {
                                  setUserData({
                                    ...userData,
                                    surname: e.target.value,
                                  });
                                },
                              }}
                            />
                            <CustomInput
                              labelText="Phone number"
                              id="phoneNumber"
                              required
                              formControlProps={{
                                fullWidth: true,
                              }}
                              inputProps={{
                                onChange: (e) => {
                                  setUserData({
                                    ...userData,
                                    phoneNumber: e.target.value,
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
                                  setUserData({
                                    ...userData,
                                    email: e.target.value,
                                  });
                                },
                              }}
                            />
                            <CustomInput
                              labelText="Profession"
                              id="profession"
                              required
                              formControlProps={{
                                fullWidth: true,
                              }}
                              inputProps={{
                                onChange: (e) => {
                                  setUserData({
                                    ...userData,
                                    profession: e.target.value,
                                  });
                                },
                              }}
                            />
                            <CustomInput
                              labelText="Status"
                              id="status"
                              required
                              formControlProps={{
                                fullWidth: true,
                              }}
                              inputProps={{
                                onChange: (e) => {
                                  setUserData({
                                    ...userData,
                                    status: e.target.value,
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
                  )}
                </Dialog>
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
