import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {
    totalRevenue: 0,
    totalCost: 0,
    totalExpenses: 0,
    totalNetProfit: 0,
    monthlyData: [],
    categoryProfitData: [],
  },
  isLoading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    setAnalyticsLoading(state) {
      state.isLoading = true;
      state.error = null;
    },
    setAnalyticsData(state, action) {
      state.isLoading = false;
      state.data = action.payload;
    },
    setAnalyticsError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { setAnalyticsLoading, setAnalyticsData, setAnalyticsError } = analyticsSlice.actions;

export default analyticsSlice.reducer;