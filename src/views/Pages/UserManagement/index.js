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
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import CustomInput from "components/CustomInput/CustomInput.js";
import { Formik, Form } from "formik";
import axios from "axios";
import { AUTH_TOKEN_NAME } from "utils/constants/index.js";
import Snackbar from "components/Snackbar/Snackbar.js";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { AuthenticationContext } from "contexts/auth-context.js";
import { bool } from "yup";
import { boolean } from "yup/lib/locale";
import { useHistory } from "react-router-dom";

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
};

const useStyles = makeStyles(styles);
export default function UserManagement() {
  const { user } = useContext(AuthenticationContext);
  const token = localStorage.getItem(AUTH_TOKEN_NAME);
  const history = useHistory();
  const [data, setData] = useState([]);
  const config = {
    headers: {
      Authorization: user?.data?.token || token,
    },
  };

  const getUserProfiles = (clientId) => {
    axios
      .get(
        `${API_URL}accounts-service/Account/GetUserProfilesByClient?clientId=${clientId}`,
        config
      )
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {});
  };

  const getUserRoles = () => {
    axios
      .get(
        `${API_URL}accounts-service/Account/GetRoles`,
        config
      )
      .then((response) => {
        setUserRoles(response.data.data);
      })
      .catch((error) => {
        setLoading(false);
        setModal(false);
      });
  };

  useEffect(() => {
    getUserProfiles(user?.data?.clientId);
    getUserRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.data?.clientId]);

  const classes = useStyles();
  const theme = useTheme();
  const radioGroupRef = useRef(null);
  const [openModal, setModal] = useState({ modal: false, text: "" });
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [userRoles, setUserRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRolesSelect = (event) => {
    setUserRoles({
      ...userProfile,
      role: { UserRole: `${event.target.value}` },
    });
  };


  const handleCancel = () => {
    setModal(false);
  };

  const [userProfile, setUserProfile] = React.useState({
    firstname: "",
    surname: "",
    email: "",
    username: "",
    password: "",
    clientId: user?.data?.clientId,
    employeeId: "",
    userId: "",
    active: 0,
    phoneNumber:"",
    userType: 0,
    role: null,
    customerId: null
  });

  let showInfo = openModal.text == "Create User"? true : false
  console.log("MODAL TEXT", openModal.text);
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
                setModal({ modal: true, text: "Create User" })
              }
            >
              Create new user
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
                  <Formik
                    initialValues={userProfile}
                    onSubmit={async (values) => {
                      setLoading(true);

                      axios
                        .post(
                          `${API_URL}accounts-service/Account/${
                            openModal.text === "Edit User Profile"
                              ? "UpdateUserProfile"
                              : "AddUser"
                          }`,
                          userProfile,
                          config
                        ) //create modal to edit and create
                        .then((response) => {
                          if (openModal.text === "Edit User Profile") {
                            axios
                              .get(
                                `${API_URL}accounts-service/Account/GetUserProfilesByClient?clientId=${user?.data?.clientId}`,
                                config
                              )
                              .then((response) => {
                                setData([]);
                                setData(response.data.data);
                                history.push("/admin/dashboard");
                                history.push("/admin/users");
                              })
                              .catch((error) => {
                                setLoading(false);
                                setModal(false);
                              });
                          } else {
                            setData([...data.data, response.data.data]);
                            history.push("/admin/dashboard");
                            history.push("/admin/users");
                          }
                          setOpen(true);
                          setLoading(false);
                          setModal({ ...openModal, modal: false });
                        })
                        .catch((error) => {
                          setOpen(true);
                          setLoading(false);
                          setModal(false);
                          return(
                            <Snackbar 
                              open={open} 
                              place="bc"
                              color="warning"
                              message="User was not created"
                              close="true"
                              closeNotification={handleClose}
                            ></Snackbar>);
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
                            labelText="First Name"
                            id="firstname"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              value: userProfile.firstname,
                              onChange: (e) => {
                                setUserProfile({
                                  ...userProfile,
                                  firstname: e.target.value,
                                });
                              },
                            }}
                          />  
                          <CustomInput
                            labelText="Surname"
                            id="surname"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              value: userProfile.surname,
                              onChange: (e) => {
                                setUserProfile({
                                  ...userProfile,
                                  surname: e.target.value,
                                });
                              },
                            }}
                          />
                          <CustomInput
                            labelText="Username"
                            id="username"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              value: userProfile.username,
                              onChange: (e) => {
                                setUserProfile({
                                  ...userProfile,
                                  username: e.target.value,
                                });
                              },
                            }}
                          />                        
                          <CustomInput
                            style={{ display: showInfo ? "block" : "none" }}
                            labelText="Password"
                            id="password"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              type: "password",
                              autoComplete: "off",
                              value: userProfile.password,
                              onChange: (e) => {
                                setUserProfile({
                                  ...userProfile,
                                  password: e.target.value,
                                });
                              },
                            }}
                            type="password"
                          />                                 
                          <CustomInput
                            labelText="Email"
                            id="email"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              multiline: true,
                              rows: 2,
                              value: userProfile.email,
                              onChange: (e) => {
                                setUserProfile({
                                  ...userProfile,
                                  email: e.target.value,
                                });
                              },
                            }}
                          />
                          <CustomInput
                            labelText="Phone Number"
                            id="phoneNumber"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              multiline: true,
                              rows: 2,
                              value: userProfile.phoneNumber,
                              onChange: (e) => {
                                setUserProfile({
                                  ...userProfile,
                                  phoneNumber: e.target.value,
                                });
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
                              Active
                            </InputLabel>
                            <Select
                              value={userProfile.active}
                              defaultValue={"medium"}
                              onChange={(e) => {
                                setUserProfile({
                                  ...userProfile,
                                  active: e.target.value,
                                });
                              }}
                              inputProps={{
                                name: "Active",
                                id: "active",
                              }}
                            >
                              <MenuItem disabled>Select Option</MenuItem>
                              <MenuItem value="1">Active</MenuItem>
                              <MenuItem value="0">InActive</MenuItem>
                            </Select>
                          </FormControl>
                          <FormControl 
                            fullWidth
                            className={classes.selectFormControl}
                            style={{ marginBottom: theme.spacing(1) }}
                          >
                            <InputLabel
                              htmlFor="simple-select"
                              className={classes.selectLabel}
                            >
                              User Role
                            </InputLabel>
                            <Select
                              value={userProfile.role}
                              defaultValue={"Null"}
                              onChange={(e) => {
                                setUserProfile({
                                  ...userProfile,
                                  role: e.target.value,
                                });
                              }}
                              inputProps={{
                                name: "User Role",
                                id: "UserRole",
                              }}
                            >
                              <MenuItem disabled>Select User Role</MenuItem>
                            {userRoles?.map((rl) => (
                              <MenuItem
                                key={rl.roleId}
                                value={rl.role}
                              >
                                {rl.role}
                              </MenuItem>
                            ))}
                           
                            </Select>
                          </FormControl>
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
                            ) : openModal.text === "Edit Ticket" ? (
                              "Update"
                            ) : (
                              "Save"
                            )}
                          </Button>
                        </DialogActions>
                      </Form>
                    )}
                  </Formik>
                </Dialog>

          <CardBody>
            {data !== undefined && (
              <MaterialTable
                title=""
                columns={[
                  {
                    title: "User Id",
                    field: "userId",
                    hidden: true
                  },
                  {
                    title: "First Name",
                    field: "firstname"
                  },
                  {
                    title: "Surname",
                    field: "surname"
                  },
                  {
                    title: "Username",
                    field: "username"
                  },
                  {
                    title: "Email",
                    field: "email"
                  },
                  {
                    title: "Phone Number",
                    field: "phoneNumber"
                  },
                  {
                    title: "Active",
                    field: "isActive"
                  },
                  {
                    title: "User Role",
                    field: "role"
                  }
                ]}
                data={tableData.length > 0 ? tableData : data.data}
                actions={[
                  {
                    icon: "edit",
                    tooltip: "Edit User Profile",
                    onClick: (event, rowData) => {
                      //alert("You saved " + rowData);
                      setUserProfile(rowData);
                      setModal({ modal: true, text: "Edit User Profile" });
                    },
                  },
                ]}
                options={{
                  actionsColumnIndex: -1,
                }}
              />
            )}
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}