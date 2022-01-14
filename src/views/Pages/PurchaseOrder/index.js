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
  TextField,
  Input
} from "@material-ui/core";
import { AuthenticationContext } from "contexts/auth-context.js";
import { bool } from "yup";
import { boolean } from "yup/lib/locale";
import { useHistory } from "react-router-dom";
import { parse } from "date-fns";

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
};

const useStyles = makeStyles(styles);
export default function PurchaseOrder() {
  const { user } = useContext(AuthenticationContext);
  const token = localStorage.getItem(AUTH_TOKEN_NAME);
  const history = useHistory();
  const [data, setData] = useState([]);
  const config = {
    headers: {
      Authorization: user?.data?.token || token,
    },
  };

  const getPurchaseOrders = (clientId) => {
    axios
      .get(
        `${API_URL}customer-service/PurchaseOder/GetByClientId?clientId=${clientId}`,
        config
      )
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {});
  };

  const getUserRoles = () => {
    // axios
    //   .get(
    //     `${API_URL}accounts-service/Account/GetRoles`,
    //     config
    //   )
    //   .then((response) => {
    //     setUserRoles(response.data.data);
    //   })
    //   .catch((error) => {
    //     setLoading(false);
    //     setModal(false);
    //   });
  };

  useEffect(() => {
    getPurchaseOrders(user?.data?.clientId);
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
    // setUserRoles({
    //   ...userProfile,
    //   role: { UserRole: `${event.target.value}` },
    // });
  };


  const handleCancel = () => {
    setModal(false);
  };

  const [purchaseOrder, setPurchaseOrder] = React.useState({
    purchaseOrderId: "",
    invoiceNumber: "",
    dateIssued: "",
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
    inventoryId: ""
  });

  let showInfo = openModal.text == "Create Purchase Order"? true : false
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
                setModal({ modal: true, text: "Create Purchase Order" })
              }
            >
              Create Purchase Order
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
                    initialValues={purchaseOrder}
                    onSubmit={async (values) => {
                      setLoading(true);
                      axios
                        .post(
                          `${API_URL}customer-service/PurchaseOder/${
                            openModal.text === "Edit Purchase Order"
                              ? "Update"
                              : "Create"
                          }`,
                          [purchaseOrder],
                          config
                        ) //create modal to edit and create
                        .then((response) => {
                          if (openModal.text === "Edit Purchase Order") {
                            axios
                              .get(
                                `${API_URL}customer-service/PurchaseOder/GetByClientId?clientId=${user?.data?.clientId}`,
                                config
                              )
                              .then((response) => {
                                setData([]);
                                setData(response.data.data);
                                history.push("/admin/dashboard");
                                history.push("/admin/purchase-order");
                              })
                              .catch((error) => {
                                setLoading(false);
                                setModal(false);
                              });
                          } else {
                            setData([...data.data, response.data.data]);
                            history.push("/admin/dashboard");
                            history.push("/admin/purchase-order");
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
                        <FormControl
                            fullWidth
                            style={{
                              marginTop: theme.spacing(2),
                              marginRight: theme.spacing(1),
                            }}
                        >
                        <TextField
                            labelText="DateIssued"
                            id="dateIssued"
                            type="datetime-local"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              value: purchaseOrder.dateIssued,
                              onChange: (e) => {
                                setPurchaseOrder({
                                  ...purchaseOrder,
                                  dateIssued: e.target.value,
                                });
                              },
                            }}
                          />  
                           </FormControl>
                           <FormControl
                            fullWidth
                            style={{
                              marginTop: theme.spacing(3),
                              marginRight: theme.spacing(1),
                            }}
                          >
                            <InputLabel
                              htmlFor="simple-select"
                              className={classes.selectLabel}
                            >
                              STATUS
                            </InputLabel>

                            <Select
                              value={purchaseOrder.active}
                              defaultValue={"medium"}
                              onChange={(e) => {
                                setPurchaseOrder({
                                  ...purchaseOrder,
                                  status: e.target.value,
                                });
                              }}
                              inputProps={{
                                name: "IN-PROGRESS",
                                id: "IN-PROGRESS",
                              }}
                            >
                              <MenuItem disabled>Select Option</MenuItem>
                              <MenuItem value="IN-PROGRESS">IN-PROGRESS</MenuItem>
                              <MenuItem value="DELIVERED">DELIVERED</MenuItem>
                            </Select>
                            </FormControl>
                          <CustomInput
                            labelText="NOTES"
                            id="notes"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              value: purchaseOrder.notes,
                              onChange: (e) => {
                                setPurchaseOrder({
                                  ...purchaseOrder,
                                  notes: e.target.value,
                                });
                              },
                            }}
                          />
                          <CustomInput
                            labelText="Location"
                            id="location"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              value: purchaseOrder.location,
                              onChange: (e) => {
                                setPurchaseOrder({
                                  ...purchaseOrder,
                                  location: e.target.value,
                                });
                              },
                            }}
                          /> 
                          <FormControl
                            fullWidth
                            style={{
                              marginTop: theme.spacing(2),
                              marginRight: theme.spacing(1),
                            }}
                          > 
                           <InputLabel
                              htmlFor="cost"
                              className={classes.selectLabel}
                            >
                              Cost
                            </InputLabel>                      
                         <Input
                            labelText="Cost"
                            id="cost"
                            type="number"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              value: purchaseOrder.cost,
                              onChange: (e) => {
                                setPurchaseOrder({
                                  ...purchaseOrder,
                                  cost: parseFloat(e.target.value),
                                });
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
                          <InputLabel
                              htmlFor="quantity"
                              className={classes.selectLabel}
                            >
                              Quantity
                            </InputLabel>                          
                         <Input
                            labelText="Quantity"
                            id="quantity"
                            type="number"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              value: purchaseOrder.quantity,
                              onChange: (e) => {
                                setPurchaseOrder({
                                  ...purchaseOrder,
                                  quantity: parseFloat(e.target.value),
                                });
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
                          <InputLabel
                              htmlFor="vat"
                              className={classes.selectLabel}
                            >
                              VAT
                            </InputLabel>          
                        <Input
                            labelText="VAT"
                            id="vat"
                            type="number"
                            step=".01"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              value: purchaseOrder.vat,
                              onChange: (e) => {
                                setPurchaseOrder({
                                  ...purchaseOrder,
                                  vat: parseFloat(e.target.value),
                                });
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
                          <InputLabel
                              htmlFor="unitPrice"
                              className={classes.selectLabel}
                            >
                              Unit Price
                            </InputLabel>   
                          <Input
                            labelText="Unit Price"
                            id="unitPrice"
                            type="number"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              value: purchaseOrder.unitPrice,
                              onChange: (e) => {
                                setPurchaseOrder({
                                  ...purchaseOrder,
                                  unitPrice: parseFloat(e.target.value),
                                });
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
                          <InputLabel
                              htmlFor="totalCost"
                              className={classes.selectLabel}
                            >
                              Total Cost
                            </InputLabel>   
                            <Input
                            labelText="Total Cost"
                            id="totalCost"
                            type="number"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              value: purchaseOrder.totalCost,
                              onChange: (e) => {
                                setPurchaseOrder({
                                  ...purchaseOrder,
                                  totalCost: parseFloat(e.target.value),
                                });
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
                          <InputLabel
                              htmlFor="attachments"
                              className={classes.selectLabel}
                            >
                              Attachments
                            </InputLabel>       
                            <Input
                            labelText="Attachments"
                            id="attachments"
                            type="file"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              value: purchaseOrder.attachments,
                              onChange: (e) => {
                                setPurchaseOrder({
                                  ...purchaseOrder,
                                  attachments: e.target.value,
                                });
                              },
                            }}
                          />          
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
                            ) : openModal.text === "Edit Purchase Order" ? (
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
                    title: "Purchase Order Id",
                    field: "purchaseOrderId",
                    hidden: true
                  },
                  {
                    title: "Date Issued",
                    field: "dateIssued"
                  },
                  {
                    title: "Status",
                    field: "status"
                  },
                  {
                    title: "Cost",
                    field: "cost"
                  },
                  {
                    title: "Quantity",
                    field: "quantity"
                  },
                  {
                    title: "Unit Price",
                    field: "unitPrice"
                  },
                  {
                    title: "Total Cost",
                    field: "totalCost"
                  }
                ]}
                data={tableData.length > 0 ? tableData : data.data}
                actions={[
                  {
                    icon: "edit",
                    tooltip: "Edit Purchase Order",
                    onClick: (event, rowData) => {
                      //alert("You saved " + rowData);
                      setPurchaseOrder(rowData);
                      setModal({ modal: true, text: "Edit Purchase Order" });
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