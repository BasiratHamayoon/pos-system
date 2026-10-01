import { createSlice } from "@reduxjs/toolkit";
import { dummyCredits } from "@/lib/dummyData";

const initialState = {
  credits: dummyCredits,
  selectedCredit: null,
  isLoading: false,
  error: null,
  searchTerm: "",
  filterStatus: "all",
  currentPage: 1,
};

const creditSlice = createSlice({
  name: "credits",
  initialState,
  reducers: {
    setCredits(state, action) {
      state.credits = action.payload;
    },
    updateCredit(state, action) {
      const index = state.credits.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.credits[index] = action.payload;
      }
    },
    setSelectedCredit(state, action) {
      state.selectedCredit = action.payload;
    },
    setCreditSearchTerm(state, action) {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setCreditFilterStatus(state, action) {
      state.filterStatus = action.payload;
      state.currentPage = 1;
    },
    setCreditCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
  },
});

export const {
  setCredits,
  updateCredit,
  setSelectedCredit,
  setCreditSearchTerm,
  setCreditFilterStatus,
  setCreditCurrentPage,
} = creditSlice.actions;
export default creditSlice.reducer;