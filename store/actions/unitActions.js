import api from '@/lib/api';
import {
  setUnitsLoading,
  setUnits,
  setUnitsError,
  addUnit,
  updateUnitInList,
  deleteUnitFromList,
} from '../slices/unitSlice';

export const fetchUnits = () => async (dispatch) => {
  dispatch(setUnitsLoading());
  try {
    const { data } = await api.get('/units');
    dispatch(setUnits(data));
  } catch (error) {
    dispatch(setUnitsError(error.response?.data?.message || error.message));
  }
};

export const fetchUnitById = async (id) => {
  try {
    const { data } = await api.get(`/units/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const createUnit = (unitData) => async (dispatch) => {
  try {
    const { data } = await api.post('/units', unitData);
    dispatch(addUnit(data));
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const editUnit = (id, unitData) => async (dispatch) => {
  try {
    const { data } = await api.put(`/units/${id}`, unitData);
    dispatch(updateUnitInList(data));
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const removeUnit = (id) => async (dispatch) => {
  try {
    await api.delete(`/units/${id}`);
    dispatch(deleteUnitFromList(id));
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};