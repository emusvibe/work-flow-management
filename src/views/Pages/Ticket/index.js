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
    marginTop: "15px",
    marginBottom: "0px",
  },
};

const useStyles = makeStyles(styles);
export default function Ticket() {
  const { user } = useContext(AuthenticationContext);
  const token = localStorage.getItem(AUTH_TOKEN_NAME);

  const [data, setData] = useState([]);
  const config = {
    headers: {
      Authorization: user?.data?.token || token,
    },
  };
  const getTickets = (clientId) => {
    axios
      .get(
        `${API_URL}customer-service/Tickets/GetClientTickets?clientId=${clientId}`,
        config
      )
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {});
  };

  const getTicketStatuses = (clientId) => {
    axios
      .get(
        `${API_URL}customer-service/Tickets/GetClientTicketsStatus?clientId=${clientId}`,
        config
      )
      .then((response) => {
        setTicketStatuses(response.data.data);
      })
      .catch((error) => {
        setLoading(false);
        setModal(false);
      });
  };

  const getTicketTypes = (clientId) => {
    axios
      .get(
        `${API_URL}customer-service/Tickets/GetClientTicketType?clientId=${user?.data?.clientId}`,
        config
      )
      .then((response) => {
        setTicketTypes(response.data.data);
      })
      .catch((error) => {
        setLoading(false);
        setModal(false);
      });
  };

  useEffect(() => {
    getTickets(user?.data?.clientId);
    getTicketStatuses(user?.data?.clientId);
    getTicketTypes(user?.data?.clientId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.data?.clientId]);

  const classes = useStyles();
  const theme = useTheme();
  const radioGroupRef = useRef(null);
  const [openModal, setModal] = useState({ modal: false, text: "" });
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [ticketStatuses, setTicketStatuses] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);
  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };
  const handleCancel = () => {
    setModal(false);
  };

  const [ticket, setTicket] = useState({
    type: "",
    subject: "",
    description: "",
    priority: "",
    status: "",
    assigned: "",
    customerId: "",
    employeeId: user?.data?.employeeId,
    clientId: user?.data?.clientId,
    isDeleted: false,
  });

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
              onClick={() => setModal({ modal: true, text: "Create Ticket" })}
            >
              Create new ticket
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
              initialValues={ticket}
              onSubmit={async (values) => {
                setLoading(true);

                axios
                  .post(
                    `${API_URL}customer-service/Tickets/${
                      openModal.text === "Edit Ticket"
                        ? "UpdateTicket"
                        : "CreateTicket"
                    }`,
                    ticket,
                    config
                  ) //create modal to edit and create
                  .then((response) => {
                    if (openModal.text === "Edit Ticket") {
                      axios
                        .get(
                          `${API_URL}customer-service/Tickets/GetTickets?clientId=${user?.data?.clientId}`,
                          config
                        )
                        .then((response) => {
                          setTableData([]);
                          setTableData(response.data.data);
                        })
                        .catch((error) => {
                          setLoading(false);
                          setModal(false);
                        });
                    } else {
                      setTableData([...data.data, response.data.data]);
                    }
                    setLoading(false);
                    setModal({ ...openModal, modal: false });
                  })
                  .catch((error) => {
                    setLoading(false);
                    setModal(false);
                  });
              }}
            >
              {(props) => (
                <Form onSubmit={props.handleSubmit}>
                  <DialogTitle id="confirmation-dialog-title">
                    {openModal.text}
                  </DialogTitle>
                  <DialogContent dividers>
                    <FormControl
                      fullWidth
                      className={classes.selectFormControl}
                      style={{ marginBottom: theme.spacing(1) }}
                    >
                      <InputLabel
                        htmlFor="simple-select"
                        className={classes.selectLabel}
                      >
                        Type
                      </InputLabel>
                      <Select
                        value={ticket.type}
                        defaultValue={"medium"}
                        onChange={(e) => {
                          setTicket({ ...ticket, type: e.target.value });
                        }}
                        inputProps={{
                          name: "type",
                          id: "type",
                        }}
                      >
                        {ticketTypes.map((ticketType) => {
                          return (
                            <MenuItem value={ticketType.name}>
                              {ticketType.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>

                    <CustomInput
                      labelText="Subject"
                      id="subject"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        value: ticket.subject,
                        onChange: (e) => {
                          setTicket({ ...ticket, subject: e.target.value });
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
                        multiline: true,
                        rows: 2,
                        value: ticket.description,
                        onChange: (e) => {
                          setTicket({ ...ticket, description: e.target.value });
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
                        value={ticket.priority}
                        defaultValue={"medium"}
                        onChange={(e) => {
                          setTicket({ ...ticket, priority: e.target.value });
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

                    <FormControl
                      fullWidth
                      className={classes.selectFormControl}
                      style={{ marginBottom: theme.spacing(1) }}
                    >
                      <InputLabel
                        htmlFor="simple-select"
                        className={classes.selectLabel}
                      >
                        Status
                      </InputLabel>
                      <Select
                        value={ticket.status}
                        defaultValue={"NOT STARTED"}
                        onChange={(e) => {
                          setTicket({ ...ticket, status: e.target.value });
                        }}
                        inputProps={{
                          name: "status",
                          id: "status",
                        }}
                      >
                        <MenuItem disabled>Select Status</MenuItem>
                        {ticketStatuses.map((ticketStatus) => {
                          return (
                            <MenuItem value={ticketStatus.name}>
                              {ticketStatus.name}
                            </MenuItem>
                          );
                        })}
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
                        Assign
                      </InputLabel>
                      <Select
                        value={ticket.assigned}
                        defaultValue={"0"}
                        onChange={(e) => {
                          setTicket({ ...ticket, assigned: e.target.value });
                        }}
                        inputProps={{
                          name: "assigned",
                          id: "assigned",
                        }}
                      >
                        <MenuItem value="0" disabled>
                          Select Ticket Type
                        </MenuItem>
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
                        isDeleted
                      </InputLabel>
                      <Select
                        disabled="true"
                        value={ticket.isDeleted}
                        onChange={(e) => {
                          setTicket({ ...ticket, isDeleted: e.target.value });
                        }}
                        inputProps={{
                          name: "isDeleted",
                          id: "isDeleted",
                        }}
                      >
                        <MenuItem disabled>isDeleted</MenuItem>
                        <MenuItem value="true">True</MenuItem>
                        <MenuItem value="false">False</MenuItem>
                      </Select>
                    </FormControl>
                  </DialogContent>
                  <DialogActions>
                    <Button autoFocus onClick={handleCancel} color="primary">
                      Cancel
                    </Button>
                    <Button type="submit" color="primary">
                      {loading ? (
                        <CircularProgress size="medium" />
                      ) : openModal.text === "Edit Ticket" ? (
                        "Update"
                      ) : (
                        "Create"
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
                    title: "TicketId",
                    field: "ticketId",
                  },
                  {
                    title: "Type",
                    field: "type",
                  },
                  {
                    title: "Subject",
                    field: "subject",
                  },
                  {
                    title: "Description",
                    field: "description",
                  },
                  {
                    title: "Priority",
                    field: "priority",
                  },
                  {
                    title: "Status",
                    field: "status",
                  },
                  {
                    title: "Assigned",
                    field: "assigned",
                  },
                  {
                    title: "Created At",
                    field: "create_at",
                  },
                ]}
                data={tableData.length > 0 ? tableData : data.data}
                actions={[
                  {
                    icon: "edit",
                    tooltip: "Edit Ticket",
                    onClick: (event, rowData) => {
                      //alert("You saved " + rowData);
                      setTicket(rowData);
                      setModal({ modal: true, text: "Edit Ticket" });
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
