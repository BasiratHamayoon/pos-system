import api from '@/lib/api';
import {
  setBrandsLoading,
  setBrands,
  setBrandsError,
  addBrand,
  updateBrandInList,
  deleteBrandFromList,
} from '../slices/brandSlice';

export const fetchBrands = () => async (dispatch) => {
  dispatch(setBrandsLoading());
  try {
    const { data } = await api.get('/brands');
    dispatch(setBrands(data));
  } catch (error) {
    dispatch(setBrandsError(error.response?.data?.message || error.message));
  }
};

export const fetchBrandById = async (id) => {
  try {
    const { data } = await api.get(`/brands/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const createBrand = (data) => async (dispatch) => {
  try {
    const response = await api.post('/brands', data);
    dispatch(addBrand(response.data));
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const editBrand = (id, data) => async (dispatch) => {
  try {
    const response = await api.put(`/brands/${id}`, data);
    dispatch(updateBrandInList(response.data));
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const removeBrand = (id) => async (dispatch) => {
  try {
    await api.delete(`/brands/${id}`);
    dispatch(deleteBrandFromList(id));
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};