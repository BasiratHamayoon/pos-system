import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  sidebarCollapsed: false,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setTheme(state, action) {
      state.mode = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed(state, action) {
      state.sidebarCollapsed = action.payload;
    },
  },
});

export const { toggleTheme, setTheme, toggleSidebar, setSidebarCollapsed } = themeSlice.actions;
export default themeSlice.reducer;