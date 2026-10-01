import { createSlice } from "@reduxjs/toolkit";
import { dummyReports } from "@/lib/dummyData";

const initialState = {
  reports: dummyReports,
  selectedReport: null,
  isLoading: false,
  error: null,
  filterType: "all",
  currentPage: 1,
};

const reportSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    setReports(state, action) {
      state.reports = action.payload;
    },
    addReport(state, action) {
      state.reports.unshift(action.payload);
    },
    setSelectedReport(state, action) {
      state.selectedReport = action.payload;
    },
    setReportFilterType(state, action) {
      state.filterType = action.payload;
      state.currentPage = 1;
    },
    setReportCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
  },
});

export const {
  setReports,
  addReport,
  setSelectedReport,
  setReportFilterType,
  setReportCurrentPage,
} = reportSlice.actions;
export default reportSlice.reducer;