import { loginStart, loginSuccess, loginFailure } from "../slices/authSlice";
import { dummyUser } from "@/lib/dummyData";

export const loginUser = (credentials) => (dispatch) => {
  dispatch(loginStart());
  setTimeout(() => {
    if (credentials.email === "admin@storepos.com" && credentials.password === "admin123") {
      dispatch(loginSuccess(dummyUser));
    } else {
      dispatch(loginFailure("Invalid email or password"));
    }
  }, 1000);
};