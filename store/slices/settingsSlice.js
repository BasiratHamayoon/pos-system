import { createSlice } from "@reduxjs/toolkit";
import { dummyUser } from "@/lib/dummyData";

const initialState = {
  storeInfo: {
    name: dummyUser.storeName,
    address: dummyUser.storeAddress,
    phone: dummyUser.storePhone,
    email: dummyUser.email,
    currency: "PKR",
    taxRate: 0,
  },
  receiptSettings: {
    showLogo: true,
    headerText: "Thank you for your business!",
    footerText: "Goods once sold will not be returned",
    showPhone: true,
    showAddress: true,
  },
  notificationSettings: {
    lowStockAlert: true,
    outOfStockAlert: true,
    creditOverdueAlert: true,
    dailyReport: false,
  },
  isLoading: false,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateStoreInfo(state, action) {
      state.storeInfo = { ...state.storeInfo, ...action.payload };
    },
    updateReceiptSettings(state, action) {
      state.receiptSettings = { ...state.receiptSettings, ...action.payload };
    },
    updateNotificationSettings(state, action) {
      state.notificationSettings = { ...state.notificationSettings, ...action.payload };
    },
    setSettingsLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export const {
  updateStoreInfo,
  updateReceiptSettings,
  updateNotificationSettings,
  setSettingsLoading,
} = settingsSlice.actions;
export default settingsSlice.reducer;