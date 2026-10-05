import api from '@/lib/api';
import { loginStart, loginSuccess, loginFailure, logout as logoutAction } from '../slices/authSlice';

export const loginUser = (credentials) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const { data } = await api.post('/auth/login', credentials);
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
    }
    dispatch(loginSuccess(data));
  } catch (error) {
    dispatch(loginFailure(error.response?.data?.message || error.message));
  }
};

export const logoutUser = () => (dispatch) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  dispatch(logoutAction());
};

export const forgotPassword = async (email) => {
  const { data } = await api.post('/auth/forgotpassword', { email });
  return data;
};

export const resetPassword = async (token, password) => {
  const { data } = await api.put(`/auth/resetpassword/${token}`, { password });
  return data;
};

export const updateProfile = (profileData) => async (dispatch) => {
  try {
    const { data } = await api.put('/auth/profile', profileData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(data));
    }
    dispatch(loginSuccess(data));
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const updatePassword = async (passwordData) => {
  try {
    const { data } = await api.put('/auth/updatepassword', passwordData);
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};