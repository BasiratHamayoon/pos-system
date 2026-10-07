import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reports: [],
  isLoading: false,
  error: null,
};

const reportSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    setReportsLoading(state) {
      state.isLoading = true;
      state.error = null;
    },
    setReports(state, action) {
      state.isLoading = false;
      state.reports = action.payload;
    },
    setReportsError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    addReportToList(state, action) {
      state.reports.unshift(action.payload);
    },
    removeReportFromList(state, action) {
      state.reports = state.reports.filter((r) => r._id !== action.payload);
    },
  },
});

export const {
  setReportsLoading,
  setReports,
  setReportsError,
  addReportToList,
  removeReportFromList,
} = reportSlice.actions;

export default reportSlice.reducer;