import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  variantTemplates: [],
  isLoading: false,
  error: null,
};

const variantTemplateSlice = createSlice({
  name: "variantTemplates",
  initialState,
  reducers: {
    setVariantTemplatesLoading(state) {
      state.isLoading = true;
      state.error = null;
    },
    setVariantTemplates(state, action) {
      state.isLoading = false;
      state.variantTemplates = action.payload;
    },
    setVariantTemplatesError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    addVariantTemplate(state, action) {
      state.variantTemplates.unshift(action.payload);
    },
    updateVariantTemplateInList(state, action) {
      const index = state.variantTemplates.findIndex((v) => v._id === action.payload._id);
      if (index !== -1) state.variantTemplates[index] = action.payload;
    },
    deleteVariantTemplateFromList(state, action) {
      state.variantTemplates = state.variantTemplates.filter((v) => v._id !== action.payload);
    },
  },
});

export const {
  setVariantTemplatesLoading,
  setVariantTemplates,
  setVariantTemplatesError,
  addVariantTemplate,
  updateVariantTemplateInList,
  deleteVariantTemplateFromList,
} = variantTemplateSlice.actions;

export default variantTemplateSlice.reducer;