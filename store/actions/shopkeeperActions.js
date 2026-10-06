import api from '@/lib/api';
import {
  setShopkeepersLoading,
  setShopkeepers,
  setShopkeepersError,
  addShopkeeper,
  updateShopkeeperInList,
  deleteShopkeeperFromList,
} from '../slices/shopkeeperSlice';

export const fetchShopkeepers = () => async (dispatch) => {
  dispatch(setShopkeepersLoading());
  try {
    const { data } = await api.get('/shopkeepers');
    dispatch(setShopkeepers(data));
  } catch (error) {
    dispatch(setShopkeepersError(error.response?.data?.message || error.message));
  }
};

export const fetchShopkeeperById = async (id) => {
  try {
    const { data } = await api.get(`/shopkeepers/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const createShopkeeper = (data) => async (dispatch) => {
  try {
    const response = await api.post('/shopkeepers', data);
    dispatch(addShopkeeper(response.data));
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const editShopkeeper = (id, data) => async (dispatch) => {
  try {
    const response = await api.put(`/shopkeepers/${id}`, data);
    dispatch(updateShopkeeperInList(response.data));
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const removeShopkeeper = (id) => async (dispatch) => {
  try {
    await api.delete(`/shopkeepers/${id}`);
    dispatch(deleteShopkeeperFromList(id));
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};