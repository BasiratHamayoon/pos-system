import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  selectedCategory: null,
  isLoading: false,
  error: null,
  searchTerm: "",
  currentPage: 1,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategoriesLoading(state) {
      state.isLoading = true;
      state.error = null;
    },
    setCategories(state, action) {
      state.isLoading = false;
      state.categories = action.payload;
    },
    setCategoriesError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    addCategory(state, action) {
      state.categories.unshift(action.payload);
    },
    updateCategoryInList(state, action) {
      const index = state.categories.findIndex((c) => c._id === action.payload._id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    deleteCategoryFromList(state, action) {
      state.categories = state.categories.filter((c) => c._id !== action.payload);
    },
    setSelectedCategory(state, action) {
      state.selectedCategory = action.payload;
    },
    setCategorySearchTerm(state, action) {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setCategoryCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
  },
});

export const {
  setCategoriesLoading,
  setCategories,
  setCategoriesError,
  addCategory,
  updateCategoryInList,
  deleteCategoryFromList,
  setSelectedCategory,
  setCategorySearchTerm,
  setCategoryCurrentPage,
} = categorySlice.actions;

export default categorySlice.reducer;