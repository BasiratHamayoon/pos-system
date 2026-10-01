import { markAsRead, markAllAsRead, dismissAlert } from "../slices/alertSlice";

export const readAlert = (alertId) => (dispatch) => {
  dispatch(markAsRead(alertId));
};

export const readAllAlerts = () => (dispatch) => {
  dispatch(markAllAsRead());
};

export const removeAlert = (alertId) => (dispatch) => {
  dispatch(dismissAlert(alertId));
};