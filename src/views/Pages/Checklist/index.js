import React, { useContext, useEffect, useRef, useState } from "react";

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
import MaterialTable from "material-table";
import { API_URL } from "utils/constants/index.js";
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Input,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { Formik, Form, FieldArray, Field } from "formik";
import axios from "axios";
import { AUTH_TOKEN_NAME } from "utils/constants/index.js";
import SnackBar from "components/Snackbar/Snackbar.js";
import { AuthenticationContext } from "contexts/auth-context.js";

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "8px",
    marginBottom: "0px",
  },
};

const useStyles = makeStyles(styles);

export default function Checklist() {
  const { user } = useContext(AuthenticationContext);
  const token = localStorage.getItem(AUTH_TOKEN_NAME);
  const [data, setData] = useState([]);
  const config = {
    headers: {
      Authorization: user?.data?.token || token,
    },
  };
  useEffect(() => {
    axios
      .get(
        `${API_URL}jobs-service/Jobs/GetJobCards?clientId=${user?.data?.clientId}`,
        config
      )
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const classes = useStyles();
  const theme = useTheme();
  const radioGroupRef = useRef(null);
  const [openModal, setModal] = useState({ modal: false, text: "" });
  const loading = false;
  const tableData = [];
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };
  const handleCancel = () => {
    setModal({ modal: false });
  };

  const [jobType, setJobType] = useState("");
  const [jobTypes, setJobTypes] = useState([]);
  useEffect(() => {
    axios
      .get(
        `${API_URL}jobs-service/Jobs/GetJobCards?clientId=${user?.data?.clientId}`,
        config
      )
      .then((response) => {
        setJobTypes(response.data.data);
      })
      .catch((error) => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const initialValues = {
    checklistItems: [
      {
        description: "",
      },
    ],
  };
  const handleJobType = (event) => {
    setJobType(event.target.value);
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
              onClick={() =>
                setModal({ modal: true, text: "Create Checklist" })
              }
            >
              Create Checklist
            </Button>
          </CardHeader>
          <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="sm"
            onEntering={handleEntering}
            aria-labelledby="confirmation-dialog-title"
            fullWidth
            open={openModal.modal}
          >
            <Formik
              initialValues={initialValues}
              onSubmit={async (values) => {}}
              render={({ values, errors, touched }) => {
                return (
                  <Form onSubmit={(values) => {}}>
                    <DialogTitle id="confirmation-dialog-title">
                      {openModal.text}
                    </DialogTitle>
                    <DialogContent dividers>
                      <FormControl
                        required
                        style={{
                          marginBottom: theme.spacing(2),
                          width: "100%",
                        }}
                      >
                        <InputLabel
                          htmlFor="simple-select"
                          className={classes.selectLabel}
                          fullWidth
                        >
                          Job Type
                        </InputLabel>
                        <Select
                          value={jobType}
                          fullwidth
                          onChange={handleJobType}
                        >
                          {jobTypes?.map((jobType) => (
                            <MenuItem value={jobType} key={jobType.jobId}>
                              {jobType.jobId}
                            </MenuItem>
                          ))}
                          <Button
                            className={classes.cardIconTitle}
                            fullWidth
                            onClick={() =>
                              setModal({
                                modal: true,
                                text: "New Job Type",
                              })
                            }
                          >
                            Add New Job Type
                          </Button>
                        </Select>
                      </FormControl>
                      <FieldArray
                        name="checklistItems"
                        render={({ remove, push }) => (
                          <>
                            <p className="text-center">Checklist item</p>
                            <div>
                              {values &&
                                values.checklistItems &&
                                values.checklistItems.length > 0 &&
                                values.checklistItems.map(
                                  (checklistItems, index) => {
                                    return (
                                      <>
                                        <div
                                          style={{
                                            display: "flex",
                                            justifyItems: "center",
                                            alignItems: "center",
                                          }}
                                        >
                                          <div style={{ marginRight: 8 }}>
                                            {index + 1}
                                          </div>
                                          <Field
                                            name={`checklistItems.${index}.description`}
                                            type="text"
                                            render={({ field, form, meta }) => (
                                              <Input
                                                {...field}
                                                type="text"
                                                fullWidth
                                                error={
                                                  meta.error && meta.touched
                                                }
                                                onChange={(e) => {
                                                  const description =
                                                    e.target.value;
                                                  form.setFieldValue(
                                                    `checklistItems.${index}.description`,
                                                    description
                                                  );
                                                }}
                                              />
                                            )}
                                          />
                                          <FormControlLabel
                                            control={<Checkbox name="image" />}
                                            label="Take Picture"
                                          />
                                          <FormControlLabel
                                            control={
                                              <Checkbox name="checkbox" />
                                            }
                                            label="Checkbox"
                                          />
                                          {values.checklistItems.length ===
                                          1 ? null : (
                                            <div style={{ marginLeft: 8 }}>
                                              <Field
                                                name={`checklistItems.${index}.isRemoved`}
                                                type="number"
                                                render={({ field, form }) => (
                                                  <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    onClick={() => {
                                                      if (data) {
                                                        form.setFieldValue(
                                                          `checklistItems.${index}.isRemoved`,
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
                                            </div>
                                          )}
                                        </div>
                                      </>
                                    );
                                  }
                                )}
                            </div>
                            <Button
                              variant="outlined"
                              color="primary"
                              onClick={() =>
                                push({
                                  name: "",
                                })
                              }
                              style={{ marginRight: 16 }}
                              className="btn btn-primary"
                            >
                              Add Line
                            </Button>
                            <SnackBar
                              open={open}
                              place="bc"
                              color="success"
                              message="Checklist successfully created"
                              close="true"
                              closeNotification={handleClose}
                            ></SnackBar>
                          </>
                        )}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button autoFocus onClick={handleCancel} color="primary">
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        color="primary"
                        disabled={jobType === ""}
                      >
                        {loading ? (
                          <CircularProgress size="medium" />
                        ) : openModal.text === "Edit Checklist" ? (
                          "Update"
                        ) : (
                          "Create"
                        )}
                      </Button>
                    </DialogActions>
                  </Form>
                );
              }}
            />
          </Dialog>
          <CardBody>
            {data !== undefined && (
              <MaterialTable
                title=""
                columns={[
                  {
                    title: "Description",
                    field: "checklistDescription",
                    render: () => {
                      return <p>Some informative description</p>;
                    },
                  },
                  {
                    title: "Requires Image",
                    field: "imageRequired",
                    render: () => {
                      return <p>false</p>;
                    },
                  },
                  {
                    title: "Checkbox",
                    field: "checkbox",
                    render: () => {
                      return <p>true</p>;
                    },
                  },
                  {
                    title: "Job Id",
                    field: "jobId",
                  },
                ]}
                data={tableData.length > 0 ? tableData : data.data}
                actions={[
                  {
                    icon: "edit",
                    tooltip: "Edit Checklist",
                    onClick: (event, rowData) => {
                      setJobType(rowData.jobType);
                      setModal({ modal: true, text: "Edit Checklist" });
                    },
                  },
                ]}
                options={{
                  actionsColumnIndex: -1,
                }}
              />
            )}
          </CardBody>
          <SnackBar
            open={open}
            place="bc"
            color="success"
            message="Checklist successfully created"
            close={true}
            closeNotification={handleClose}
          ></SnackBar>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
