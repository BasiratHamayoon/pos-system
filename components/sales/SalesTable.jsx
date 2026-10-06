"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Banknote, CreditCard, ArrowRightLeft } from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function SalesTable({ sales, isLoading }) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
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
        {sales.map((sale) => (
          <tr key={sale._id} className="hover:bg-accent/50 transition-colors">
            <td className="px-4 py-3">
              <p className="font-bold">{sale.invoiceNo}</p>
              <p className="text-[10px] text-muted-foreground">{formatDate(sale.createdAt)}</p>
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
                {sale.itemsCount}
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
                sale.status === "paid" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                sale.status === "partial" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                sale.status === "pending" || sale.status === "unpaid" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              }>
                {sale.status}
              </Badge>
            </td>
            <td className="px-4 py-3 text-right">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10" onClick={() => router.push(`/sales/${sale._id}`)}>
                <Eye className="h-4 w-4" />
              </Button>
            </td>
          </tr>
        ))}
        {sales.length === 0 && (
          <tr>
            <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
              No transactions found matching your filters.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}