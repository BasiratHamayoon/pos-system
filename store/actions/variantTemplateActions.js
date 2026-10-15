import api from '@/lib/api';
import {
  setVariantTemplatesLoading,
  setVariantTemplates,
  setVariantTemplatesError,
  addVariantTemplate,
  updateVariantTemplateInList,
  deleteVariantTemplateFromList,
} from '../slices/variantTemplateSlice';

export const fetchVariantTemplates = () => async (dispatch) => {
  dispatch(setVariantTemplatesLoading());
  try {
    const { data } = await api.get('/variant-templates');
    dispatch(setVariantTemplates(data));
  } catch (error) {
    dispatch(setVariantTemplatesError(error.response?.data?.message || error.message));
  }
};

export const fetchVariantTemplateById = async (id) => {
  try {
    const { data } = await api.get(`/variant-templates/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const createVariantTemplate = (data) => async (dispatch) => {
  try {
    const { data: res } = await api.post('/variant-templates', data);
    dispatch(addVariantTemplate(res));
    return res;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const editVariantTemplate = (id, data) => async (dispatch) => {
  try {
    const { data: res } = await api.put(`/variant-templates/${id}`, data);
    dispatch(updateVariantTemplateInList(res));
    return res;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const removeVariantTemplate = (id) => async (dispatch) => {
  try {
    await api.delete(`/variant-templates/${id}`);
    dispatch(deleteVariantTemplateFromList(id));
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};