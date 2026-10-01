import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import categoryReducer from "./slices/categorySlice";
import salesReducer from "./slices/salesSlice";
import shopkeeperReducer from "./slices/shopkeeperSlice";
import creditReducer from "./slices/creditSlice";
import invoiceReducer from "./slices/invoiceSlice";
import alertReducer from "./slices/alertSlice";
import reportReducer from "./slices/reportSlice";
import settingsReducer from "./slices/settingsSlice";
import themeReducer from "./slices/themeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    categories: categoryReducer,
    sales: salesReducer,
    shopkeepers: shopkeeperReducer,
    credits: creditReducer,
    invoices: invoiceReducer,
    alerts: alertReducer,
    reports: reportReducer,
    settings: settingsReducer,
    theme: themeReducer,
  },
});