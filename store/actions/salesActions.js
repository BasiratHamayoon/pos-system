import { addSale } from "../slices/salesSlice";
import { generateId } from "@/lib/utils";

export const createSale = (saleData) => (dispatch) => {
  const sale = {
    ...saleData,
    id: generateId(),
    date: new Date().toISOString().split("T")[0],
  };
  dispatch(addSale(sale));
};