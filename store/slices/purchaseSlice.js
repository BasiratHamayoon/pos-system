import { createSlice } from "@reduxjs/toolkit";

const purchaseSlice = createSlice({
  name: "purchases",
  initialState: { purchases: [], isLoading: false, error: null },
  reducers: {
    setPurchasesLoading(state) { state.isLoading = true; },
    setPurchases(state, action) { state.isLoading = false; state.purchases = action.payload; },
    setPurchasesError(state, action) { state.isLoading = false; state.error = action.payload; },
    addPurchaseToList(state, action) { state.purchases.unshift(action.payload); },
  },
});

export const { setPurchasesLoading, setPurchases, setPurchasesError, addPurchaseToList } = purchaseSlice.actions;
export default purchaseSlice.reducer;