import { createSlice } from "@reduxjs/toolkit";
import { dummySales } from "@/lib/dummyData";

const initialState = {
  sales: dummySales,
  selectedSale: null,
  isLoading: false,
  error: null,
  searchTerm: "",
  filterStatus: "all",
  filterPayment: "all",
  currentPage: 1,
  cart: [],
  cartShopkeeper: null,
};

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    setSales(state, action) {
      state.sales = action.payload;
    },
    addSale(state, action) {
      state.sales.unshift(action.payload);
    },
    setSelectedSale(state, action) {
      state.selectedSale = action.payload;
    },
    setSalesSearchTerm(state, action) {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setSalesFilterStatus(state, action) {
      state.filterStatus = action.payload;
      state.currentPage = 1;
    },
    setSalesFilterPayment(state, action) {
      state.filterPayment = action.payload;
      state.currentPage = 1;
    },
    setSalesCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    addToCart(state, action) {
      const existing = state.cart.find((item) => item.id === action.payload.id);
      if (existing) {
        existing.qty += 1;
        existing.total = existing.qty * existing.price;
      } else {
        state.cart.push({ ...action.payload, qty: 1, total: action.payload.price });
      }
    },
    removeFromCart(state, action) {
      state.cart = state.cart.filter((item) => item.id !== action.payload);
    },
    updateCartQty(state, action) {
      const item = state.cart.find((item) => item.id === action.payload.id);
      if (item) {
        item.qty = action.payload.qty;
        item.total = item.qty * item.price;
      }
    },
    clearCart(state) {
      state.cart = [];
      state.cartShopkeeper = null;
    },
    setCartShopkeeper(state, action) {
      state.cartShopkeeper = action.payload;
    },
  },
});

export const {
  setSales,
  addSale,
  setSelectedSale,
  setSalesSearchTerm,
  setSalesFilterStatus,
  setSalesFilterPayment,
  setSalesCurrentPage,
  addToCart,
  removeFromCart,
  updateCartQty,
  clearCart,
  setCartShopkeeper,
} = salesSlice.actions;
export default salesSlice.reducer;