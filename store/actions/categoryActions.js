import api from '@/lib/api';
import {
  setCategoriesLoading,
  setCategories,
  setCategoriesError,
  addCategory,
  updateCategoryInList,
  deleteCategoryFromList,
} from '../slices/categorySlice';

export const fetchCategories = () => async (dispatch) => {
  dispatch(setCategoriesLoading());
  try {
    const { data } = await api.get('/categories');
    dispatch(setCategories(data));
  } catch (error) {
    dispatch(setCategoriesError(error.response?.data?.message || error.message));
  }
};

export const fetchCategoryById = async (id) => {
  try {
    const { data } = await api.get(`/categories/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const createCategory = (categoryData) => async (dispatch) => {
  try {
    const { data } = await api.post('/categories', categoryData);
    dispatch(addCategory(data));
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const editCategory = (id, categoryData) => async (dispatch) => {
  try {
    const { data } = await api.put(`/categories/${id}`, categoryData);
    dispatch(updateCategoryInList(data));
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const removeCategory = (id) => async (dispatch) => {
  try {
    await api.delete(`/categories/${id}`);
    dispatch(deleteCategoryFromList(id));
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};