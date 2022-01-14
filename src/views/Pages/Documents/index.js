import React, { useState } from "react";
// @material-ui/core components
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MaterialTable from "material-table";
// @material-ui/icons
import Assignment from "@material-ui/icons/Assignment";
import GetAppIcon from '@material-ui/icons/GetApp';
// core components
import GridContainer from "../../../components/Grid/GridContainer.js";
import Button from "../../../components/CustomButtons/Button.js";
import GridItem from "../../../components/Grid/GridItem.js";
import Card from "../../../components/Card/Card.js";
import CardBody from "../../../components/Card/CardBody.js";
import CardIcon from "../../../components/Card/CardIcon.js";
import CardHeader from "../../../components/Card/CardHeader.js";
import { cardTitle } from "../../../assets/jss/material-dashboard-pro-react.js";
import { Input } from "@material-ui/core";
const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
  inputButton: {
    display: "none",
  },
};
const useStyles = makeStyles(styles);

export default function Documents() {
  const classes = useStyles();
  const theme = useTheme();
  const [data, setData] = useState([]);
  const columns = [
    { title: "Name", field: "name" },
    { title: "Date", field: "lastModifiedDate", type: "date"},
  ];
  const [selectedFiles, setSelectedFiles] = useState([]);
  const handleChange = (event) => {
    setSelectedFiles([...selectedFiles, event.target.files[0]]);
    setData([...data, event.target.files[0]]);
  };

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="primary" icon>
            <CardIcon color="primary">
              <Assignment />
            </CardIcon>
            <label htmlFor="upload-file">
              <Input
                className={classes.inputButton}
                id="upload-file"
                name="upload-file"
                type="file"
                onChange={handleChange}
              />
              <Button
                style={{
                  float: "right",
                  marginRight: theme.spacing(1),
                  marginTop: -16,
                  marginBottom: theme.spacing(1),
                }}
                color="rose"
                variant="contained"
                component="span"
              >
                Upload file
              </Button>
            </label>
          </CardHeader>
          <CardBody>
            <MaterialTable 
              title=""
              data={data} 
              columns={columns} 
              actions={[
                {
                  icon: 'visibility',
                  tooltip: 'View Document',
                  onClick: (event, rowData) => alert("You saved " + rowData.name)
                },
                {
                  icon: GetAppIcon,
                  tooltip: 'Download Document',
                  onClick: (event, rowData) => alert("You saved " + rowData.name)
                },
                {
                  icon: 'publish',
                  tooltip: 'Upload Document',
                  onClick: (event, rowData) => alert("You saved " + rowData.name)
                }
              ]}
              options={{
                actionsColumnIndex: -1,
              }}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
