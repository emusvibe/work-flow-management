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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import CustomInput from "components/CustomInput/CustomInput.js";
import { Formik, Form } from "formik";
import axios from "axios";
import { AUTH_TOKEN_NAME } from "utils/constants/index.js";
import SnackBar from "components/Snackbar/Snackbar.js";
import { AuthenticationContext } from "contexts/auth-context.js";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "8px",
    marginBottom: "0px",
  },
};

const useStyles = makeStyles(styles);

export default function Purchase() {
  const { user } = useContext(AuthenticationContext);
  const token = localStorage.getItem(AUTH_TOKEN_NAME);
  const [data, setData] = useState([]);
  const history = useHistory();
  const config = {
    headers: {
      Authorization: user?.data?.token || token,
    },
  };

  useEffect(() => {
    axios
      .get(
        `${API_URL}customer-service/PurchaseOder/GetByClientId?clientId=${user?.data?.clientId}`,
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
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
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
    setModal({ ...openModal, modal: false });
  };

  const [purchase, setPurchase] = React.useState(
    {
      purchaseOrderId: "",
      invoiceNumber: "",
      status: "",
      notes: "",
      location: "",
      cost: 0,
      quantity: 0,
      vat: 0,
      unitPrice: 0,
      totalCost: 0,
      attachments: "",
      clientId: user?.data?.clientId,
      inventoryId: "",
    }
  );

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
                setModal({ modal: true, text: "Create purchase order" })
              }
            >
              Create purchase order
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
              initialValues={purchase}
              onSubmit={async (values) => {
                setLoading(true);
                axios
                  .post(
                    `${API_URL}customer-service/PurchaseOder/Create`,
                    [purchase],
                    config
                  ) //create modal to edit and create
                  .then((response) => {
                    setTableData([...data.data, response.data.data]);
                    setOpen(true);
                    setLoading(false);
                    setModal({ ...openModal, modal: false });
                    history.push("/admin/purchase")
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
                        message="Order was not created"
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
                    <FormControl
                      fullWidth
                      className={classes.selectFormControl}
                      style={{ marginBottom: theme.spacing(1) }}
                    >
                      <CustomInput
                        labelText="Invoice Number"
                        id="invoiceNumber"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          value: purchase.invoiceNumber,
                          onChange: (e) => {
                            setPurchase({
                              ...purchase,
                              invoiceNumber: e.target.value,}
                            );
                          },
                        }}
                      />
                    </FormControl>
                    <CustomInput
                      labelText="Notes"
                      id="notes"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        value: purchase.notes,
                        onChange: (e) => {
                          setPurchase({...purchase, notes: e.target.value});
                        },
                      }}
                    />
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
                        value={purchase.status}
                        onChange={(e) => {
                          setPurchase({...purchase, status: e.target.value});
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
                    <div style={{ display: "flex" }}>
                      <CustomInput
                        labelText="Location"
                        id="location"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          value: purchase.location,
                          onChange: (e) => {
                            setPurchase({...purchase, location: e.target.value});
                          },
                        }}
                      />
                    </div>
                  </DialogContent>
                  <DialogActions>
                    <Button autoFocus onClick={handleCancel} color="primary">
                      Cancel
                    </Button>
                    <Button type="submit" color="primary">
                      {loading ? (
                        <CircularProgress size="medium" />
                      ) : openModal.text === "Edit Purchase" ? (
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
                    title: "Order ID",
                    field: "purchaseOrderId",
                  },
                  {
                    title: "Status",
                    field: "status",
                  },
                  {
                    title: "Location",
                    field: "location",
                  },
                  {
                    title: "Invoice Number",
                    field: "invoiceNumber",
                  },
                  {
                    title: "Inventory ID",
                    field: "inventoryId",
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
                    tooltip: "Edit Purchase",
                    onClick: (event, rowData) => {
                      setPurchase(rowData);
                      setModal({ modal: true, text: "Edit Purchase" });
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
            message="Job successfully created"
            close={true}
            closeNotification={handleClose}
          ></SnackBar>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
