import api from '@/lib/api';
import {
  setSuppliersLoading, setSuppliers, setSuppliersError,
  addSupplier, updateSupplierInList, deleteSupplierFromList,
} from '../slices/supplierSlice';

export const fetchSuppliers = () => async (dispatch) => {
  dispatch(setSuppliersLoading());
  try {
    const { data } = await api.get('/suppliers');
    dispatch(setSuppliers(data));
  } catch (error) { dispatch(setSuppliersError(error.message)); }
};

export const fetchSupplierById = async (id) => {
  try {
    const { data } = await api.get(`/suppliers/${id}`);
    return data;
  } catch (error) { throw error.response?.data?.message || error.message; }
};

export const createSupplier = (payload) => async (dispatch) => {
  try {
    const { data } = await api.post('/suppliers', payload);
    dispatch(addSupplier(data));
    return data;
  } catch (error) { throw error.response?.data?.message || error.message; }
};

export const editSupplier = (id, payload) => async (dispatch) => {
  try {
    const { data } = await api.put(`/suppliers/${id}`, payload);
    dispatch(updateSupplierInList(data));
    return data;
  } catch (error) { throw error.response?.data?.message || error.message; }
};

export const removeSupplier = (id) => async (dispatch) => {
  try {
    await api.delete(`/suppliers/${id}`);
    dispatch(deleteSupplierFromList(id));
  } catch (error) { throw error.response?.data?.message || error.message; }
};