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
  } catch (err) {
    dispatch(setShopkeepersError(err.response?.data?.message || err.message));
  }
};

export const createShopkeeper = (shopkeeperData) => async (dispatch) => {
  try {
    const { data } = await api.post('/shopkeepers', shopkeeperData);
    dispatch(addShopkeeper(data));
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

export const editShopkeeper = (id, shopkeeperData) => async (dispatch) => {
  try {
    const { data } = await api.put(`/shopkeepers/${id}`, shopkeeperData);
    dispatch(updateShopkeeperInList(data));
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

export const deleteShopkeeper = (id) => async (dispatch) => {
  try {
    await api.delete(`/shopkeepers/${id}`);
    dispatch(deleteShopkeeperFromList(id));
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

export const fetchShopkeeperHistory = async (id) => {
  try {
    const { data } = await api.get(`/shopkeepers/${id}/history`);
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};