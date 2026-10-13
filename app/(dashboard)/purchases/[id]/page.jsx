"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchPurchaseById } from "@/store/actions/purchaseActions";
import { formatCurrency, formatDateTime, cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Printer,
  Truck,
  Factory,
  AlertCircle,
  Calendar,
  Banknote,
  CreditCard,
  ArrowRightLeft,
  Package,
} from "lucide-react";
import { motion } from "framer-motion";

export default function PurchaseDetailPage() {
  const router = useRouter();
  const params = useParams();

  const [purchase, setPurchase] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const loadPurchase = async () => {
      try {
        const data = await fetchPurchaseById(params.id);
        setPurchase(data);
      } catch (err) {
        console.error(err);
      } finally {
        setFetchLoading(false);
      }
    };
    loadPurchase();
  }, [params.id]);

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-full py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!purchase) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 py-16">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
          <AlertCircle className="h-7 w-7 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold">Purchase Order Not Found</h2>
        <p className="text-xs text-muted-foreground">This purchase record does not exist.</p>
        <Button variant="outline" onClick={() => router.push("/purchases")} className="mt-2 rounded-xl">
          Return to Purchases
        </Button>
      </div>
    );
  }

  const paymentIcon =
    purchase.paymentMethod === "cash" ? (
      <Banknote className="h-3.5 w-3.5" />
    ) : purchase.paymentMethod === "partial" ? (
      <ArrowRightLeft className="h-3.5 w-3.5" />
    ) : (
      <CreditCard className="h-3.5 w-3.5" />
    );

  return (
    <div className="flex flex-col gap-5 h-full min-h-0 max-w-6xl mx-auto pb-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 print:hidden"
      >
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => router.push("/purchases")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight font-mono">
                {purchase.poNumber}
              </h1>
              <Badge
                variant="secondary"
                className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-bold uppercase"
              >
                {purchase.status || "Received"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <Calendar className="h-3 w-3 shrink-0" />
              {formatDateTime(purchase.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 print:hidden shrink-0">
          <Button
            onClick={() => window.print()}
            className="gap-2 h-10 px-6 rounded-xl shadow-md shadow-primary/20 font-bold"
          >
            <Printer className="h-4 w-4" /> Print PO Statement
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 flex-1 min-h-0 items-stretch">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="lg:col-span-2 min-h-0 flex"
        >
          <Card className="border-2 shadow-sm w-full flex flex-col min-h-0 overflow-hidden">
            <CardHeader className="border-b bg-muted/10 py-4 px-5 shrink-0">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                Purchased Items (Stock Added)
                <span className="ml-auto text-[11px] font-semibold text-muted-foreground">
                  {purchase.items?.length || 0} item{purchase.items?.length === 1 ? "" : "s"}
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0 flex-1 min-h-0 overflow-y-auto sidebar-scroll">
              <table className="w-full text-sm text-left">
                <thead className="sticky top-0 bg-muted/40 backdrop-blur-md z-10 border-b">
                  <tr>
                    <th className="px-5 py-3 font-semibold text-muted-foreground">Product</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground">Variant</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground text-center">Qty</th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Unit Cost</th>
                    <th className="px-5 py-3 font-semibold text-muted-foreground text-right">Total Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {purchase.items?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-accent/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-sm">{item.name}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge variant="secondary" className="text-[10px]">
                          {item.variantLabel}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-center font-bold">{item.qty}</td>
                      <td className="px-4 py-3.5 text-right">{formatCurrency(item.costPrice)}</td>
                      <td className="px-5 py-3.5 text-right font-bold text-primary">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="min-h-0 flex flex-col gap-5"
        >
          <Card className="border-2 shadow-sm flex flex-col">
            <CardHeader className="border-b bg-muted/10 py-4 px-5 shrink-0">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Factory className="h-4 w-4 text-primary" />
                Supplier Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 flex-1 space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Company / Warehouse
                </p>
                <p className="font-bold text-sm leading-snug">{purchase.companyName}</p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Representative Name
                </p>
                <p className="font-semibold text-sm flex items-center gap-1.5 leading-snug">
                  <Truck className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span>{purchase.supplierName}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-sm flex flex-col flex-1">
            <CardHeader className="border-b bg-muted/10 py-4 px-5 shrink-0">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Banknote className="h-4 w-4 text-primary" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 flex-1 flex flex-col">
              <div className="space-y-3 flex-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{formatCurrency(purchase.subtotal)}</span>
                </div>

                {purchase.discount > 0 && (
                  <div className="flex justify-between text-sm text-destructive">
                    <span>Discount</span>
                    <span className="font-semibold">-{formatCurrency(purchase.discount)}</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between items-center py-1">
                  <span className="font-bold text-sm">Total Cost</span>
                  <span className="font-black text-xl text-primary leading-none">
                    {formatCurrency(purchase.totalAmount)}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-bold text-emerald-600">
                    {formatCurrency(purchase.paidAmount)}
                  </span>
                </div>

                {purchase.dueAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Payable (Udhaar)</span>
                    <span className="font-bold text-rose-600">
                      {formatCurrency(purchase.dueAmount)}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <span className="text-xs text-muted-foreground font-medium">Payment Method</span>
                <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] px-2.5 py-1 rounded-lg bg-muted">
                  {paymentIcon}
                  {purchase.paymentMethod}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}