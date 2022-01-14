import React, { useState } from "react";

// @material-ui/core components
import { makeStyles, useTheme } from "@material-ui/core/styles";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
// @material-ui/icons
import Assignment from "@material-ui/icons/Assignment";
// core components
import GridContainer from "../../../components/Grid/GridContainer.js";
import Button from "../../../components/CustomButtons/Button.js";
import GridItem from "../../../components/Grid/GridItem.js";
import Card from "../../../components/Card/Card.js";
import CardBody from "../../../components/Card/CardBody.js";
import CardIcon from "../../../components/Card/CardIcon.js";
import CardHeader from "../../../components/Card/CardHeader.js";
import { cardTitle } from "../../../assets/jss/material-dashboard-pro-react.js";
import { Input, Paper, FormControlLabel } from "@material-ui/core";
import csvFile from "../../../assets/csv/MOCK_DATA.csv";

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "8px",
    marginBottom: "0px",
  },
  inputButton: {
    display: "none",
  },
};

const useStyles = makeStyles(styles);

export default function Importer() {
  const classes = useStyles();
  const theme = useTheme();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const handleChange = (event) => {
    if (!event.target.files[0]) {
      return;
    }
    setSelectedFiles([...selectedFiles, event.target.files[0]]);
  };
  const [importer, setImporter] = useState("Inventory");
  const handleRadioChange = (event) => {
    setImporter(event.target.value);
  };
  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="primary" icon>
            <CardIcon color="primary">
              <Assignment />
            </CardIcon>
          </CardHeader>
          <CardBody>
            <label htmlFor="upload-file">
              <Input
                className={classes.inputButton}
                id="upload-file"
                name="upload-file"
                type="file"
                accept=".csv,.xlsx,.xls"
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
            <Paper variant="outlined" style={{ padding: theme.spacing(2) }}>
              <h3>Bulk Importer</h3>
              <a href={csvFile} download>
                Example Customer Import (CSV)
              </a>
              <div></div>
              <a href={csvFile} download>
                Example Inventory Import (CSV)
              </a>
              {selectedFiles?.map((selectedFile) => (
                <h1 key={selectedFile?.name}>{selectedFile?.name}</h1>
              ))}
              <div style={{ display: "flex" }}>
                <RadioGroup
                  aria-label="Importer type"
                  name="import"
                  value={importer}
                  onChange={handleRadioChange}
                >
                  <FormControlLabel
                    value="Customer"
                    control={<Radio />}
                    label="Customer"
                  />
                  <FormControlLabel
                    value="Inventory"
                    control={<Radio />}
                    label="Inventory"
                  />
                </RadioGroup>
              </div>
            </Paper>
            <Button
              color="primary"
              variant="contained"
              disabled={selectedFiles.length === 0}
            >
              Import
            </Button>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
