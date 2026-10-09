import api from '@/lib/api';
import {
  setAnalyticsLoading,
  setAnalyticsData,
  setAnalyticsError,
} from '../slices/analyticsSlice';

export const fetchProfitLoss = () => async (dispatch) => {
  dispatch(setAnalyticsLoading());
  try {
    const { data } = await api.get('/analytics/profit-loss');
    dispatch(setAnalyticsData(data));
  } catch (error) {
    dispatch(setAnalyticsError(error.response?.data?.message || error.message));
  }
};

export const fetchPurchaseAnalytics = async () => {
  try {
    const { data } = await api.get('/analytics/purchase');
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};