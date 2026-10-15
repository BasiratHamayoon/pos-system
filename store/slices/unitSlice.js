import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  units: [],
  isLoading: false,
  error: null,
};

const unitSlice = createSlice({
  name: "units",
  initialState,
  reducers: {
    setUnitsLoading(state) {
      state.isLoading = true;
      state.error = null;
    },
    setUnits(state, action) {
      state.isLoading = false;
      state.units = action.payload;
    },
    setUnitsError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    addUnit(state, action) {
      state.units.unshift(action.payload);
    },
    updateUnitInList(state, action) {
      const index = state.units.findIndex((u) => u._id === action.payload._id);
      if (index !== -1) state.units[index] = action.payload;
    },
    deleteUnitFromList(state, action) {
      state.units = state.units.filter((u) => u._id !== action.payload);
    },
  },
});

export const {
  setUnitsLoading,
  setUnits,
  setUnitsError,
  addUnit,
  updateUnitInList,
  deleteUnitFromList,
} = unitSlice.actions;

export default unitSlice.reducer;