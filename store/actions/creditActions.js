import api from '@/lib/api';
import {
  setCreditsLoading,
  setCredits,
  setCreditsError,
  updateCreditInList,
} from '../slices/creditSlice';
import { fetchSales } from './salesActions';   // ← ADD this import

export const fetchCredits = () => async (dispatch) => {
  dispatch(setCreditsLoading());
  try {
    const { data } = await api.get('/credits');
    dispatch(setCredits(data));
  } catch (error) {
    dispatch(setCreditsError(error.response?.data?.message || error.message));
  }
};

export const fetchCreditById = async (id) => {
  try {
    const { data } = await api.get(`/credits/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const makePayment = (shopkeeperId, amount) => async (dispatch) => {
  try {
    const { data } = await api.post('/credits/payment', {
      shopkeeperId,
      amount: Number(amount),
    });
    dispatch(updateCreditInList(data));
    // Re-fetch sales so invoice credit/paid amounts & statuses stay in sync
    dispatch(fetchSales());
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};