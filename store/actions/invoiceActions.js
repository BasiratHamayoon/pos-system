import api from '@/lib/api';
import {
  setInvoicesLoading,
  setInvoices,
  setInvoicesError,
} from '../slices/invoiceSlice';

export const fetchInvoices = () => async (dispatch) => {
  dispatch(setInvoicesLoading());
  try {
    const { data } = await api.get('/invoices');
    dispatch(setInvoices(data));
  } catch (error) {
    dispatch(setInvoicesError(error.response?.data?.message || error.message));
  }
};

export const fetchInvoiceById = async (id) => {
  try {
    const { data } = await api.get(`/invoices/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};