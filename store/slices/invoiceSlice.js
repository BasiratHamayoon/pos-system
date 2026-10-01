import { createSlice } from "@reduxjs/toolkit";
import { dummyInvoices } from "@/lib/dummyData";

const initialState = {
  invoices: dummyInvoices,
  selectedInvoice: null,
  isLoading: false,
  error: null,
  searchTerm: "",
  filterStatus: "all",
  currentPage: 1,
};

const invoiceSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    setInvoices(state, action) {
      state.invoices = action.payload;
    },
    addInvoice(state, action) {
      state.invoices.unshift(action.payload);
    },
    setSelectedInvoice(state, action) {
      state.selectedInvoice = action.payload;
    },
    setInvoiceSearchTerm(state, action) {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setInvoiceFilterStatus(state, action) {
      state.filterStatus = action.payload;
      state.currentPage = 1;
    },
    setInvoiceCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
  },
});

export const {
  setInvoices,
  addInvoice,
  setSelectedInvoice,
  setInvoiceSearchTerm,
  setInvoiceFilterStatus,
  setInvoiceCurrentPage,
} = invoiceSlice.actions;
export default invoiceSlice.reducer;