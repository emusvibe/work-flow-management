import React from "react";
// @material-ui/core components
// @material-ui/icons
// core components
import { Button, Paper } from "@material-ui/core";
import { BuilderComponent } from "@builder.io/react";
import { useHistory } from "react-router-dom";

export default function ViewQuotation() {
  const history = useHistory();
  const state = history.location.state || {};
  return (
    state?.data === undefined ? <h4>Please select a quotation</h4> :
    <Paper style={{ padding: 24 }}>
      <Button
        style={{ marginBottom: "16px" }}
        color="primary"
        variant="outlined"
        onClick={() => history.push("/admin/quotations")}
      >
        Go Back
      </Button>
      <BuilderComponent
        data={{
          data: state && state.data,
        }}
        name="page"
        entry="d35f4043a8e947be92c199374304d9ee"
      />
    </Paper>
  );
}
