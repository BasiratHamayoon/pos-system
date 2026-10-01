import { createSlice } from "@reduxjs/toolkit";
import { dummyProducts } from "@/lib/dummyData";

const initialState = {
  products: dummyProducts,
  selectedProduct: null,
  isLoading: false,
  error: null,
  searchTerm: "",
  filterCategory: "all",
  filterStatus: "all",
  currentPage: 1,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts(state, action) {
      state.products = action.payload;
    },
    addProduct(state, action) {
      state.products.unshift(action.payload);
    },
    updateProduct(state, action) {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct(state, action) {
      state.products = state.products.filter((p) => p.id !== action.payload);
    },
    setSelectedProduct(state, action) {
      state.selectedProduct = action.payload;
    },
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setFilterCategory(state, action) {
      state.filterCategory = action.payload;
      state.currentPage = 1;
    },
    setFilterStatus(state, action) {
      state.filterStatus = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  setSelectedProduct,
  setSearchTerm,
  setFilterCategory,
  setFilterStatus,
  setCurrentPage,
  setLoading,
} = productSlice.actions;
export default productSlice.reducer;