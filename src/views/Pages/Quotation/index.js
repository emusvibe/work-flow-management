import React, { useContext, useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MaterialTable from "material-table";
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
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { Form, Formik } from "formik";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { cardTitle } from "../../../assets/jss/material-dashboard-pro-react.js";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { API_URL } from "utils/constants/index.js";
import { AuthenticationContext } from "contexts/auth-context.js";
import { AUTH_TOKEN_NAME } from "utils/constants/index.js";

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
};

const useStyles = makeStyles(styles);

export default function Quotations() {
  const { user } = useContext(AuthenticationContext);
  const token = localStorage.getItem(AUTH_TOKEN_NAME);

  const [data, setData] = useState([]);
  const config = {
    headers: {
      Authorization: user?.data?.token || token,
    },
  };

  useEffect(() => {
    const getQoutations = () => {
      axios
        .get(
          `${API_URL}jobs-service/Quotation/GetAllQuotationsByClient?clientId=${user?.data?.clientId}`,
          config
        )
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
        });
    };
    getQoutations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const [openModal, setModal] = useState({ modal: false, text: "" });

  const radioGroupRef = React.useRef(null);

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const [convertQuotation, setConvert] = useState("Invoice");
  const [convertData, setConvertData] = useState({});
  const handleRadioChange = (event) => {
    setConvert(event.target.value);
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
              onClick={() => history.push("/admin/create-quotation")}
            >
              Create new quotation
            </Button>
          </CardHeader>
          <CardBody>
            {data && data.data && data.data.quotationList !== undefined && (
              <>
                <MaterialTable
                  title=""
                  columns={[
                    {
                      title: "Quote No",
                      field: "quotationId",
                      render: (data) => {
                        return <p># {data.quotationId}</p>;
                      },
                    },
                    {
                      title: "Address",
                      field: "address",
                    },
                    {
                      title: "Status",
                      field: "status",
                    },
                    {
                      title: "Created At",
                      field: "created_at",
                    },
                    {
                      title: "Updated At",
                      field: "updated_at",
                    },
                    {
                      title: "Due Date",
                      field: "dueDate",
                    },
                  ]}
                  data={data.data.quotationList}
                  actions={[
                    {
                      icon: "visibility",
                      tooltip: "View Quotation",
                      onClick: (event, rowData) => {
                        history.push({
                          pathname: "/admin/view-quotation",
                          state: { data: rowData },
                        });
                      },
                    },
                    {
                      icon: "edit",
                      tooltip: "Edit Quotation",
                      onClick: (event, rowData) => {
                        history.push({
                          pathname: "/admin/create-quotation",
                          state: { data: rowData },
                        });
                      },
                    },
                    {
                      icon: "flip",
                      tooltip: "Convert Quotation",
                      onClick: (event, rowData) => {
                        setModal({
                          modal: true,
                          text: "Convert Quotation",
                        });
                        setConvertData({ ...convertData, rowData });
                      },
                    },
                  ]}
                  options={{
                    actionsColumnIndex: -1,
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
                    initialValues={{
                      convertQuotation: "",
                    }}
                    onSubmit={() => {}}
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
                            value={convertQuotation}
                            onChange={handleRadioChange}
                          >
                            <FormControlLabel
                              value="Invoice"
                              control={<Radio />}
                              label="Invoice"
                            />
                            <FormControlLabel
                              value="Job"
                              control={<Radio />}
                              label="Job"
                            />
                          </RadioGroup>
                        </DialogContent>
                        <DialogActions>
                          <Button
                            autoFocus
                            color="primary"
                            onClick={() =>
                              setModal({
                                modal: false,
                                text: "",
                              })
                            }
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => {
                              convertQuotation === "Invoice"
                                ? history.push({
                                    pathname: "/admin/create-invoice",
                                    state: { data: convertData },
                                  })
                                : history.push({
                                    pathname: "/admin/create-job",
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
                </Dialog>
              </>
            )}
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
