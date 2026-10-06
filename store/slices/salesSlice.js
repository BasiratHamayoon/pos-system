import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sales: [],
  cart: [],
  cartShopkeeper: null,
  isLoading: false,
  error: null,
};

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    setSalesLoading(state) {
      state.isLoading = true;
    },
    setSales(state, action) {
      state.isLoading = false;
      state.sales = action.payload;
    },
    setSalesError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    addSaleToList(state, action) {
      state.sales.unshift(action.payload);
    },
    addToCart(state, action) {
      const existing = state.cart.find((i) => i._id === action.payload._id);
      if (existing) {
        existing.qty += 1;
        existing.total = existing.qty * existing.price;
      } else {
        state.cart.push({ ...action.payload, qty: 1, total: action.payload.price });
      }
    },
    updateCartQty(state, action) {
      const item = state.cart.find((i) => i._id === action.payload.id);
      if (item) {
        item.qty = action.payload.qty;
        item.total = item.qty * item.price;
      }
    },
    removeFromCart(state, action) {
      state.cart = state.cart.filter((i) => i._id !== action.payload);
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
  setSalesLoading,
  setSales,
  setSalesError,
  addSaleToList,
  addToCart,
  updateCartQty,
  removeFromCart,
  clearCart,
  setCartShopkeeper,
} = salesSlice.actions;

export default salesSlice.reducer;