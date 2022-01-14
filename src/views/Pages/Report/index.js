import React, { useEffect, useState } from "react";

// @material-ui/core components
import { makeStyles, useTheme } from "@material-ui/core/styles";
// @material-ui/icons
import Assignment from "@material-ui/icons/Assignment";
import GetAppIcon from '@material-ui/icons/GetApp';
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
import axios from "axios";

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "8px",
    marginBottom: "0px",
  },
};

const useStyles = makeStyles(styles);

export default function Report() {
  const [data, setData] = useState([]);

  const classes = useStyles();
  const theme = useTheme();
  useEffect(() => {
    const getUsernames = () => {
      axios
        .get("https://jsonplaceholder.typicode.com/photos")
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {

        })
    }
    getUsernames();
  }, [])

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
            >
              Report
            </Button>
          </CardHeader>
          <CardBody>
            <MaterialTable 
              title=""
              data={data}
              columns={[
                {
                  title: "Title",
                  field: "title",
                },
                {
                  title: "Date",
                  field: "date",
                },
                {
                  title: "File Type",
                  field: "fileType",
                },
              ]}
              actions={[
                {
                  icon: "visibility",
                  tooltip: "Go to link",
                  onClick: ((event, rowData) => {
                    window.location.href = rowData.url;
                  }),
                },
                {
                  icon: GetAppIcon,
                  tooltip: "Download",
                },
              ]}
              options={{
                filtering: true,
                actionsColumnIndex: -1,
              }} 
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}