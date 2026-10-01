import { createSlice } from "@reduxjs/toolkit";
import { dummyCategories } from "@/lib/dummyData";

const initialState = {
  categories: dummyCategories,
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
    setCategories(state, action) {
      state.categories = action.payload;
    },
    addCategory(state, action) {
      state.categories.unshift(action.payload);
    },
    updateCategory(state, action) {
      const index = state.categories.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    deleteCategory(state, action) {
      state.categories = state.categories.filter((c) => c.id !== action.payload);
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
  setCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  setSelectedCategory,
  setCategorySearchTerm,
  setCategoryCurrentPage,
} = categorySlice.actions;
export default categorySlice.reducer;