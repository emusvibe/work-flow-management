import { createContext } from "react";

const defaultContext = {
  editInvoiceStatus: false,
  setEditInvoice: () => {},
};

const InvoiceContext = createContext(defaultContext);

export default InvoiceContext;
