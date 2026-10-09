import { createSlice } from "@reduxjs/toolkit";

const supplierSlice = createSlice({
  name: "suppliers",
  initialState: { suppliers: [], isLoading: false, error: null },
  reducers: {
    setSuppliersLoading(state) { state.isLoading = true; state.error = null; },
    setSuppliers(state, action) { state.isLoading = false; state.suppliers = action.payload; },
    setSuppliersError(state, action) { state.isLoading = false; state.error = action.payload; },
    addSupplier(state, action) { state.suppliers.unshift(action.payload); },
    updateSupplierInList(state, action) {
      const index = state.suppliers.findIndex((s) => s._id === action.payload._id);
      if (index !== -1) state.suppliers[index] = action.payload;
    },
    deleteSupplierFromList(state, action) {
      state.suppliers = state.suppliers.filter((s) => s._id !== action.payload);
    },
  },
});

export const { setSuppliersLoading, setSuppliers, setSuppliersError, addSupplier, updateSupplierInList, deleteSupplierFromList } = supplierSlice.actions;
export default supplierSlice.reducer;