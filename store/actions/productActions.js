import api from '@/lib/api';
import {
  setProductsLoading,
  setProducts,
  setProductsError,
  addProduct,
  updateProductInList,
  deleteProductFromList,
} from '../slices/productSlice';

export const fetchProducts = () => async (dispatch) => {
  dispatch(setProductsLoading());
  try {
    const { data } = await api.get('/products');
    dispatch(setProducts(data));
  } catch (error) {
    dispatch(setProductsError(error.response?.data?.message || error.message));
  }
};

export const fetchProductById = async (id) => {
  try {
    const { data } = await api.get(`/products/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const createProduct = (productData) => async (dispatch) => {
  try {
    const { data } = await api.post('/products', productData);
    dispatch(addProduct(data));
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const editProduct = (id, productData) => async (dispatch) => {
  try {
    const { data } = await api.put(`/products/${id}`, productData);
    dispatch(updateProductInList(data));
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const removeProduct = (id) => async (dispatch) => {
  try {
    await api.delete(`/products/${id}`);
    dispatch(deleteProductFromList(id));
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};