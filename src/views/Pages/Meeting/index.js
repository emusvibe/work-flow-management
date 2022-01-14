import React, { useState } from "react";

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
import { Paper } from "@material-ui/core";
import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import moment from "moment";

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

export default function Meeting() {
  const theme = useTheme();
  const groups = [
    { id: 1, title: "room 1" },
    { id: 2, title: "room 2" },
  ];
  const [items, setItems] = useState([
    {
      id: 1,
      group: 1,
      title: "item 1",
      start_time: moment(),
      end_time: moment().add(1, "hour"),
    },
    {
      id: 2,
      group: 2,
      title: "item 2",
      start_time: moment().add(-0.5, "hour"),
      end_time: moment().add(0.5, "hour"),
    },
    {
      id: 3,
      group: 1,
      title: "item 3",
      start_time: moment().add(2, "hour"),
      end_time: moment().add(3, "hour"),
    },
  ]);
  const handleClick = () => {
    setItems([
      ...items,
      {
        id: 4,
        group: 2,
        title: "item 4",
        start_time: moment().add(4, "hours"),
        end_time: moment().add(6, "hours"),
      },
    ]);
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
              onClick={handleClick}
            >
              Add meeting
            </Button>
            <Paper>
              <Timeline
                groups={groups}
                items={items}
                defaultTimeStart={moment().add(-12, "hour")}
                defaultTimeEnd={moment().add(12, "hour")}
              />
            </Paper>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
