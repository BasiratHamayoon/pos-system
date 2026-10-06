import api from '@/lib/api';
import {
  setSalesLoading,
  setSales,
  setSalesError,
  addSaleToList,
} from '../slices/salesSlice';

export const fetchSales = () => async (dispatch) => {
  dispatch(setSalesLoading());
  try {
    const { data } = await api.get('/sales');
    dispatch(setSales(data));
  } catch (error) {
    dispatch(setSalesError(error.response?.data?.message || error.message));
  }
};

export const fetchSaleById = async (id) => {
  try {
    const { data } = await api.get(`/sales/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const createSale = (saleData) => async (dispatch) => {
  try {
    const { data } = await api.post('/sales', saleData);
    dispatch(addSaleToList(data));
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};