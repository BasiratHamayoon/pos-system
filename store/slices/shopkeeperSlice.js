import { createSlice } from "@reduxjs/toolkit";
import { dummyShopkeepers } from "@/lib/dummyData";

const initialState = {
  shopkeepers: dummyShopkeepers,
  selectedShopkeeper: null,
  isLoading: false,
  error: null,
  searchTerm: "",
  filterStatus: "all",
  currentPage: 1,
};

const shopkeeperSlice = createSlice({
  name: "shopkeepers",
  initialState,
  reducers: {
    setShopkeepers(state, action) {
      state.shopkeepers = action.payload;
    },
    addShopkeeper(state, action) {
      state.shopkeepers.unshift(action.payload);
    },
    updateShopkeeper(state, action) {
      const index = state.shopkeepers.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.shopkeepers[index] = action.payload;
      }
    },
    deleteShopkeeper(state, action) {
      state.shopkeepers = state.shopkeepers.filter((s) => s.id !== action.payload);
    },
    setSelectedShopkeeper(state, action) {
      state.selectedShopkeeper = action.payload;
    },
    setShopkeeperSearchTerm(state, action) {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setShopkeeperFilterStatus(state, action) {
      state.filterStatus = action.payload;
      state.currentPage = 1;
    },
    setShopkeeperCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
  },
});

export const {
  setShopkeepers,
  addShopkeeper,
  updateShopkeeper,
  deleteShopkeeper,
  setSelectedShopkeeper,
  setShopkeeperSearchTerm,
  setShopkeeperFilterStatus,
  setShopkeeperCurrentPage,
} = shopkeeperSlice.actions;
export default shopkeeperSlice.reducer;