import api from '@/lib/api';
import {
  setReportsLoading,
  setReports,
  setReportsError,
  addReportToList,
  removeReportFromList,
} from '../slices/reportSlice';

export const fetchReports = () => async (dispatch) => {
  dispatch(setReportsLoading());
  try {
    const { data } = await api.get('/reports');
    dispatch(setReports(data));
  } catch (error) {
    dispatch(setReportsError(error.response?.data?.message || error.message));
  }
};

export const fetchReportById = async (id) => {
  try {
    const { data } = await api.get(`/reports/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const generateReport = (reportData) => async (dispatch) => {
  try {
    const { data } = await api.post('/reports', reportData);
    dispatch(addReportToList(data));
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const deleteReport = (id) => async (dispatch) => {
  try {
    await api.delete(`/reports/${id}`);
    dispatch(removeReportFromList(id));
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};