import { updateStoreInfo, updateReceiptSettings, updateNotificationSettings } from "../slices/settingsSlice";

export const saveStoreInfo = (data) => (dispatch) => {
  dispatch(updateStoreInfo(data));
};

export const saveReceiptSettings = (data) => (dispatch) => {
  dispatch(updateReceiptSettings(data));
};

export const saveNotificationSettings = (data) => (dispatch) => {
  dispatch(updateNotificationSettings(data));
};