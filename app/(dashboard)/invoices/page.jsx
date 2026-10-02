"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { formatCurrency, formatDateTime, cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  FileText,
  DollarSign,
  CheckCircle2,
  Clock,
  Eye,
  Printer,
  AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";

export default function InvoicesPage() {
  const router = useRouter();
  const { invoices } = useSelector((state) => state.invoices);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const totalInvoices = invoices.length;
  const totalValue = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
  const totalDue = invoices.reduce((sum, inv) => sum + (inv.creditAmount || 0), 0);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = 
      inv.invoiceNo?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      inv.shopkeeperName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { title: "Total Invoices", value: totalInvoices, icon: FileText, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { title: "Total Value", value: formatCurrency(totalValue), icon: DollarSign, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { title: "Total Collected", value: formatCurrency(totalPaid), icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { title: "Total Pending (Khata)", value: formatCurrency(totalDue), icon: Clock, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  ];

  return (
    <div className="flex flex-col gap-6 h-full min-h-0">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Manage and print generated bills</p>
        </div>
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
              placeholder="Search by invoice number or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-background border-muted-foreground/20"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {["all", "paid", "partial", "unpaid"].map((status) => (
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
                <th className="px-4 py-3 font-semibold text-muted-foreground">Invoice No</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">Customer</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">Date</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Total Amount</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Pending Due</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground text-center">Status</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-bold text-sm">{inv.invoiceNo}</p>
                    <p className="text-[10px] text-muted-foreground">{inv.items?.length || 0} items</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-bold truncate max-w-[150px]">{inv.shopkeeperName}</p>
                    <p className="text-[10px] text-muted-foreground truncate max-w-[150px]">{inv.shopName}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium">{formatDateTime(inv.date)}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <p className="font-bold">{formatCurrency(inv.totalAmount)}</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <p className={cn(
                      "font-bold",
                      inv.creditAmount > 0 ? "text-orange-600 dark:text-orange-500" : "text-emerald-600 dark:text-emerald-500"
                    )}>
                      {formatCurrency(inv.creditAmount || 0)}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant="secondary" className={cn(
                      "font-bold uppercase tracking-wider text-[9px]",
                      inv.status === "paid" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200" :
                      inv.status === "partial" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200" :
                      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200"
                    )}>
                      {inv.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10" onClick={() => router.push(`/invoices/${inv.id}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    No invoices found matching your filters.
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