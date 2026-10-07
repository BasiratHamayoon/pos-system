import api from '@/lib/api';
import {
  setCreditsLoading,
  setCredits,
  setCreditsError,
  updateCreditInList,
} from '../slices/creditSlice';

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
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};