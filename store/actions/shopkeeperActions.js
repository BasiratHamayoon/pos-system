import { addShopkeeper, updateShopkeeper, deleteShopkeeper } from "../slices/shopkeeperSlice";
import { generateId } from "@/lib/utils";

export const createShopkeeper = (data) => (dispatch) => {
  const shopkeeper = {
    ...data,
    id: generateId(),
    totalCredit: 0,
    totalPurchases: 0,
    status: "active",
    createdAt: new Date().toISOString().split("T")[0],
  };
  dispatch(addShopkeeper(shopkeeper));
};

export const editShopkeeper = (data) => (dispatch) => {
  dispatch(updateShopkeeper(data));
};

export const removeShopkeeper = (id) => (dispatch) => {
  dispatch(deleteShopkeeper(id));
};