import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  invoices: [],
  selectedInvoice: null,
  isLoading: false,
  error: null,
};

const invoiceSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    setInvoicesLoading(state) {
      state.isLoading = true;
      state.error = null;
    },
    setInvoices(state, action) {
      state.isLoading = false;
      state.invoices = action.payload;
    },
    setInvoicesError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    setSelectedInvoice(state, action) {
      state.selectedInvoice = action.payload;
    },
  },
});

export const {
  setInvoicesLoading,
  setInvoices,
  setInvoicesError,
  setSelectedInvoice,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;