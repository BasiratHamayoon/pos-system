"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Phone,
  MapPin,
  Calendar,
  ShoppingCart,
  DollarSign,
  CreditCard,
  AlertTriangle,
  Eye,
  TrendingUp,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Receipt,
  HandCoins,
  BadgeCheck,
  Loader2,
  Store,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchShopkeeperHistory } from "@/store/actions/shopkeeperActions";

export default function ShopkeeperDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchShopkeeperHistory(params.id);
        setData(res);
      } catch (err) {
        setError(err.message || "Failed to load shopkeeper history");
      } finally {
        setLoading(false);
      }
    };
    if (params.id) load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <XCircle className="h-12 w-12 text-destructive" />
        <p className="text-destructive font-medium">{error || "Shopkeeper not found"}</p>
        <Button variant="outline" onClick={() => router.push("/shopkeepers")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Shopkeepers
        </Button>
      </div>
    );
  }

  const { shopkeeper, stats, sales, payments, topProducts, timeline } = data;
  const initials = shopkeeper.name
    ? shopkeeper.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "SK";

  const fmt = (n) =>
    new Intl.NumberFormat("en-PK", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n || 0);

  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  const fmtDateTime = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/shopkeepers")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Shopkeeper Detail</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                {initials}
              </div>
              <div>
                <h2 className="text-xl font-bold">{shopkeeper.name}</h2>
                {shopkeeper.shopName && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Store className="h-3.5 w-3.5" /> {shopkeeper.shopName}
                  </p>
                )}
              </div>
            </div>

          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" /> {shopkeeper.phone || "No phone"}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" /> {shopkeeper.address || "No address"}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" /> Customer since {fmtDate(shopkeeper.createdAt)}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Sales</p>
                <p className="text-2xl font-bold mt-1">{stats.totalSales || 0}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Business</p>
                <p className="text-2xl font-bold mt-1">Rs {fmt(stats.totalSpent)}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-violet-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Paid</p>
                <p className="text-2xl font-bold mt-1 text-emerald-600">Rs {fmt(stats.totalPaid)}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Outstanding</p>
                <p className={`text-2xl font-bold mt-1 ${stats.outstandingCredit > 0 ? "text-red-500" : "text-emerald-600"}`}>
                  Rs {fmt(stats.outstandingCredit)}
                </p>
              </div>
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stats.outstandingCredit > 0 ? "bg-red-500/10" : "bg-emerald-500/10"}`}>
                <AlertTriangle className={`h-5 w-5 ${stats.outstandingCredit > 0 ? "text-red-500" : "text-emerald-500"}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="overflow-x-auto pb-1 -mx-1 px-1">
          <TabsList className="inline-flex w-auto h-11 bg-muted/60 p-1 rounded-xl gap-1">
            <TabsTrigger
              value="overview"
              className="rounded-lg px-4 text-xs font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground whitespace-nowrap"
            >
              <Activity className="h-3.5 w-3.5 mr-1.5" /> Overview
            </TabsTrigger>
            <TabsTrigger
              value="sales"
              className="rounded-lg px-4 text-xs font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground whitespace-nowrap"
            >
              <ShoppingCart className="h-3.5 w-3.5 mr-1.5" /> Sales
            </TabsTrigger>
            <TabsTrigger
              value="credit"
              className="rounded-lg px-4 text-xs font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground whitespace-nowrap"
            >
              <CreditCard className="h-3.5 w-3.5 mr-1.5" /> Credit
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="rounded-lg px-4 text-xs font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground whitespace-nowrap"
            >
              <Package className="h-3.5 w-3.5 mr-1.5" /> Products
            </TabsTrigger>
            <TabsTrigger
              value="timeline"
              className="rounded-lg px-4 text-xs font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground whitespace-nowrap"
            >
              <Clock className="h-3.5 w-3.5 mr-1.5" /> Timeline
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-4 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Receipt className="h-4 w-4" /> Invoice Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-emerald-500" /> Paid
                  </span>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    {stats.paidInvoices || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" /> Partial
                  </span>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    {stats.partialInvoices || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" /> Unpaid
                  </span>
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    {stats.unpaidInvoices || 0}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4" /> Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Credit Given</span>
                  <span className="font-semibold">Rs {fmt(stats.totalCreditGiven)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Credit Paid</span>
                  <span className="font-semibold text-emerald-600">Rs {fmt(stats.totalCreditPaid)}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm font-medium">Outstanding Balance</span>
                  <span className={`font-bold ${stats.outstandingCredit > 0 ? "text-red-500" : "text-emerald-600"}`}>
                    Rs {fmt(stats.outstandingCredit)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4" /> Recent Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sales && sales.length > 0 ? (
                <div className="space-y-2">
                  {sales.slice(0, 5).map((sale) => (
                    <div
                      key={sale._id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/sales/${sale._id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-blue-500/10 flex items-center justify-center">
                          <Receipt className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">INV-{sale._id.slice(-6).toUpperCase()}</p>
                          <p className="text-xs text-muted-foreground">{fmtDate(sale.createdAt)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">Rs {fmt(sale.totalAmount)}</p>
                        <Badge
                          variant="outline"
                          className={
                            sale.status === "paid"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]"
                              : sale.status === "partial"
                              ? "bg-amber-50 text-amber-700 border-amber-200 text-[10px]"
                              : "bg-red-50 text-red-700 border-red-200 text-[10px]"
                          }
                        >
                          {sale.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">No sales yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" /> All Sales ({sales?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sales && sales.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-center">Items</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Paid</TableHead>
                        <TableHead className="text-right">Credit</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sales.map((sale) => (
                        <TableRow key={sale._id}>
                          <TableCell className="font-medium text-sm">INV-{sale._id.slice(-6).toUpperCase()}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{fmtDate(sale.createdAt)}</TableCell>
                          <TableCell className="text-center text-sm">{sale.items?.length || 0}</TableCell>
                          <TableCell className="text-right font-medium text-sm">Rs {fmt(sale.totalAmount)}</TableCell>
                          <TableCell className="text-right text-sm text-emerald-600">Rs {fmt(sale.paidAmount)}</TableCell>
                          <TableCell className="text-right text-sm text-red-500">Rs {fmt(sale.creditAmount)}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                sale.status === "paid"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : sale.status === "partial"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                              }
                            >
                              {sale.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-primary hover:bg-primary/10"
                              onClick={() => router.push(`/sales/${sale._id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No sales found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credit" className="space-y-4 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Outstanding Credit</p>
                    <p className={`text-3xl font-bold mt-1 ${stats.outstandingCredit > 0 ? "text-red-500" : "text-emerald-600"}`}>
                      Rs {fmt(stats.outstandingCredit)}
                    </p>
                  </div>
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${stats.outstandingCredit > 0 ? "bg-red-500/10" : "bg-emerald-500/10"}`}>
                    <AlertTriangle className={`h-6 w-6 ${stats.outstandingCredit > 0 ? "text-red-500" : "text-emerald-500"}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Credit Collected</p>
                    <p className="text-3xl font-bold mt-1 text-emerald-600">Rs {fmt(stats.totalCreditPaid)}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <HandCoins className="h-6 w-6 text-emerald-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Credit Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const openInvoices = sales?.filter((s) => s.creditAmount > 0) || [];
                const hasActivity = openInvoices.length > 0 || (payments && payments.length > 0);
                if (!hasActivity) return <p className="text-sm text-muted-foreground text-center py-6">No credit activity</p>;
                return (
                  <div className="space-y-3">
                    {openInvoices.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Open Credit Invoices</p>
                        {openInvoices.map((sale) => (
                          <div key={sale._id} className="flex items-center justify-between p-3 rounded-lg border bg-red-50/50 mb-2">
                            <div>
                              <p className="text-sm font-medium">INV-{sale._id.slice(-6).toUpperCase()}</p>
                              <p className="text-xs text-muted-foreground">{fmtDate(sale.createdAt)}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-red-500">Rs {fmt(sale.creditAmount)}</p>
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px]">{sale.status}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {payments && payments.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Payments Received</p>
                        {payments.map((p) => (
                          <div key={p._id} className="flex items-center justify-between p-3 rounded-lg border bg-emerald-50/50 mb-2">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              <div>
                                <p className="text-sm font-medium">Payment Received</p>
                                <p className="text-xs text-muted-foreground">{fmtDateTime(p.createdAt)}</p>
                              </div>
                            </div>
                            <p className="text-sm font-bold text-emerald-600">+ Rs {fmt(p.amount)}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4" /> Top Products by Spend
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topProducts && topProducts.length > 0 ? (
                <div className="space-y-4">
                  {topProducts.map((product, idx) => {
                    const maxTotal = topProducts[0]?.total || 1;
                    const pct = (product.total / maxTotal) * 100;
                    const rankColors =
                      idx === 0 ? "text-yellow-600 bg-yellow-50 border-yellow-200"
                        : idx === 1 ? "text-gray-500 bg-gray-50 border-gray-200"
                        : idx === 2 ? "text-orange-600 bg-orange-50 border-orange-200"
                        : "text-muted-foreground bg-muted/50 border-border";
                    const barColor =
                      idx === 0 ? "bg-yellow-400"
                        : idx === 1 ? "bg-gray-400"
                        : idx === 2 ? "bg-orange-400"
                        : "bg-primary/60";
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`h-7 w-7 rounded-full border flex items-center justify-center text-xs font-bold ${rankColors}`}>
                              {idx + 1}
                            </span>
                            <div>
                              <p className="text-sm font-medium">{product.productName}</p>
                              <p className="text-xs text-muted-foreground">{product.quantity} units sold</p>
                            </div>
                          </div>
                          <p className="text-sm font-bold">Rs {fmt(product.total)}</p>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden ml-10">
                          <motion.div
                            className={`h-full rounded-full ${barColor}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No product data yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" /> Activity Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              {timeline && timeline.length > 0 ? (
                <div className="relative ml-3">
                  <div className="absolute left-0 top-2 bottom-2 w-px bg-border" />
                  <div className="space-y-6">
                    {timeline.map((event, idx) => (
                      <motion.div
                        key={`${event.type}-${event.refId}-${idx}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="relative pl-8"
                      >
                        <div className={`absolute left-0 top-1.5 h-3 w-3 rounded-full border-2 border-background -translate-x-[5px] ${event.type === "sale" ? "bg-blue-500" : "bg-emerald-500"}`} />
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge
                                variant="outline"
                                className={event.type === "sale" ? "bg-blue-50 text-blue-700 border-blue-200 text-[10px]" : "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]"}
                              >
                                {event.type === "sale" ? "SALE" : "PAYMENT"}
                              </Badge>
                              {event.type === "sale" && event.status && (
                                <Badge
                                  variant="outline"
                                  className={
                                    event.status === "paid" ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]"
                                      : event.status === "partial" ? "bg-amber-50 text-amber-700 border-amber-200 text-[10px]"
                                      : "bg-red-50 text-red-700 border-red-200 text-[10px]"
                                  }
                                >
                                  {event.status}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm font-medium">
                              {event.type === "sale" ? `Invoice INV-${event.refId?.slice(-6).toUpperCase() || "N/A"}` : "Payment Received"}
                            </p>
                            <p className="text-xs text-muted-foreground">{fmtDateTime(event.date)}</p>
                          </div>
                          <p className={`text-sm font-bold whitespace-nowrap ${event.type === "sale" ? "text-foreground" : "text-emerald-600"}`}>
                            {event.type === "sale" ? "" : "+"}Rs {fmt(event.amount)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No activity yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}