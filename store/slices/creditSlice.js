import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  credits: [],
  isLoading: false,
  error: null,
};

const creditSlice = createSlice({
  name: "credits",
  initialState,
  reducers: {
    setCreditsLoading(state) {
      state.isLoading = true;
      state.error = null;
    },
    setCredits(state, action) {
      state.isLoading = false;
      state.credits = action.payload;
    },
    setCreditsError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateCreditInList(state, action) {
      const index = state.credits.findIndex((c) => c._id === action.payload._id);
      if (index !== -1) {
        state.credits[index] = action.payload;
      }
    },
  },
});

export const { setCreditsLoading, setCredits, setCreditsError, updateCreditInList } = creditSlice.actions;

export default creditSlice.reducer;