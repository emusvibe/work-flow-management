import React, { useState, useEffect} from "react";
import MaterialTable from "material-table";
import { API_URL } from "utils/constants/index.js";
import axios from "axios";

export const PaymentTable = (props) => {
  const [paymentData, setPaymentData] = useState();
  const paymentColumn = [{ 
    title: "Payment Type", 
    field: "name",
    render: (rowData) => rowData?.name?.toUpperCase(),
   }
  ];
  const [openFailureSnackbar, setFailureSnackbar] = useState(false);
  const [openSuccessSnackbar, setSuccessSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [failMessage, setFailMessage] = useState("");
  
  useEffect(() => {
    axios
      .get(
        `${API_URL}jobs-service/Jobs/GetPaymentTypesByClient?clientId=${props.clientId}`,
        props.config
      )
      .then((response) => {
        setPaymentData(response?.data?.data?.reverse());
      })
      .catch((error) => {});
  }, [])
  return(
    <>
      <MaterialTable
        title=""
        columns={paymentColumn}
        data={paymentData}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                newData["clientId"] = props.clientId;
                setPaymentData([...paymentData, newData]);
                axios
                  .post(
                    `${API_URL}jobs-service/Jobs/CreatePaymentType`,
                    newData,
                    props.config
                  )
                  .then((response) => {
                    if (response.data.statusCode === 200) {
                      setSuccessMessage("Status Successfully added");
                      setSuccessSnackbar(true);
                      setPaymentData([
                        response?.data?.data,
                        ...paymentData
                      ]);
                      setTimeout(
                        () => setSuccessSnackbar(false),
                        5000
                      );
                    } else {
                      setFailureSnackbar(true);
                    }
                  })
                  .catch((error) => {
                    setFailMessage(
                      "Could not create payment, please check that you filled the field"
                    );
                    setFailureSnackbar(true);
                    setTimeout(() => setFailureSnackbar(false), 3000);
                  })
                  .catch((error) => {});
                resolve();
              }, 1000);
            }),
            onRowUpdate: (newData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  axios
                    .put(
                      `${API_URL}jobs-service/Jobs/UpdatePaymentType`,
                      newData,
                      props.config
                    )
                    .then((response) => {
                      if(response.data.statusCode === 200) {
                        setSuccessMessage("Job type successfully updated");
                        setSuccessSnackbar(true);
                        axios
                          .get(
                            `${API_URL}jobs-service/Jobs/GetPaymentTypesByClient?clientId=${props.clientId}`,
                            props.config
                          )
                          .then((response) => {
                            setPaymentData(response?.data?.data?.reverse());
                          })
                          .catch((error) => {});
                        setTimeout(
                          () => setSuccessSnackbar(false),
                          5000
                        );
                      }
                      })
                      .catch((error) => {
                        setFailMessage(
                          "Could not update payment type, please check that you filled the field"
                        );
                        setFailureSnackbar(true);
                        setTimeout(() => setFailureSnackbar(false), 3000);
                      })
                    resolve();
                }, 1000);
              }),
        }}
        options={{
          actionsColumnIndex: -1,
        }}
      />
    </>
  )
}