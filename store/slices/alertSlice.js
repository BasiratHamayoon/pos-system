import { createSlice } from "@reduxjs/toolkit";
import { dummyAlerts } from "@/lib/dummyData";

const initialState = {
  alerts: dummyAlerts,
  isLoading: false,
  error: null,
  filterType: "all",
  filterSeverity: "all",
  currentPage: 1,
};

const alertSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    setAlerts(state, action) {
      state.alerts = action.payload;
    },
    markAsRead(state, action) {
      const alert = state.alerts.find((a) => a.id === action.payload);
      if (alert) {
        alert.isRead = true;
      }
    },
    markAllAsRead(state) {
      state.alerts.forEach((a) => {
        a.isRead = true;
      });
    },
    dismissAlert(state, action) {
      state.alerts = state.alerts.filter((a) => a.id !== action.payload);
    },
    setAlertFilterType(state, action) {
      state.filterType = action.payload;
      state.currentPage = 1;
    },
    setAlertFilterSeverity(state, action) {
      state.filterSeverity = action.payload;
      state.currentPage = 1;
    },
    setAlertCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
  },
});

export const {
  setAlerts,
  markAsRead,
  markAllAsRead,
  dismissAlert,
  setAlertFilterType,
  setAlertFilterSeverity,
  setAlertCurrentPage,
} = alertSlice.actions;
export default alertSlice.reducer;