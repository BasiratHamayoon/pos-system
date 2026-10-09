import api from '@/lib/api';
import {
  setPurchasesLoading, setPurchases, setPurchasesError, addPurchaseToList,
} from '../slices/purchaseSlice';

export const fetchPurchases = () => async (dispatch) => {
  dispatch(setPurchasesLoading());
  try {
    const { data } = await api.get('/purchases');
    dispatch(setPurchases(data));
  } catch (error) { dispatch(setPurchasesError(error.message)); }
};

export const fetchPurchaseById = async (id) => {
  try {
    const { data } = await api.get(`/purchases/${id}`);
    return data;
  } catch (error) { throw error.response?.data?.message || error.message; }
};

export const createPurchase = (payload) => async (dispatch) => {
  try {
    const { data } = await api.post('/purchases', payload);
    dispatch(addPurchaseToList(data));
    return data;
  } catch (error) { throw error.response?.data?.message || error.message; }
};