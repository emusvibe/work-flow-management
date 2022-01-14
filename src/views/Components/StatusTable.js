import React, { useState, useEffect} from "react";
import MaterialTable from "material-table";
import { API_URL } from "utils/constants/index.js";
import axios from "axios";
import { HexColorPicker } from "react-colorful";

export const StatusTable = (props) => {
  const [statusData, setStatusData] = useState();
  const [openFailureSnackbar, setFailureSnackbar] = useState(false);
  const [openSuccessSnackbar, setSuccessSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [failMessage, setFailMessage] = useState("");
  const [statusColor, setStatusColor] = useState()
  const statusColumn = [
    {
      title: "Status",
      field: "name",
      render: (rowData) => rowData?.name?.toUpperCase(),
    },
    {
      title: "Status Color",
      field: "statusColor",
      render: (rowData) => (
        <HexColorPicker 
          color={rowData?.statusColor} 
          onChange={setStatusColor} 
          style={{height: "20px"}}
        />
      ),
      editComponent: (tableData) => (
        <HexColorPicker 
          color={tableData?.rowData?.statusColor} 
          onChange={tableData?.rowData?.statusColor}
          style={{height: "20px"}}
        />
      )
    }
  ];
  useEffect(() => {
    axios
      .get(
        `${API_URL}jobs-service/Jobs/GetJobStatusesByClient?clientId=${props.clientId}`,
        props.config
      )
      .then((response) => {
        setStatusData(response?.data?.data?.reverse());
      })
      .catch((error) => {});
  }, [])
  
  return (
    <>
      <MaterialTable
        title=""
        columns={statusColumn}
        data={statusData}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                newData["clientId"] = props.clientId;
                setStatusData([newData, ...statusData]);
                axios
                  .post(
                    `${API_URL}jobs-service/Jobs/CreateJobStatus`,
                    newData,
                    props.config
                  )
                  .then((response) => {
                    if (response.data.statusCode === 200) {
                      setSuccessMessage("Status Successfully added");
                      setSuccessSnackbar(true);
                      setStatusData([
                        response?.data?.data,
                        ...statusData
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
                      "Could not set status, please check that you filled the field"
                    );
                    setFailureSnackbar(true);
                    setTimeout(() => setFailureSnackbar(false), 3000);
                  })
                resolve();
              }, 1000);
            }),
          onRowUpdate: (newData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                axios
                  .put(
                    `${API_URL}jobs-service/Jobs/UpdateJobStatus`,
                    newData,
                    props.config
                  )
                  .then((response) => {
                    if(response.data.statusCode === 200) {
                      setSuccessMessage("Job status successfully updated");
                      setSuccessSnackbar(true);
                      axios
                        .get(
                          `${API_URL}jobs-service/Jobs/GetJobStatusesByClient?clientId=${props.clientId}`,
                          props.config
                        )
                        .then((response) => {
                          setStatusData(response?.data?.data?.reverse());
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
                        "Could not update status, please check that you filled the field"
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