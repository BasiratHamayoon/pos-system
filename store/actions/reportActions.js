import { addReport } from "../slices/reportSlice";
import { generateId } from "@/lib/utils";

export const generateReport = (reportData) => (dispatch) => {
  const report = {
    ...reportData,
    id: generateId(),
    generatedAt: new Date().toISOString(),
  };
  dispatch(addReport(report));
};