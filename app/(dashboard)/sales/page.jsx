"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ShoppingCart,
  DollarSign,
  Banknote,
  CreditCard,
  Eye,
  ArrowRightLeft
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SalesPage() {
  const router = useRouter();
  const { sales } = useSelector((state) => state.sales);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalCash = sales.reduce((sum, s) => sum + s.paidAmount, 0);
  const totalCredit = sales.reduce((sum, s) => sum + s.creditAmount, 0);

  const filteredSales = sales.filter((s) => {
    const matchesSearch = 
      s.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.shopkeeperName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { title: "Total Transactions", value: totalSales, icon: ShoppingCart, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { title: "Total Revenue", value: formatCurrency(totalRevenue), icon: DollarSign, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { title: "Cash Received", value: formatCurrency(totalCash), icon: Banknote, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { title: "Credit Given", value: formatCurrency(totalCredit), icon: CreditCard, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  ];

  return (
    <div className="flex flex-col gap-6 h-full min-h-0">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales History</h1>
          <p className="text-xs text-muted-foreground mt-0.5">View and manage all transactions</p>
        </div>
        <Button onClick={() => router.push("/pos")} className="gap-2 h-10 px-4 rounded-xl shadow-md shadow-primary/20">
          <ShoppingCart className="h-4 w-4" /> New Sale
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 shrink-0">
        {stats.map((stat, index) => (
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
              placeholder="Search by invoice number or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-background border-muted-foreground/20"
            />
          </div>
          <div className="flex items-center gap-2">
            {["all", "completed", "pending"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "px-4 h-10 rounded-xl text-xs font-bold capitalize transition-all border",
                  statusFilter === status 
                    ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                    : "bg-background text-muted-foreground border-muted hover:bg-muted/50"
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto sidebar-scroll">
          <table className="w-full text-sm text-left">
            <thead className="sticky top-0 bg-muted/40 backdrop-blur-md z-10 border-b">
              <tr>
                <th className="px-4 py-3 font-semibold text-muted-foreground">Invoice / Date</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">Customer</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground text-center">Items</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Total Amount</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground text-center">Payment</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground text-center">Status</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-accent/50 transition-colors group">
                  <td className="px-4 py-3">
                    <p className="font-bold">{sale.invoiceNo}</p>
                    <p className="text-[10px] text-muted-foreground">{formatDate(sale.date)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary text-[10px] font-bold shrink-0">
                        {sale.shopkeeperName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <span className="font-bold truncate max-w-[150px]">{sale.shopkeeperName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center h-6 min-w-6 px-2 rounded-full bg-muted text-xs font-bold">
                      {sale.items}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <p className="font-bold text-primary">{formatCurrency(sale.totalAmount)}</p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant="outline" className={cn(
                      "font-bold uppercase text-[9px] tracking-wider",
                      sale.paymentMethod === "cash" && "border-emerald-200 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30",
                      sale.paymentMethod === "credit" && "border-orange-200 text-orange-600 bg-orange-50 dark:bg-orange-950/30",
                      sale.paymentMethod === "partial" && "border-blue-200 text-blue-600 bg-blue-50 dark:bg-blue-950/30",
                    )}>
                      {sale.paymentMethod === "partial" ? <ArrowRightLeft className="h-3 w-3 mr-1" /> : sale.paymentMethod === "cash" ? <Banknote className="h-3 w-3 mr-1" /> : <CreditCard className="h-3 w-3 mr-1" />}
                      {sale.paymentMethod}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant="secondary" className={
                      sale.status === "completed" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                      sale.status === "pending" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }>
                      {sale.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10" onClick={() => router.push(`/sales/${sale.id}`)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    No transactions found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}