import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  brands: [],
  isLoading: false,
  error: null,
};

const brandSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {
    setBrandsLoading(state) {
      state.isLoading = true;
      state.error = null;
    },
    setBrands(state, action) {
      state.isLoading = false;
      state.brands = action.payload;
    },
    setBrandsError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    addBrand(state, action) {
      state.brands.unshift(action.payload);
    },
    updateBrandInList(state, action) {
      const index = state.brands.findIndex((b) => b._id === action.payload._id);
      if (index !== -1) state.brands[index] = action.payload;
    },
    deleteBrandFromList(state, action) {
      state.brands = state.brands.filter((b) => b._id !== action.payload);
    },
  },
});

export const {
  setBrandsLoading,
  setBrands,
  setBrandsError,
  addBrand,
  updateBrandInList,
  deleteBrandFromList,
} = brandSlice.actions;

export default brandSlice.reducer;