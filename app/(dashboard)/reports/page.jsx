"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { generateReport } from "@/store/actions/reportActions";
import { formatCurrency, formatDate, formatDateTime, cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Search,
  BarChart3,
  Calendar,
  FileText,
  Plus,
  Eye,
  TrendingUp,
  Package,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ReportsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { reports } = useSelector((state) => state.reports);
  const { sales } = useSelector((state) => state.sales);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  
  // Generate Report Modal State
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [newReportType, setNewReportType] = useState("daily");
  const [newReportDate, setNewReportDate] = useState(new Date().toISOString().split("T")[0]);

  const filteredReports = reports.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || r.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleGenerateReport = () => {
    // Calculate dummy totals based on current sales (In real app, you'd filter sales by date)
    const reportSales = sales.slice(0, Math.floor(Math.random() * sales.length) + 1);
    const totalReportSales = reportSales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalReportItems = reportSales.reduce((sum, s) => sum + s.items, 0);

    const typeLabels = {
      daily: "Daily Sales Report",
      weekly: "Weekly Sales Report",
      monthly: "Monthly Sales Report",
      yearly: "Yearly Sales Report",
      shopkeeper: "Shopkeeper Report",
      stock: "Inventory/Stock Report",
    };

    dispatch(
      generateReport({
        title: `${typeLabels[newReportType]} - ${formatDate(newReportDate)}`,
        type: newReportType,
        date: newReportDate,
        totalSales: newReportType === "stock" ? 0 : totalReportSales,
        totalItems: totalReportItems || 150, // Fallback for dummy
      })
    );
    
    setGenerateModalOpen(false);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "daily": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200";
      case "weekly": return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200";
      case "monthly": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200";
      case "stock": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200";
      case "shopkeeper": return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full min-h-0">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Generate insights for your store</p>
        </div>
        <Button onClick={() => setGenerateModalOpen(true)} className="gap-2 h-10 px-4 rounded-xl shadow-md shadow-primary/20">
          <Plus className="h-4 w-4" /> Generate Report
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 shrink-0">
        {[
          { title: "Total Reports", value: reports.length, icon: FileText, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
          { title: "Monthly Sales", value: formatCurrency(1245000), icon: TrendingUp, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
          { title: "Inventory Value", value: formatCurrency(845000), icon: Package, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
          { title: "Active Customers", value: "8", icon: Users, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
        ].map((stat, index) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <Card className={`border-2 ${stat.border} shadow-sm`}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color} shrink-0`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">{stat.title}</p>
                  <p className="text-2xl font-black tracking-tight mt-0.5 truncate">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="flex-1 min-h-0 flex flex-col overflow-hidden border-2 shadow-sm">
        <div className="p-4 border-b bg-muted/20 shrink-0 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search reports by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-background border-muted-foreground/20"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {["all", "daily", "monthly", "stock"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={cn(
                  "px-4 h-10 rounded-xl text-xs font-bold capitalize transition-all border",
                  filterType === type 
                    ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                    : "bg-background text-muted-foreground border-muted hover:bg-muted/50"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto sidebar-scroll">
          <table className="w-full text-sm text-left">
            <thead className="sticky top-0 bg-muted/40 backdrop-blur-md z-10 border-b">
              <tr>
                <th className="px-4 py-3 font-semibold text-muted-foreground">Report Title</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">Type</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground text-center">Items Sold/Count</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Total Revenue</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">Generated On</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                        <BarChart3 className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold truncate text-sm">{report.title}</p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Calendar className="h-3 w-3" /> For: {formatDate(report.date)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={cn("font-bold uppercase tracking-wider text-[9px]", getTypeColor(report.type))}>
                      {report.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-bold">{report.totalItems}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <p className="font-bold text-primary">
                      {report.type === "stock" ? "-" : formatCurrency(report.totalSales)}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-medium">{formatDateTime(report.generatedAt)}</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10" onClick={() => router.push(`/reports/${report.id}`)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    No reports found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <AnimatePresence>
        {generateModalOpen && (
          <Dialog open={generateModalOpen} onOpenChange={setGenerateModalOpen}>
            <DialogContent className="sm:max-w-[420px] rounded-2xl p-0 overflow-hidden">
              <div className="gradient-primary p-6 text-white text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 mx-auto mb-3 backdrop-blur-sm">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <DialogTitle className="text-lg font-bold text-white mb-1">
                  Generate New Report
                </DialogTitle>
                <DialogDescription className="text-white/80 text-xs font-medium">
                  Select report parameters below
                </DialogDescription>
              </div>

              <div className="p-6 bg-background space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Report Type</Label>
                  <select
                    value={newReportType}
                    onChange={(e) => setNewReportType(e.target.value)}
                    className="flex h-11 w-full rounded-xl border border-input bg-muted/30 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <option value="daily">Daily Sales Report</option>
                    <option value="weekly">Weekly Sales Report</option>
                    <option value="monthly">Monthly Sales Report</option>
                    <option value="yearly">Yearly Sales Report</option>
                    <option value="shopkeeper">Customer/Shopkeeper Ledger</option>
                    <option value="stock">Inventory & Stock Report</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Report Date / Period</Label>
                  <Input
                    type="date"
                    value={newReportDate}
                    onChange={(e) => setNewReportDate(e.target.value)}
                    className="h-11 rounded-xl bg-muted/30"
                  />
                </div>

                <DialogFooter className="flex flex-row gap-2 sm:justify-center pt-4 border-t">
                  <Button variant="outline" onClick={() => setGenerateModalOpen(false)} className="flex-1 h-11 text-xs font-bold rounded-xl">
                    Cancel
                  </Button>
                  <Button onClick={handleGenerateReport} className="flex-1 h-11 text-xs font-bold rounded-xl shadow-lg shadow-primary/20 gap-2">
                    Generate
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}