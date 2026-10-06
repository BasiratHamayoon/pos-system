import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
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
    setProductsLoading(state) {
      state.isLoading = true;
      state.error = null;
    },
    setProducts(state, action) {
      state.isLoading = false;
      state.products = action.payload;
    },
    setProductsError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    addProduct(state, action) {
      state.products.unshift(action.payload);
    },
    updateProductInList(state, action) {
      const index = state.products.findIndex((p) => p._id === action.payload._id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProductFromList(state, action) {
      state.products = state.products.filter((p) => p._id !== action.payload);
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
  },
});

export const {
  setProductsLoading,
  setProducts,
  setProductsError,
  addProduct,
  updateProductInList,
  deleteProductFromList,
  setSelectedProduct,
  setSearchTerm,
  setFilterCategory,
  setFilterStatus,
  setCurrentPage,
} = productSlice.actions;

export default productSlice.reducer;