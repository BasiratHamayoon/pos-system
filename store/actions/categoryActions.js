import { addCategory, updateCategory, deleteCategory } from "../slices/categorySlice";
import { generateId } from "@/lib/utils";

export const createCategory = (categoryData) => (dispatch) => {
  const category = {
    ...categoryData,
    id: generateId(),
    productCount: 0,
    status: "active",
    createdAt: new Date().toISOString().split("T")[0],
  };
  dispatch(addCategory(category));
};

export const editCategory = (categoryData) => (dispatch) => {
  dispatch(updateCategory(categoryData));
};

export const removeCategory = (categoryId) => (dispatch) => {
  dispatch(deleteCategory(categoryId));
};