import React, { useContext, useEffect, useRef, useState } from "react";

// @material-ui/core components
import { makeStyles, useTheme } from "@material-ui/core/styles";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
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
import MaterialTable from "material-table";
import { API_URL } from "utils/constants/index.js";
import { useHistory } from "react-router-dom";
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
} from "@material-ui/core";
import CustomInput from "components/CustomInput/CustomInput.js";
import { Formik, Form } from "formik";
import axios from "axios";
import { AUTH_TOKEN_NAME } from "utils/constants/index.js";
import SnackBar from "components/Snackbar/Snackbar.js";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { AuthenticationContext } from "contexts/auth-context.js";

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "8px",
    marginBottom: "0px",
  },
};

const useStyles = makeStyles(styles);

export default function Jobs() {
  const { user } = useContext(AuthenticationContext);
  const token = localStorage.getItem(AUTH_TOKEN_NAME);
  const [data, setData] = useState([]);
  const [intervals, setAutoRecurringIntervals] = useState([]);
  const [customers, setCustomers] = useState([]);
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
  const getAllJobs = () => {
    axios
      .get(
        `${API_URL}jobs-service/Jobs/GetJobCards?clientId=${user?.data?.clientId}`,
        config
      )
      .then((response) => {
        response.data.data.map((item)=>{
          let newAssigned = "";      
          item.assignedTo.map((assigned, index)=>{
            const addComma = index > 0 ? ", ": "";
            newAssigned = newAssigned.concat(addComma + assigned.employeeFullName);
          });
          item.assignedTo = newAssigned;
        })           
        setData(response.data);
      })
      .catch((error) => {});
  }

  useEffect(() => {
    getAllJobs();
    getAutoRecurringIntervals();
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
    getCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const radioGroupRef = useRef(null);
  const [openModal, setModal] = useState({ modal: false, text: "" });
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState(false);
  const [convertData, setConvertData] = useState({});

  const handleClose = () => {
    setTimeout(setOpen(false), 2000);
  };
  const handleChange = (event) => {
    setJob({
      ...job,
      autoRecurring: { isActive: event.target.checked },
    });
    setChecked(event.target.checked);
  };
  const handleIntervalSelect = (event) => {
    setJob({
      ...job,
      autoRecurring: { isActive: checked, interval: `${event.target.value}` },
    });
  };

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };
  const handleCancel = () => {
    setModal(false);
  };

  const [job, setJob] = React.useState({
    jobId: user?.data?.jobId,
    title: "",
    subtitle: "",
    status: "",
    clientId: user?.data?.clientId,
    employeeId: "",
    assignedTo: "",
    notes: "",
    duration: 0,
    isActive: true,
    isDeleted: false,
    priority: "",
    address: "",
    description: "",
    jobType: "",
    customerName: "",
    invoiceId: user?.data?.invoiceId,
    quotationId: user?.data?.quotationId,
    customerId: "",
    autoRecurring: {
      interval: "",
      isActive: false,
    },
  });

  const [convertJob, setConvert] = useState("Invoice");
  const [customerId, setCustomerId] = useState("");
  const handleRadioChange = (event) => {
    setConvert(event.target.value);
  };
  const handleCustomerId = (event) => {
    setCustomerId(event.target.value);
  };
  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="primary" icon>
            <CardIcon color="primary">
              <Assignment />
            </CardIcon>
            <Button
              style={{
                float: "right",
                marginRight: theme.spacing(1),
                marginTop: -16,
                marginBottom: theme.spacing(1),
              }}
              className={classes.cardIconTitle}
              onClick={() => history.push("/admin/create-job")}
            >
              Create new job
            </Button>
          </CardHeader>
          <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xs"
            onEntering={handleEntering}
            aria-labelledby="confirmation-dialog-title"
            fullWidth
            open={openModal.modal}
          >
            {openModal.text === "Create Job" ||
            openModal.text === "Edit Job" ? (
              <Formik
                initialValues={job}
                onSubmit={async (values) => {
                  setLoading(true);
                  axios
                    .post(
                      `${API_URL}jobs-service/Jobs/${
                        openModal.text === "Edit Job"
                          ? "UpdateJobCard"
                          : "CreateJobCard"
                      }`,
                      job,
                      config
                    ) //create modal to edit and create
                    .then((response) => {
                      if (openModal.text === "Edit Job") {
                        axios
                          .get(
                            `${API_URL}jobs-service/Jobs/GetJobCards?clientId=${user?.data?.clientId}`,
                            config
                          )
                          .then((response) => {
                            setTableData([]);
                            setTableData(response.data.data);                        
                            history.push("/admin/dashboard");
                            history.push("/admin/jobs");
                          })
                          .catch((error) => {
                            setLoading(false);
                            setModal(false);
                          });
                      } else {
                        
                        setTableData([...data.data, response.data.data]);
                      }
                      setOpen(true);
                      setLoading(false);
                      setModal({ ...openModal, modal: false });
                    })
                    .catch((error) => {
                      setOpen(true);
                      setLoading(false);
                      setModal(false);
                      return (
                        <SnackBar
                          open={open}
                          place="bc"
                          color="warning"
                          message="Job was not created"
                          close="true"
                          closeNotification={handleClose}
                        ></SnackBar>
                      );
                    });
                }}
              >
                {(props) => (
                  <Form onSubmit={props.handleSubmit}>
                    <DialogTitle id="confirmation-dialog-title">
                      {openModal.text}
                    </DialogTitle>
                    <DialogContent dividers>
                      <CustomInput
                        labelText="Title"
                        id="title"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          value: job.title,
                          onChange: (e) => {
                            setJob({ ...job, title: e.target.value });
                          },
                        }}
                      />
                      <CustomInput
                        labelText="Subtitle"
                        id="subtitle"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          value: job.subtitle,
                          onChange: (e) => {
                            setJob({ ...job, subtitle: e.target.value });
                          },
                        }}
                      />
                      <CustomInput
                        labelText="Description"
                        id="description"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          value: job.description,
                          onChange: (e) => {
                            setJob({ ...job, description: e.target.value });
                          },
                        }}
                      />
                      <InputLabel
                        htmlFor="simple-select"
                        className={classes.selectLabel}
                      >
                        Customer *
                      </InputLabel>
                      <Select
                        type="text"
                        value={customerId}
                        onChange={handleCustomerId}
                        fullWidth
                        inputProps={{
                          value: job.customerId,
                          onChange: (e) => {
                            setJob({ ...job, customerId: e.target.value });
                          },
                        }}
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
                          className={classes.cardIconTitle}
                          onClick={() => history.push("/admin/customers")}
                          fullWidth
                        >
                          Add new customer
                        </Button>
                      </Select>
                      <CustomInput
                        labelText="Address"
                        id="address"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          value: job.address,
                          onChange: (e) => {
                            setJob({ ...job, address: e.target.value });
                          },
                        }}
                      />
                      <CustomInput
                        labelText="Notes"
                        id="notes"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          value: job.notes,
                          onChange: (e) => {
                            setJob({ ...job, notes: e.target.value });
                          },
                        }}
                      />
                      <FormControl
                        fullWidth
                        className={classes.selectFormControl}
                        style={{ marginBottom: theme.spacing(1) }}
                      >
                        <InputLabel
                          htmlFor="simple-select"
                          className={classes.selectLabel}
                        >
                          Priority
                        </InputLabel>
                        <Select
                          value={job.priority}
                          defaultValue={"medium"}
                          onChange={(e) => {
                            setJob({ ...job, priority: e.target.value });
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
                      <div>
                        <FormControlLabel
                          control={
                            <>
                              <Checkbox
                                checked={
                                  job?.autoRecurring?.isActive || checked
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
                              value={job.autoRecurring.interval}
                              onChange={handleIntervalSelect}
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
                                      value={interval.autoRecurringIntervalId}
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
                          fullWidth
                          className={classes.selectFormControl}
                          style={{ marginBottom: theme.spacing(1) }}
                        >
                          <InputLabel
                            htmlFor="simple-select"
                            className={classes.selectLabel}
                          >
                            Job Type
                          </InputLabel>
                          <Select
                            value={job.jobType}
                            defaultValue={"plumbing"}
                            onChange={(e) => {
                              setJob({ ...job, jobType: e.target.value });
                            }}
                            inputProps={{
                              name: "jobType",
                              id: "jobType",
                            }}
                          >
                            <MenuItem disabled>Select Job Type</MenuItem>
                            <MenuItem value="plumbing">Plumbing</MenuItem>
                            <MenuItem value="welding">Welding</MenuItem>
                          </Select>
                        </FormControl>
                        <FormControl
                          fullWidth
                          className={classes.selectFormControl}
                          style={{
                            marginBottom: theme.spacing(1),
                            marginLeft: 8,
                          }}
                        >
                          <InputLabel
                            htmlFor="simple-select"
                            className={classes.selectLabel}
                          >
                            Status
                          </InputLabel>
                          <Select
                            value={job.status}
                            onChange={(e) => {
                              setJob({ ...job, status: e.target.value });
                            }}
                            inputProps={{
                              name: "status",
                              id: "status",
                            }}
                          >
                            <MenuItem disabled>Select Status</MenuItem>
                            <MenuItem value="inactive">In Active</MenuItem>
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="pending">Pending</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    </DialogContent>
                    <DialogActions>
                      <Button autoFocus onClick={handleCancel} color="primary">
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        color="primary"
                        disabled={
                          job.jobType === "" ||
                          job.title === "" ||
                          customerId === ""
                        }
                      >
                        {loading ? (
                          <CircularProgress size="medium" />
                        ) : openModal.text === "Edit Job" ? (
                          "Update"
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
                initialValues={{
                  convertJob: "",
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
                        value={convertJob}
                        onChange={handleRadioChange}
                      >
                        <FormControlLabel
                          value="Invoice"
                          control={<Radio />}
                          label="Invoice"
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
                          convertJob === "Invoice"
                            ? history.push({
                                pathname: "/admin/create-invoice",
                                state: { data: convertData },
                              })
                            : history.push({
                                pathname: "/admin/create-quotation",
                                state: { data: convertData },
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
            )}
          </Dialog>
          <CardBody>
            { data !== undefined && (
              <MaterialTable
                title=""
                columns={[
                  {
                    title: "Client",
                    field: "customerName",
                  },
                  {
                    title: "Job Type",
                    field: "jobType",
                  },
                  {
                    title: "Status",
                    field: "status",
                  },
                  {
                    title: "Priority",
                    field: "priority",
                  },
                  {
                    title: "Created At",
                    field: "created_at",
                  },
                  {
                    title: "Job Card Number",
                    field: "jobNumber",
                  },
                  {
                    title: "Assigned To",
                    field: "assignedTo",
                  },
                  {
                    title: "Created By",
                    field: "employeeId"
                  },
                  
                ]}
                

                data={tableData.length > 0 ? tableData : data.data}
                // data = {tableData && tableData.length > 0 ? tableData.map((dt) => {
                //   var newAssigned = [];
                //   var result = (dt && dt.assignedTo) ?
                //   dt.assignedTo.map((assigned)=>{
                //     newAssigned.push(assigned.employeeFullName);
                //   }): [];
                //   dt.assignedTo = newAssigned;
                //   return dt;
                // }) : data && data.data.map((dt) => {
                //   var newAssigned = [];
                //   dt.assignedTo.map((assigned)=>{
                //     newAssigned.push(assigned.employeeFullName);
                //   });
                //   dt.assignedTo = newAssigned;
                //   return dt;
                // })}
               
                actions={[
                  {
                    icon: "edit",
                    tooltip: "Edit Job",
                    onClick: (event, rowData) => {
                      setJob(rowData);
                      history.push({
                        pathname: "/admin/create-job",
                        state: { data: rowData },
                      });
                    },
                  },
                  {
                    icon: "flip",
                    tooltip: "Convert Job",
                    onClick: (event, rowData) => {
                      setModal({
                        modal: true,
                        text: "Convert Job",
                      });
                      setConvertData({ ...convertData, rowData });
                    },
                  },
                  {
                    icon: "visibility",
                    tooltip: "View Job",
                    onClick: (event, rowData) => {
                      setJob(rowData);
                      history.push({
                        pathname: "/admin/view-job",
                        state: { data: rowData },
                      });
                    },
                  },
                  {
                    icon: "delete",
                    tooltip: "Delete Job",
                    onClick: (event, rowData) => {
                      console.log("Rw", rowData)
                      axios
                        .put(`${API_URL}jobs-service/Jobs/DeleteJob`,
                        {
                          jobId: rowData?.jobId,
                          clientId: rowData?.clientId
                        },
                        config
                        )
                        .then(() => getAllJobs())
                        .catch((err) => console.log("err", err))
                    },
                  },
                ]}
                options={{
                  actionsColumnIndex: -1,
                  tableLayout: "fixed"
                }}
              />
            )}
          </CardBody>
          <SnackBar
            open={open}
            place="bc"
            color="success"
            message="Job successfully created"
            close={true}
            closeNotification={handleClose}
          ></SnackBar>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
