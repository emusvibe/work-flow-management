import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import axios from "axios";
import { API_URL } from "utils/constants/index.js";

export const SystemTable = (props) => {
  const [data, setData] = useState([]);
  const [openFailureSnackbar, setFailureSnackbar] = useState(false);
  const [openSuccessSnackbar, setSuccessSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [failMessage, setFailMessage] = useState("");
  
  const columns = [
    { title: "System Email", field: "systemEmail" },
    {
      title: "Quotation Tax (%)",
      field: "quotationTax",
      type: "numeric",
      render: (rowData) => rowData.quotationTax * 100,
    },
    {
      title: "Terms and Conditions",
      field: "termsAndConditions",
    },
  ];
  useEffect(() => {
    axios
      .get(
        `${API_URL}accounts-service/Account/GetSystemConfig?clientId=${props.clientId}`,
        props.config
      )
      .then((response) => {
        setData([response?.data?.data]);
      })
      .catch((error) => {});
  }, [])
  return (
    <>
      <MaterialTable
        title=""
        columns={columns}
        data={data}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataUpdate = [...data];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                axios
                  .put(
                    `${API_URL}accounts-service/Account/UpdateSystemConfig`,
                    newData,
                    props.config
                  )
                  .then((response) => {
                    if (response.data.statusCode === 200) {
                      setSuccessMessage(
                        "System configs successfully updated"
                      );
                      setSuccessSnackbar(true);
                      setData([newData]);
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
                      "Could not set quotation tax, please check that you filled all fields"
                    );
                    setFailureSnackbar(true);
                    setTimeout(() => setFailureSnackbar(false), 3000);
                  })
                  .catch((error) => {});
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