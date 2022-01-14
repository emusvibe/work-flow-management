import React from "react";
import { Button, Paper } from "@material-ui/core";
import { BuilderComponent } from "@builder.io/react";
import { useHistory } from "react-router-dom";

export default function ViewInvoice() {
  const history = useHistory();
  const state = history.location.state || {};
  
  return (
    <Paper style={{ padding: 24 }}>
      <Button
        style={{ marginBottom: "16px" }}
        color="primary"
        variant="outlined"
        onClick={() => history.push("/admin/invoices")}
      >
        Go Back
      </Button>
      <BuilderComponent
        data={{
          data: state && state.data,
        }}
        name="page"
        entry="73701a63a373440d8cd0127683fd559d"
      />
    </Paper>
  );
}
