import { updateCredit } from "../slices/creditSlice";

export const makePayment = (creditId, amount) => (dispatch, getState) => {
  const credit = getState().credits.credits.find((c) => c.id === creditId);
  if (credit) {
    const updatedCredit = {
      ...credit,
      totalCredit: credit.totalCredit - amount,
      lastPayment: amount,
      lastPaymentDate: new Date().toISOString().split("T")[0],
      status: credit.totalCredit - amount <= 0 ? "paid" : "pending",
    };
    dispatch(updateCredit(updatedCredit));
  }
};