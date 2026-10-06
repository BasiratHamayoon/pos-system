import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shopkeepers: [],
  isLoading: false,
  error: null,
};

const shopkeeperSlice = createSlice({
  name: "shopkeepers",
  initialState,
  reducers: {
    setShopkeepersLoading(state) {
      state.isLoading = true;
      state.error = null;
    },
    setShopkeepers(state, action) {
      state.isLoading = false;
      state.shopkeepers = action.payload;
    },
    setShopkeepersError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    addShopkeeper(state, action) {
      state.shopkeepers.unshift(action.payload);
    },
    updateShopkeeperInList(state, action) {
      const index = state.shopkeepers.findIndex((s) => s._id === action.payload._id);
      if (index !== -1) state.shopkeepers[index] = action.payload;
    },
    deleteShopkeeperFromList(state, action) {
      state.shopkeepers = state.shopkeepers.filter((s) => s._id !== action.payload);
    },
  },
});

export const {
  setShopkeepersLoading,
  setShopkeepers,
  setShopkeepersError,
  addShopkeeper,
  updateShopkeeperInList,
  deleteShopkeeperFromList,
} = shopkeeperSlice.actions;

export default shopkeeperSlice.reducer;