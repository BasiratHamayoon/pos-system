import { addInvoice } from "../slices/invoiceSlice";
import { generateId } from "@/lib/utils";

export const createInvoice = (invoiceData) => (dispatch) => {
  const invoice = {
    ...invoiceData,
    id: generateId(),
    date: new Date().toISOString(),
  };
  dispatch(addInvoice(invoice));
};