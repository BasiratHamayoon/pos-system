"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { formatCurrency, formatDate, formatDateTime, cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Printer,
  Receipt,
  User,
  MapPin,
  Phone,
  Store,
  AlertCircle,
  Banknote,
  CreditCard,
  ArrowRightLeft,
  Calendar,
  Hash,
} from "lucide-react";
import { motion } from "framer-motion";

export default function SaleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const saleId = params?.id;

  const { sales } = useSelector((state) => state.sales);
  const { invoices } = useSelector((state) => state.invoices);
  const { shopkeepers } = useSelector((state) => state.shopkeepers);
  const { storeInfo } = useSelector((state) => state.settings);

  const sale = useMemo(() => {
    if (!saleId) return null;
    return sales.find((s) => String(s.id) === String(saleId)) || null;
  }, [sales, saleId]);

  const invoice = useMemo(() => {
    if (!sale) return null;
    return (
      invoices.find((inv) => inv.invoiceNo === sale.invoiceNo) ||
      invoices.find((inv) => inv.id === sale.id) ||
      null
    );
  }, [invoices, sale]);

  const shopkeeper = useMemo(() => {
    if (!sale?.shopkeeperId) return null;
    return shopkeepers.find((s) => s.id === sale.shopkeeperId) || null;
  }, [shopkeepers, sale]);

  const display = useMemo(() => {
    if (!sale) return null;

    return {
      invoiceNo: sale.invoiceNo,
      date: invoice?.date || sale.date,
      status: sale.status,
      paymentMethod: sale.paymentMethod,
      shopkeeperName:
        invoice?.shopkeeperName || sale.shopkeeperName || "Walk-in Customer",
      shopName: invoice?.shopName || shopkeeper?.shopName || "Walk-in",
      phone: invoice?.phone || shopkeeper?.phone || "",
      address: invoice?.address || shopkeeper?.address || "",
      items: invoice?.items || [],
      itemsCount: sale.items || invoice?.items?.length || 0,
      subtotal: invoice?.subtotal ?? sale.totalAmount,
      discount: invoice?.discount ?? 0,
      discountPercent: invoice?.discountPercent ?? 0,
      totalAmount: sale.totalAmount,
      paidAmount: sale.paidAmount,
      creditAmount: sale.creditAmount,
    };
  }, [sale, invoice, shopkeeper]);

  if (!sale || !display) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
          <AlertCircle className="h-7 w-7 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold">Transaction Not Found</h2>
        <p className="text-xs text-muted-foreground">
          This sale record does not exist or was removed.
        </p>
        <Button
          variant="outline"
          onClick={() => router.push("/sales")}
          className="mt-2 rounded-xl"
        >
          Return to Sales
        </Button>
      </div>
    );
  }

  const paymentIcon =
    display.paymentMethod === "cash" ? (
      <Banknote className="h-3.5 w-3.5" />
    ) : display.paymentMethod === "partial" ? (
      <ArrowRightLeft className="h-3.5 w-3.5" />
    ) : (
      <CreditCard className="h-3.5 w-3.5" />
    );

  return (
    <div className="flex flex-col gap-5 h-full min-h-0 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0"
      >
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => router.push("/sales")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight truncate">
                {display.invoiceNo}
              </h1>
              <Badge
                variant="secondary"
                className={cn(
                  "font-bold shrink-0",
                  display.status === "completed"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : display.status === "pending"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                )}
              >
                {display.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <Calendar className="h-3 w-3 shrink-0" />
              {display.date?.includes("T")
                ? formatDateTime(display.date)
                : formatDate(display.date)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 print:hidden shrink-0">
          <Button
            variant="outline"
            onClick={() => router.push("/pos")}
            className="gap-2 h-10 px-4 rounded-xl"
          >
            <Receipt className="h-4 w-4" />
            New Sale
          </Button>
          <Button
            onClick={() => window.print()}
            className="gap-2 h-10 px-4 rounded-xl"
          >
            <Printer className="h-4 w-4" />
            Print
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
                <Receipt className="h-4 w-4 text-primary" />
                Order Items
                <span className="ml-auto text-[11px] font-semibold text-muted-foreground">
                  {display.itemsCount} item{display.itemsCount === 1 ? "" : "s"}
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0 flex-1 min-h-0 overflow-y-auto sidebar-scroll">
              {display.items.length > 0 ? (
                <table className="w-full text-sm text-left">
                  <thead className="sticky top-0 bg-muted/40 backdrop-blur-md z-10 border-b">
                    <tr>
                      <th className="px-5 py-3 font-semibold text-muted-foreground">
                        Product
                      </th>
                      <th className="px-4 py-3 font-semibold text-muted-foreground text-center w-20">
                        Qty
                      </th>
                      <th className="px-4 py-3 font-semibold text-muted-foreground text-right w-28">
                        Price
                      </th>
                      <th className="px-5 py-3 font-semibold text-muted-foreground text-right w-28">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {display.items.map((item, idx) => (
                      <tr
                        key={item.productId || idx}
                        className="hover:bg-accent/30 transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <p className="font-bold text-sm">{item.name}</p>
                          <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                            CODE: {item.code || `31${idx}`}
                          </p>
                        </td>
                        <td className="px-4 py-3.5 text-center font-bold">
                          {item.qty}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="px-5 py-3.5 text-right font-bold">
                          {formatCurrency(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="h-full min-h-[280px] flex flex-col items-center justify-center p-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted mb-3">
                    <Receipt className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-semibold mb-1">
                    Itemized list not available
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    This sale has {display.itemsCount} item
                    {display.itemsCount === 1 ? "" : "s"} recorded in summary.
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 text-xs font-bold">
                    <Hash className="h-3.5 w-3.5" />
                    {display.itemsCount} Items • {formatCurrency(display.totalAmount)}
                  </div>
                </div>
              )}
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
                <User className="h-4 w-4 text-primary" />
                Customer Info
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 flex-1 space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Name
                </p>
                <p className="font-bold text-sm leading-snug">
                  {display.shopkeeperName}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Shop Details
                </p>
                <p className="font-semibold text-sm flex items-center gap-1.5 leading-snug">
                  <Store className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate">
                    {display.shopName && display.shopName !== "Walk-in"
                      ? display.shopName
                      : "Walk-in Customer"}
                  </span>
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Contact
                </p>
                <p className="font-semibold text-sm flex items-center gap-1.5 leading-snug">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span>{display.phone || "N/A"}</span>
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Address
                </p>
                <p className="font-semibold text-sm flex items-start gap-1.5 leading-snug">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                  <span>{display.address || "N/A"}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-sm flex flex-col flex-1">
            <CardHeader className="border-b bg-muted/10 py-4 px-5 shrink-0">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Receipt className="h-4 w-4 text-primary" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 flex-1 flex flex-col">
              <div className="space-y-3 flex-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">
                    {formatCurrency(display.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Discount
                    {display.discountPercent
                      ? ` (${display.discountPercent}%)`
                      : ""}
                  </span>
                  <span
                    className={cn(
                      "font-semibold",
                      display.discount > 0 && "text-destructive"
                    )}
                  >
                    {display.discount > 0
                      ? `-${formatCurrency(display.discount)}`
                      : formatCurrency(0)}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between items-center py-1">
                  <span className="font-bold text-sm">Grand Total</span>
                  <span className="font-black text-xl text-primary leading-none">
                    {formatCurrency(display.totalAmount)}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-bold text-emerald-600">
                    {formatCurrency(display.paidAmount)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Added to Credit</span>
                  <span
                    className={cn(
                      "font-bold",
                      display.creditAmount > 0
                        ? "text-orange-600"
                        : "text-muted-foreground"
                    )}
                  >
                    {formatCurrency(display.creditAmount)}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <span className="text-xs text-muted-foreground font-medium">
                  Payment Method
                </span>
                <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] px-2.5 py-1 rounded-lg bg-muted">
                  {paymentIcon}
                  {display.paymentMethod}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-sm bg-muted/20 shrink-0">
            <CardContent className="p-4">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                Store
              </p>
              <p className="text-sm font-bold leading-snug">
                {storeInfo?.name || "StorePOS"}
              </p>
              <p className="text-xs text-muted-foreground mt-1 leading-snug">
                {storeInfo?.address || "N/A"}
              </p>
              <p className="text-xs text-muted-foreground leading-snug">
                {storeInfo?.phone || "N/A"}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}