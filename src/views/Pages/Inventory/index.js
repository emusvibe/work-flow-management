import React, { useState, useContext, useEffect } from "react";
// @material-ui/core components
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MaterialTable from "material-table";
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

export default function Inventory() {
  const { user } = useContext(AuthenticationContext);
  const token = localStorage.getItem(AUTH_TOKEN_NAME);
  const history = useHistory();
  const [category] = useState({
    parts: "Parts",
    test: "Test",
  });
  const [itemType] = useState({
    material: "Material",
    wood: "Wood",
  });
  const [data, setData] = useState([]);
  const config = {
    headers: {
      Authorization: user?.data?.token || token,
    },
  };
  
  const columns = 
  [
    { title: "Stock Code", field: "stockCode" },
    { title: "", field: "clientId", hidden: true },
    { title: "Catergory", field: "category", lookup: { ...category } },
    { title: "Description", field: "description" },
    { title: "Item Type", field: "itemType", lookup: { ...itemType } },
    { title: "Cost Price", field: "costPrice", type: "numeric" },
    { title: "Selling Price", field: "sellingPrice", type: "numeric" },
    { title: "Quantity On Hand", field: "totalQuantity", type: "numeric" },
  ];
  useEffect(() => {
    axios
      .get(
        `${API_URL}customer-service/Inventory/GetByClientId?clientId=${user?.data?.clientId}`,
        config
      )
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {});
  }, []);
  
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
            <MaterialTable
              title=""
              columns={columns}
              data={data.data}
              editable={{
                onRowAdd: (newData) =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      newData.clientId = user?.data?.clientId;
                      newData.inventoryId = "";
                      axios
                        .post(
                          `${API_URL}customer-service/Inventory/Create`,
                          [newData],
                          config
                        )
                        .then((response) => {
                          history.push("/admin/dashboard/");
                          history.push("/admin/inventory/");
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
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
