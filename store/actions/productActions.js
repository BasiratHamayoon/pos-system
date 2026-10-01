import { addProduct, updateProduct, deleteProduct } from "../slices/productSlice";
import { generateId } from "@/lib/utils";

export const createProduct = (productData) => (dispatch) => {
  const product = {
    ...productData,
    id: generateId(),
    createdAt: new Date().toISOString().split("T")[0],
    status: productData.stock === 0 ? "out_of_stock" : productData.stock <= productData.minStock ? "low_stock" : "in_stock",
  };
  dispatch(addProduct(product));
};

export const editProduct = (productData) => (dispatch) => {
  dispatch(updateProduct(productData));
};

export const removeProduct = (productId) => (dispatch) => {
  dispatch(deleteProduct(productId));
};