"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { formatCurrency, formatDateTime, formatDate, cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Printer, 
  BarChart3, 
  AlertCircle,
  Calendar,
  DollarSign,
  Package,
  TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function ReportDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { reports } = useSelector((state) => state.reports);
  const { storeInfo } = useSelector((state) => state.settings);
  
  const [report, setReport] = useState(null);

  useEffect(() => {
    const found = reports.find((r) => String(r.id) === String(params.id));
    if (found) setReport(found);
  }, [reports, params.id]);

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
          <AlertCircle className="h-7 w-7 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold">Report Not Found</h2>
        <p className="text-xs text-muted-foreground">This document does not exist.</p>
        <Button variant="outline" onClick={() => router.push("/reports")} className="mt-2 rounded-xl">Return to Reports</Button>
      </div>
    );
  }

  // Dummy Chart Data based on report type
  const chartData = [
    { name: "Chips & Snacks", value: 45000, qty: 850 },
    { name: "Beverages", value: 32000, qty: 420 },
    { name: "Grocery (Daal/Rice)", value: 85000, qty: 1200 },
    { name: "Cookies", value: 15000, qty: 300 },
    { name: "Spices", value: 12000, qty: 150 },
  ];

  const CHART_COLORS = ["oklch(0.58 0.17 185)", "oklch(0.65 0.17 155)", "oklch(0.72 0.18 85)", "oklch(0.60 0.20 290)", "oklch(0.65 0.22 15)"];

  return (
    <div className="flex flex-col gap-6 h-full min-h-0 max-w-6xl mx-auto pb-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 print:hidden">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => router.push("/reports")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight truncate">{report.title}</h1>
              <Badge variant="secondary" className="font-bold uppercase tracking-wider text-[9px] bg-primary/10 text-primary border-primary/20 shrink-0">
                {report.type}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              Generated: {formatDateTime(report.generatedAt)}
            </p>
          </div>
        </div>
        
        <Button onClick={() => window.print()} className="gap-2 h-10 px-6 rounded-xl shadow-md shadow-primary/20 shrink-0 font-bold">
          <Printer className="h-4 w-4" /> Print Report
        </Button>
      </motion.div>

      <div className="flex-1 min-h-0 overflow-y-auto sidebar-scroll pr-1 print:overflow-visible">
        {/* PRINTABLE DOCUMENT AREA */}
        <div className="bg-card border-2 shadow-sm rounded-xl p-6 sm:p-8 min-h-full print:border-none print:shadow-none print:p-0">
          
          {/* Document Header */}
          <div className="flex justify-between items-start border-b-2 pb-6 mb-6">
            <div>
              <h2 className="text-2xl font-black text-primary tracking-tight">{storeInfo?.name || "StorePOS"}</h2>
              <p className="text-sm text-muted-foreground font-medium mt-1">{storeInfo?.address}</p>
              <p className="text-sm text-muted-foreground font-medium">PH: {storeInfo?.phone}</p>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-bold uppercase tracking-widest text-muted-foreground">REPORT</h3>
              <p className="font-bold text-sm mt-1">{report.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Date: {formatDate(report.date)}</p>
              <p className="text-[10px] text-muted-foreground font-mono mt-0.5">ID: {report.id}</p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-muted/30 border">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5"><TrendingUp className="h-3 w-3" /> Total Revenue</p>
              <p className="text-xl font-black text-primary">{formatCurrency(report.totalSales)}</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5"><Package className="h-3 w-3" /> Items Sold</p>
              <p className="text-xl font-black">{report.totalItems}</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Period</p>
              <p className="text-base font-bold capitalize">{report.type}</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5"><BarChart3 className="h-3 w-3" /> Status</p>
              <p className="text-base font-bold text-emerald-600">Finalized</p>
            </div>
          </div>

          {/* Charts Area - Only show for sales reports, hide for stock */}
          {report.type !== "stock" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 print:break-inside-avoid">
              <div className="border rounded-xl p-4">
                <h4 className="text-sm font-bold mb-4 flex items-center gap-2"><DollarSign className="h-4 w-4 text-primary" /> Sales by Category (Value)</h4>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border)" />
                      <XAxis type="number" tickFormatter={(v) => `${v/1000}k`} tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                      <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                      <Tooltip 
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)' }}
                      />
                      <Bar dataKey="value" fill="oklch(0.58 0.17 185)" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="border rounded-xl p-4">
                <h4 className="text-sm font-bold mb-4 flex items-center gap-2"><Package className="h-4 w-4 text-primary" /> Volume by Category (Qty)</h4>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="qty"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => `${value} units`}
                        contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-3 mt-2">
                  {chartData.map((d, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[10px] font-semibold">
                      <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: CHART_COLORS[i] }} />
                      {d.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tabular Data Summary */}
          <div>
            <h4 className="text-sm font-bold mb-3">Detailed Summary</h4>
            <table className="w-full text-sm text-left border">
              <thead className="bg-muted/40 border-b">
                <tr>
                  <th className="px-4 py-2.5 font-semibold text-muted-foreground">Category Name</th>
                  <th className="px-4 py-2.5 font-semibold text-muted-foreground text-center">Units Sold</th>
                  <th className="px-4 py-2.5 font-semibold text-muted-foreground text-right">Revenue Generated</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {chartData.map((row, i) => (
                  <tr key={i} className="hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-2.5 font-bold">{row.name}</td>
                    <td className="px-4 py-2.5 text-center">{row.qty}</td>
                    <td className="px-4 py-2.5 text-right font-medium">{formatCurrency(row.value)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-muted/10 font-bold border-t-2 border-black">
                <tr>
                  <td className="px-4 py-3">GRAND TOTAL</td>
                  <td className="px-4 py-3 text-center">{report.totalItems}</td>
                  <td className="px-4 py-3 text-right text-primary">{formatCurrency(report.totalSales)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div className="mt-12 pt-4 border-t text-center text-xs text-muted-foreground print:mt-auto print:pt-8">
            Generated by StorePOS System • {formatDateTime(new Date().toISOString())}
          </div>
        </div>
      </div>
    </div>
  );
}