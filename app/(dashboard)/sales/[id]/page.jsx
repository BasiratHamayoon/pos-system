"use client";

import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { fetchSaleById } from "@/store/actions/salesActions";
import { formatCurrency, formatDate, formatDateTime, cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft, Printer, Receipt, User, MapPin, Phone, Store,
  AlertCircle, Banknote, CreditCard, ArrowLeftRight, Calendar
} from "lucide-react";
import { motion } from "framer-motion";

export default function SaleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useSelector((state) => state.auth);

  const [sale, setSale] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const loadSale = async () => {
      try {
        const data = await fetchSaleById(params.id);
        setSale(data);
      } catch (err) {
        console.error(err);
      } finally {
        setFetchLoading(false);
      }
    };
    loadSale();
  }, [params.id]);

  const paymentIcon = useMemo(() => {
    if (!sale) return null;
    if (sale.paymentMethod === "cash") return <Banknote className="h-3.5 w-3.5" />;
    if (sale.paymentMethod === "partial") return <ArrowLeftRight className="h-3.5 w-3.5" />;
    return <CreditCard className="h-3.5 w-3.5" />;
  }, [sale]);

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
          <AlertCircle className="h-7 w-7 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold">Transaction Not Found</h2>
        <Button variant="outline" onClick={() => router.push("/sales")} className="mt-2 rounded-xl">
          Return to Sales
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 h-full min-h-0 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0"
      >
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => router.push("/sales")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight truncate">{sale.invoiceNo}</h1>
              <Badge variant="secondary" className={cn(
                "font-bold shrink-0",
                sale.status === "paid" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                sale.status === "partial" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              )}>
                {sale.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <Calendar className="h-3 w-3 shrink-0" />
              {formatDateTime(sale.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 print:hidden shrink-0">
          <Button variant="outline" onClick={() => router.push("/pos")} className="gap-2 h-10 px-4 rounded-xl">
            <Receipt className="h-4 w-4" /> New Sale
          </Button>
          <Button onClick={() => window.print()} className="gap-2 h-10 px-4 rounded-xl">
            <Printer className="h-4 w-4" /> Print
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 flex-1 min-h-0 items-stretch">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="lg:col-span-2 min-h-0 flex">
          <Card className="border-2 shadow-sm w-full flex flex-col min-h-0 overflow-hidden">
            <CardHeader className="border-b bg-muted/10 py-4 px-5 shrink-0">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Receipt className="h-4 w-4 text-primary" />
                Order Items
                <span className="ml-auto text-[11px] font-semibold text-muted-foreground">
                  {sale.items.length} item{sale.items.length === 1 ? "" : "s"}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 min-h-0 overflow-y-auto sidebar-scroll">
              <table className="w-full text-sm text-left">
                <thead className="sticky top-0 bg-muted/40 backdrop-blur-md z-10 border-b">
                  <tr>
                    <th className="px-5 py-3 font-semibold text-muted-foreground">Product</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground text-center w-20">Qty</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground text-right w-28">Price</th>
                    <th className="px-5 py-3 font-semibold text-muted-foreground text-right w-28">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {sale.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-accent/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-sm">
                          {item.name}
                          {item.unit && item.unit !== 'pcs' && (
                            <span className="text-muted-foreground font-normal"> ({item.unitValue}{item.unit})</span>
                          )}
                        </p>
                        {item.brand && (
                          <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{item.brand}</p>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-center font-bold">{item.qty}</td>
                      <td className="px-4 py-3.5 text-right">{formatCurrency(item.price)}</td>
                      <td className="px-5 py-3.5 text-right font-bold">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="min-h-0 flex flex-col gap-5">
          <Card className="border-2 shadow-sm flex flex-col">
            <CardHeader className="border-b bg-muted/10 py-4 px-5 shrink-0">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <User className="h-4 w-4 text-primary" /> Customer Info
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 flex-1 space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Name</p>
                <p className="font-bold text-sm leading-snug">{sale.shopkeeperName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Shop Details</p>
                <p className="font-semibold text-sm flex items-center gap-1.5 leading-snug">
                  <Store className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate">{sale.shopName}</span>
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Contact</p>
                <p className="font-semibold text-sm flex items-center gap-1.5 leading-snug">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span>{sale.phone || "N/A"}</span>
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Address</p>
                <p className="font-semibold text-sm flex items-start gap-1.5 leading-snug">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                  <span>{sale.address || "N/A"}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-sm flex flex-col flex-1">
            <CardHeader className="border-b bg-muted/10 py-4 px-5 shrink-0">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Receipt className="h-4 w-4 text-primary" /> Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 flex-1 flex flex-col">
              <div className="space-y-3 flex-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{formatCurrency(sale.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Discount{sale.discountPercent ? ` (${sale.discountPercent}%)` : ""}
                  </span>
                  <span className={cn("font-semibold", sale.discount > 0 && "text-destructive")}>
                    {sale.discount > 0 ? `-${formatCurrency(sale.discount)}` : formatCurrency(0)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center py-1">
                  <span className="font-bold text-sm">Grand Total</span>
                  <span className="font-black text-xl text-primary leading-none">
                    {formatCurrency(sale.totalAmount)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-bold text-emerald-600">{formatCurrency(sale.paidAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Added to Credit</span>
                  <span className={cn("font-bold", sale.creditAmount > 0 ? "text-orange-600" : "text-muted-foreground")}>
                    {formatCurrency(sale.creditAmount)}
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <span className="text-xs text-muted-foreground font-medium">Payment Method</span>
                <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] px-2.5 py-1 rounded-lg bg-muted">
                  {paymentIcon}
                  {sale.paymentMethod}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-sm bg-muted/20 shrink-0">
            <CardContent className="p-4">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Store</p>
              <p className="text-sm font-bold leading-snug">{user?.storeName || user?.name || "StorePOS"}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-snug">{user?.storeAddress || "N/A"}</p>
              <p className="text-xs text-muted-foreground leading-snug">{user?.storePhone || "N/A"}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}