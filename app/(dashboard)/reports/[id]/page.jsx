"use client";

import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { fetchReportById } from "@/store/actions/reportActions";
import { fetchSales } from "@/store/actions/salesActions";
import { formatCurrency, formatDateTime, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Printer,
  BarChart3,
  AlertCircle,
  Calendar,
  Package,
  TrendingUp,
  Receipt,
} from "lucide-react";
import { motion } from "framer-motion";

export default function ReportDetailPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { sales = [] } = useSelector((state) => state.sales || {});

  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sales.length === 0) {
      dispatch(fetchSales());
    }

    const loadReport = async () => {
      try {
        const data = await fetchReportById(params.id);
        setReport(data);
      } catch (err) {
        console.error("Failed to load report:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadReport();
  }, [params.id, dispatch, sales.length]);

  const reportDatePrefix = useMemo(() => {
    if (!report?.date) return "";
    return report.date;
  }, [report]);

  const matchingSales = useMemo(() => {
    if (!report || !sales.length) return [];
    if (report.type === "stock") return [];

    return sales.filter((s) => {
      const saleDate = (s.date || s.createdAt || "").toString();
      if (report.type === "daily") {
        return saleDate.startsWith(reportDatePrefix);
      } else if (report.type === "monthly") {
        return saleDate.startsWith(reportDatePrefix.slice(0, 7));
      } else if (report.type === "yearly") {
        return saleDate.startsWith(reportDatePrefix.slice(0, 4));
      }
      return true;
    });
  }, [sales, report, reportDatePrefix]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 py-16">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
          <AlertCircle className="h-7 w-7 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold">Report Not Found</h2>
        <p className="text-xs text-muted-foreground">This statement does not exist or was deleted.</p>
        <Button variant="outline" onClick={() => router.push("/reports")} className="mt-2 rounded-xl">
          Return to Reports
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full min-h-0 max-w-5xl mx-auto pb-10">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 print:hidden"
      >
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => router.push("/reports")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight truncate">
                {report.title}
              </h1>
              <Badge
                variant="secondary"
                className="font-bold uppercase tracking-wider text-[9px] bg-primary/10 text-primary border-primary/20 shrink-0"
              >
                {report.type}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              Generated: {formatDateTime(report.createdAt)}
            </p>
          </div>
        </div>

        <Button
          onClick={() => window.print()}
          className="gap-2 h-10 px-6 rounded-xl shadow-md shadow-primary/20 shrink-0 font-bold"
        >
          <Printer className="h-4 w-4" /> Print Statement
        </Button>
      </motion.div>

      <div className="flex-1 min-h-0 overflow-y-auto sidebar-scroll pr-1 print:p-0 print:overflow-visible print:block">
        <div
          className="bg-card border-2 shadow-sm rounded-2xl p-6 sm:p-10 min-h-full print:border-none print:shadow-none print:p-0 print:bg-white print:text-black"
        >
          <div className="flex justify-between items-start border-b-2 border-black/20 pb-6 mb-6">
            <div>
              <h2 className="text-2xl font-black text-primary tracking-tight leading-tight">
                {user?.storeName || user?.name || "StorePOS Wholesale"}
              </h2>
              <p className="text-xs font-semibold text-muted-foreground mt-1">
                {user?.storeAddress || "Main Wholesale Market"}
              </p>
              <p className="text-xs font-semibold text-muted-foreground">
                PH: {user?.storePhone || "N/A"}
              </p>
            </div>
            <div className="text-right">
              <h3 className="text-lg font-black uppercase tracking-widest text-muted-foreground">
                FINANCIAL STATEMENT
              </h3>
              <p className="font-bold text-sm mt-1">{report.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Period Date: {formatDate(report.date)}
              </p>
              <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                Report ID: {report._id}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-muted/30 border">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-primary" /> Total Revenue
              </p>
              <p className="text-xl font-black text-primary">
                {formatCurrency(report.totalSales)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5 text-primary" /> Items Count
              </p>
              <p className="text-xl font-black">{report.totalItems}</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" /> Period Type
              </p>
              <p className="text-base font-bold capitalize">{report.type}</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <BarChart3 className="h-3.5 w-3.5 text-primary" /> Audit Status
              </p>
              <p className="text-base font-bold text-emerald-600">Finalized</p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
              <Receipt className="h-4 w-4 text-primary" />
              Transactions Breakdown
            </h4>

            {matchingSales.length > 0 ? (
              <table className="w-full text-xs text-left border border-black/20">
                <thead className="bg-muted/50 border-b border-black/20 font-bold">
                  <tr>
                    <th className="px-3 py-2.5">Invoice #</th>
                    <th className="px-3 py-2.5">Customer Name</th>
                    <th className="px-3 py-2.5 text-center">Payment Method</th>
                    <th className="px-3 py-2.5 text-center">Items</th>
                    <th className="px-3 py-2.5 text-right">Invoice Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10">
                  {matchingSales.map((sale) => (
                    <tr key={sale._id} className="hover:bg-muted/20">
                      <td className="px-3 py-2 font-bold font-mono">{sale.invoiceNo}</td>
                      <td className="px-3 py-2 font-semibold">{sale.shopkeeperName}</td>
                      <td className="px-3 py-2 text-center uppercase font-bold text-[10px]">
                        {sale.paymentMethod}
                      </td>
                      <td className="px-3 py-2 text-center font-semibold">
                        {sale.itemsCount || sale.items?.length || 0}
                      </td>
                      <td className="px-3 py-2 text-right font-bold">
                        {formatCurrency(sale.totalAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-muted/30 font-bold border-t-2 border-black">
                  <tr>
                    <td colSpan={3} className="px-3 py-2.5 text-left">
                      PERIOD TOTAL
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      {report.totalItems}
                    </td>
                    <td className="px-3 py-2.5 text-right text-primary text-sm font-black">
                      {formatCurrency(report.totalSales)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              <div className="p-6 border rounded-xl bg-muted/10 text-center">
                <p className="text-xs font-semibold text-muted-foreground">
                  Summary Report Statement • Total Volume: {report.totalItems} Units • Value: {formatCurrency(report.totalSales)}
                </p>
              </div>
            )}
          </div>

          <div className="mt-12 pt-4 border-t border-black/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>Generated by StorePOS Management System</p>
            <p dir="rtl" className="font-bold text-foreground font-sans">
              نوٹ: رپورٹ براے آڈٹ ریکارڈ محفوظ کرلی گئی ہے
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}