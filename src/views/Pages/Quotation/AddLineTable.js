import { Button, Paper, Typography } from "@material-ui/core";
import CustomInput from "components/CustomInput/CustomInput";
import React, { useState } from "react";
export const AddLineTable = () => {
  const [state, setState] = useState({
    rows: [{}],
  });
  const [total, setTotal] = useState(0);
  const handleChange = (idx) => (e) => {
    const { name, value } = e.target;
    const rows = [state.rows];
    rows[idx] = {
      [name]: value,
    };
    setState({
      rows,
    });
  };
  const handleAddRow = () => {
    const item = {
      item: "",
      description: "",
      quantity: 0,
      price: 0,
      tax: "",
      amount: 0,
    };
    setState({
      rows: [...state.rows, item],
    });
  };
  const handleRemoveRow = () => {
    setState({
      rows: state.rows.slice(0, -1),
    });
  };
  const handleRemoveSpecificRow = (idx) => () => {
    const rows = [state.rows];
    rows.splice(idx, 1);
    setState({ rows });
  };
  // const getTotal = (rows) => () => {
  //   return rows;
  // };
  return (
    <Paper style={{ padding: 16 }}>
      {state.rows.map((item, index) => {
        return (
          <div className="container" key={index}>
            <div className="row clearfix">
              <div className="col-md-12 column">
                <table
                  className="table table-bordered table-hover"
                  id="tab_logic"
                >
                  <thead>
                    <tr>
                      <th className="text-center"> </th>
                      <th className="text-center"> Item </th>
                      <th className="text-center"> Description </th>
                      <th className="text-center"> Quantity </th>
                      <th className="text-center"> Price </th>
                      <th className="text-center"> Tax </th>
                      <th className="text-center"> Amount </th>
                      <th className="text-center"> </th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.rows.map((item, idx) => (
                      <tr id="addr0" key={idx}>
                        <td>{idx}</td>
                        <td>
                          <CustomInput
                            labelText=""
                            id="item"
                            formControlProps={{
                              fullWidth: false,
                            }}
                            value={state.rows[idx].item}
                            inputProps={{
                              onChange: (e) => {
                                handleChange(idx);
                              },
                            }}
                          />
                        </td>
                        <td>
                          <CustomInput
                            labelText=""
                            id="description"
                            formControlProps={{
                              fullWidth: false,
                            }}
                            type="text"
                            value={state.rows[idx].description}
                            inputProps={{
                              onChange: (e) => {
                                handleChange(idx);
                              },
                            }}
                          />
                        </td>
                        <td>
                          <CustomInput
                            labelText=""
                            id="description"
                            formControlProps={{
                              fullWidth: false,
                            }}
                            type="number"
                            value={state.rows[idx].quantity}
                            inputProps={{
                              onChange: (e) => {
                                handleChange(idx);
                              },
                            }}
                          />
                        </td>
                        <td>
                          <CustomInput
                            labelText=""
                            id="price"
                            formControlProps={{
                              fullWidth: false,
                            }}
                            type="number"
                            value={state.rows[idx].price}
                            inputProps={{
                              onChange: (e) => {
                                handleChange(idx);
                              },
                            }}
                          />
                        </td>
                        <td>
                          <CustomInput
                            labelText=""
                            id="tax"
                            formControlProps={{
                              fullWidth: false,
                            }}
                            type="text"
                            value={state.rows[idx].tax}
                            inputProps={{
                              onChange: (e) => {
                                handleChange(idx);
                              },
                            }}
                          />
                        </td>
                        <td>
                          <CustomInput
                            labelText=""
                            id="tax"
                            formControlProps={{
                              fullWidth: false,
                            }}
                            type="number"
                            value={state.rows[idx].amount}
                            inputProps={{
                              onChange: (e) => {
                                handleChange(idx);
                              },
                            }}
                          />
                        </td>
                        <td>
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleRemoveSpecificRow(idx)}
                            className="btn btn-outline-danger btn-sm"
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div
                  style={{
                    textAlign: "end",
                    paddingRight: 94,
                  }}
                >
                  <Typography variant="p" align="right">
                    Subtotal: R{total}
                  </Typography>
                  <p>Total (ZAR): R{total}</p>
                </div>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleAddRow}
                  style={{ marginRight: 16 }}
                  className="btn btn-primary"
                >
                  Add Line
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleRemoveRow}
                  className="btn btn-danger float-right"
                >
                  Delete Last Line
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </Paper>
  );
};
