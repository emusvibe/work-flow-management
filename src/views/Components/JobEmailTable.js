import React, { useState, useEffect} from "react";
import MaterialTable from "material-table";
import { API_URL } from "utils/constants/index.js";
import axios from "axios";

export const JobEmailTable = (props) => {
  const [tableData, setTableData] = useState([])
  const jobEmailColumn = [
    {
      title: "Trigger",
      field: "configName"
    },
    {
      title: "Email Address",
      field: "emailAddress" 
    },
    {
      title: "Active",
      type: "boolean",
      field: "isActive",
      render: (rowData) => (
        rowData.isActive ? "Active" : "Inactive"
      )
    },
  ];
  const [openFailureSnackbar, setFailureSnackbar] = useState(false);
  const [openSuccessSnackbar, setSuccessSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [failMessage, setFailMessage] = useState("");
  const emailTableData = () => {
    axios
      .get(
        `${API_URL}jobs-service/JobConfigs/GetAllConfigs?clientId=${props.clientId}`,
        props.config
      )
      .then((response) => setTableData(response?.data?.data))
  }
  useEffect(() => {
    emailTableData();
  }, [])
  return(
    <>
      <MaterialTable
        title=""
        columns={jobEmailColumn}
        data={tableData}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                newData["clientId"] = props.clientId;
                switch (newData.configName) {
                  case "onCreate":
                    newData["configName"] = 0;
                    break;
                  case "onUpdate":
                    newData["configName"] = 1;
                    break;
                  case "onStared":
                    newData["configName"] = 2;
                    break;
                  case "onDeleted":
                    newData["configName"] = 3;
                    break;
                  default:
                    newData["configName"] = 4;
                }
                {newData?.isActive === "true" 
                  ? newData["isActive"] = true 
                  : newData["isActive"] = false
                }
                axios
                  .put(
                    `${API_URL}jobs-service/JobConfigs/UpdateEmailConfig`,
                    [newData],
                    props.config
                  )
                  .then((response) => {
                    if(response.data.statusCode === 200) {
                      setSuccessMessage("Job config successfully updated");
                      setSuccessSnackbar(true);
                      emailTableData();
                    }
                    
                    })
                  .catch((error) => {
                    setFailMessage(
                      "Could not create job config, please check that you filled the field"
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