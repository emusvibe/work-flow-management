import React, { useState } from "react";

// @material-ui/core components
import { makeStyles, useTheme } from "@material-ui/core/styles";
// @material-ui/icons
import Assignment from "@material-ui/icons/Assignment";
// core components
import GridContainer from "../../../components/Grid/GridContainer.js";
import GridItem from "../../../components/Grid/GridItem.js";
import Card from "../../../components/Card/Card.js";
import CardBody from "../../../components/Card/CardBody.js";
import CardIcon from "../../../components/Card/CardIcon.js";
import CardHeader from "../../../components/Card/CardHeader.js";
import { cardTitle } from "../../../assets/jss/material-dashboard-pro-react.js";
import { Paper } from "@material-ui/core";
import MaterialTable from "material-table";

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

export default function EquipmentTracking() {
  const classes = useStyles();
  const theme = useTheme();
  const [equipment, setEquipment] = useState([
    {equipment: "Rake", warehouse: "WARE785557", location: "Bloemfontein", date: "2021-03-19", status: false},
    {equipment: "Dril", warehouse: "WARE785557", location: "Bloemfontein", date: "2021-03-24", status: false},
    {equipment: "Pliers", warehouse: "WARE321565", location: "Pretoria", date: "2021-04-01", status: true},
    {equipment: "Laptop", warehouse: "WARE112551", location: "Cape Town", date: "2021-04-10", status: false},
    {equipment: "Car", warehouse: "WARE44383", location: "Durban", date: "2021-04-11", status: true},
  ]);
  const columns = 
  [
    { title: "Equipment", field: "equipment" },
    { title: "Warehouse", field: "warehouse" },
    { title: "Location", field: "location" },
    { title: "Date", field: "date" },
    { title: "Status", field: "status" },
    
  ];
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
            <Paper variant="outlined">
              <MaterialTable
                title=""
                columns={columns}
                data={equipment}
                actions={[
                  {
                    icon: "edit",
                    tooltip: "Change Status",
                    onClick: (event, rowData) => {
                      setEquipment([...equipment, {status: !rowData.status}]);
                    },
                  },
                ]}
                options={{
                  actionsColumnIndex: -1,
                }}
              />
            </Paper>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
