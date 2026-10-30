"use client";

import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "@/store/actions/productActions";
import { fetchSales } from "@/store/actions/salesActions";
import { fetchShopkeepers } from "@/store/actions/shopkeeperActions";
import { fetchCredits } from "@/store/actions/creditActions";
import { fetchSuppliers } from "@/store/actions/supplierActions";
import { fetchPurchases } from "@/store/actions/purchaseActions";
import { fetchProfitLoss } from "@/store/actions/analyticsActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CreditCard,
  Zap,
  Package,
  Factory,
  Truck,
  Wallet,
  ArrowRight,
  Activity,
  CircleDollarSign,
  ShieldAlert,
  Receipt,
  CheckCircle2,
  Hash,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover/95 backdrop-blur-xl border-2 rounded-2xl shadow-2xl p-4 min-w-[180px] z-50 relative">
        <p className="text-xs font-black mb-3 pb-2.5 border-b border-dashed">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-6 text-xs mb-1.5 last:mb-0">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-muted-foreground font-semibold">{entry.name}</span>
            </div>
            <span className="font-black font-mono text-[11px]">{formatCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } } };

export default function DashboardPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { products } = useSelector((state) => state.products);
  const { sales } = useSelector((state) => state.sales);
  const { shopkeepers } = useSelector((state) => state.shopkeepers);
  const { credits } = useSelector((state) => state.credits);
  const { suppliers } = useSelector((state) => state.suppliers);
  const { purchases } = useSelector((state) => state.purchases);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      await Promise.all([
        dispatch(fetchProducts()),
        dispatch(fetchSales()),
        dispatch(fetchShopkeepers()),
        dispatch(fetchCredits()),
        dispatch(fetchSuppliers()),
        dispatch(fetchPurchases()),
        dispatch(fetchProfitLoss()),
      ]);
      setIsLoading(false);
    };
    load();
  }, [dispatch]);

  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalSpent = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
  const totalProfit = totalRevenue - totalSpent;
  const isProfitable = totalProfit >= 0;
  const totalReceivable = credits.reduce((sum, c) => sum + c.totalCredit, 0);
  const totalPayable = suppliers.reduce((sum, s) => sum + (s.totalPayable || 0), 0);

  const stockAlerts = useMemo(() => {
    const alerts = [];
    products.forEach((product) => {
      product.variants?.forEach((variant) => {
        if (variant.stock === 0) {
          alerts.push({ ...variant, productName: product.name, status: "out_of_stock" });
        } else if (variant.stock <= variant.minStock) {
          alerts.push({ ...variant, productName: product.name, status: "low_stock" });
        }
      });
    });
    return alerts.sort((a, b) => a.stock - b.stock);
  }, [products]);

  const outOfStockCount = stockAlerts.filter((a) => a.status === "out_of_stock").length;
  const lowStockCount = stockAlerts.filter((a) => a.status === "low_stock").length;

  const financialStats = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      desc: `${sales.length} total sales`,
      icon: TrendingUp,
      gradient: "from-emerald-500/15 via-emerald-500/5 to-transparent",
      iconBg: "bg-emerald-500/15",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500/20 hover:border-emerald-500/40",
      glow: "hover:shadow-emerald-500/5",
    },
    {
      title: "Total Expenses",
      value: formatCurrency(totalSpent),
      desc: `${purchases.length} purchases made`,
      icon: TrendingDown,
      gradient: "from-rose-500/15 via-rose-500/5 to-transparent",
      iconBg: "bg-rose-500/15",
      iconColor: "text-rose-600 dark:text-rose-400",
      border: "border-rose-500/20 hover:border-rose-500/40",
      glow: "hover:shadow-rose-500/5",
    },
    {
      title: "Net Profit",
      value: formatCurrency(Math.abs(totalProfit)),
      desc: isProfitable ? "Business is in profit" : "Business is at a loss",
      icon: isProfitable ? CircleDollarSign : ShieldAlert,
      gradient: isProfitable
        ? "from-violet-500/15 via-violet-500/5 to-transparent"
        : "from-red-500/15 via-red-500/5 to-transparent",
      iconBg: isProfitable ? "bg-violet-500/15" : "bg-red-500/15",
      iconColor: isProfitable ? "text-violet-600 dark:text-violet-400" : "text-red-600 dark:text-red-400",
      border: isProfitable ? "border-violet-500/20 hover:border-violet-500/40" : "border-red-500/20 hover:border-red-500/40",
      glow: isProfitable ? "hover:shadow-violet-500/5" : "hover:shadow-red-500/5",
      badge: isProfitable
        ? { text: "PROFIT", color: "bg-violet-500/10 text-violet-600 border-violet-500/20" }
        : { text: "LOSS", color: "bg-red-500/10 text-red-600 border-red-500/20" },
      prefix: isProfitable ? "+" : "-",
    },
    {
      title: "Receivable (Udhaar)",
      value: formatCurrency(totalReceivable),
      desc: "Owed by customers",
      icon: CreditCard,
      gradient: "from-blue-500/15 via-blue-500/5 to-transparent",
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-600 dark:text-blue-400",
      border: "border-blue-500/20 hover:border-blue-500/40",
      glow: "hover:shadow-blue-500/5",
    },
    {
      title: "Payable (Suppliers)",
      value: formatCurrency(totalPayable),
      desc: "Owed to suppliers",
      icon: Wallet,
      gradient: "from-orange-500/15 via-orange-500/5 to-transparent",
      iconBg: "bg-orange-500/15",
      iconColor: "text-orange-600 dark:text-orange-400",
      border: "border-orange-500/20 hover:border-orange-500/40",
      glow: "hover:shadow-orange-500/5",
    },
  ];

  const cashflowTrend = useMemo(() => {
    const days = {};
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayName = d.toLocaleDateString("en-us", { weekday: "short", day: "numeric" });
      days[dateStr] = { day: dayName, IN: 0, OUT: 0 };
    }
    sales.forEach((s) => {
      const d = (s.date || s.createdAt || "").toString().split("T")[0];
      if (days[d]) days[d].IN += s.totalAmount;
    });
    purchases.forEach((p) => {
      const d = (p.createdAt || "").toString().split("T")[0];
      if (days[d]) days[d].OUT += p.totalAmount;
    });
    return Object.values(days);
  }, [sales, purchases]);

  const recentSales = [...sales].slice(0, 3);
  const recentPurchases = [...purchases].slice(0, 3);
  const topAlerts = stockAlerts.slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-primary/20 border-t-primary" />
          <p className="text-xs font-bold text-muted-foreground animate-pulse">Loading dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full min-h-0 overflow-y-auto sidebar-scroll pb-8 pr-1">

      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="shrink-0">
        <Card className="border-2 shadow-sm bg-gradient-to-r from-card via-card to-primary/[0.02] overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0 shadow-sm shadow-primary/10">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight flex items-center gap-2.5">
                  Dashboard
                  <span className="flex h-5 items-center rounded-full bg-emerald-500/10 px-2.5 text-[10px] font-black text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 animate-pulse">
                    LIVE
                  </span>
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5 font-semibold">
                  Real-time snapshot of your business health
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Button variant="outline" size="sm" className="h-10 px-4 rounded-xl gap-2 font-bold border-2 hover:border-primary/30 transition-all" onClick={() => router.push("/purchases/add")}>
                <Truck className="h-4 w-4" /> Stock In
              </Button>
              <Button size="sm" className="h-10 px-5 rounded-xl gap-2 font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all" onClick={() => router.push("/pos")}>
                <Zap className="h-4 w-4" /> Quick Sale
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* FINANCIAL STAT CARDS */}
      <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 shrink-0">
        {financialStats.map((stat) => (
          <motion.div key={stat.title} variants={fadeUp}>
            <Card className={cn(
              "relative overflow-hidden border-2 bg-gradient-to-br h-full transition-all duration-300 hover:shadow-xl group",
              stat.border, stat.gradient, stat.glow
            )}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-current opacity-[0.03] rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl transition-transform group-hover:scale-110", stat.iconBg)}>
                    <stat.icon className={cn("h-5 w-5", stat.iconColor)} />
                  </div>
                  {stat.badge && (
                    <Badge variant="outline" className={cn("text-[9px] font-black px-2 py-0.5 border", stat.badge.color)}>
                      {stat.badge.text}
                    </Badge>
                  )}
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.08em]">{stat.title}</p>
                  <p className="text-[22px] font-black tracking-tight leading-none">
                    {stat.prefix && (
                      <span className={stat.prefix === "+" ? "text-violet-600 dark:text-violet-400" : "text-red-600 dark:text-red-400"}>
                        {stat.prefix}
                      </span>
                    )}
                    {stat.value}
                  </p>
                  <p className="text-[10px] font-semibold text-muted-foreground/70">{stat.desc}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* QUICK COUNT ROW */}
      <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-4 gap-4 shrink-0">
        {[
          { title: "Products", value: products.length, icon: Package, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10", route: "/products" },
          { title: "Customers", value: shopkeepers.length, icon: Users, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", route: "/shopkeepers" },
          { title: "Suppliers", value: suppliers.length, icon: Factory, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/10", route: "/suppliers" },
          { title: "Stock Issues", value: outOfStockCount + lowStockCount, icon: AlertTriangle, color: outOfStockCount + lowStockCount > 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400", bg: outOfStockCount + lowStockCount > 0 ? "bg-red-500/10" : "bg-emerald-500/10", route: "/products" },
        ].map((stat) => (
          <motion.div key={stat.title} variants={fadeUp} onClick={() => router.push(stat.route)} className="cursor-pointer group">
            <Card className="h-full border-2 shadow-sm hover:border-primary/30 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.08em]">{stat.title}</p>
                  <p className="text-2xl font-black mt-1 tracking-tight">{stat.value}</p>
                </div>
                <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl shrink-0 transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* CURVED AREA CHART */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="shrink-0">
        <Card className="w-full border-2 shadow-sm overflow-hidden">
          <CardHeader className="pb-0 border-b bg-gradient-to-r from-muted/30 to-transparent px-6 py-5 flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-sm font-black flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                Cash Flow Trend
              </CardTitle>
              <p className="text-[11px] text-muted-foreground mt-1.5 font-medium ml-[42px]">
                Revenue vs expenses over the last 7 days
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-muted-foreground">Sales</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                <span className="text-[10px] font-bold text-muted-foreground">Purchases</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 pb-2 px-2 sm:px-4 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashflowTrend} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="cashInGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="cashOutGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 10, fontFamily: "monospace", fontWeight: 600 }} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} axisLine={false} tickLine={false} dx={-5} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="IN" stroke="#10b981" strokeWidth={2.5} fill="url(#cashInGrad)" name="Cash In (Sales)" dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }} />
                <Area type="monotone" dataKey="OUT" stroke="#f43f5e" strokeWidth={2.5} fill="url(#cashOutGrad)" name="Cash Out (Purchases)" dot={{ r: 4, fill: "#f43f5e", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6, fill: "#f43f5e", strokeWidth: 2, stroke: "#fff" }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* BOTTOM 3 CARDS */}
      <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-3 gap-5 shrink-0">

        {/* Recent Sales */}
        <motion.div variants={fadeUp} className="flex">
          <Card className="w-full flex flex-col border-2 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <CardHeader className="border-b bg-gradient-to-r from-emerald-500/5 to-transparent py-3.5 px-5 shrink-0 space-y-0">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10">
                    <Receipt className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-black leading-tight">Recent Sales</CardTitle>
                    <p className="text-[10px] text-muted-foreground font-semibold">{sales.length} total</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-[11px] font-bold text-muted-foreground hover:text-emerald-600 rounded-lg px-2.5 shrink-0" onClick={() => router.push("/sales")}>
                  View All <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <div className="divide-y">
                {recentSales.length === 0 ? (
                  <div className="p-10 text-center flex flex-col items-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground mb-3">
                      <ShoppingCart className="h-7 w-7" />
                    </div>
                    <p className="text-sm font-bold">No sales yet</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Start selling from POS</p>
                  </div>
                ) : (
                  recentSales.map((sale, i) => (
                    <motion.div key={sale._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 px-5 py-3.5 hover:bg-emerald-500/[0.03] transition-colors group cursor-pointer" onClick={() => router.push("/sales")}>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-black shrink-0 group-hover:scale-105 transition-transform">
                        {sale.shopkeeperName?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "??"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold truncate">{sale.shopkeeperName}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Hash className="h-3 w-3 text-muted-foreground/50" />
                          <p className="text-[10px] text-muted-foreground font-mono font-semibold">{sale.invoiceNo}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 flex flex-col items-end gap-1">
                        <p className="text-[13px] font-black text-emerald-600 dark:text-emerald-400 font-mono">
                          +{formatCurrency(sale.totalAmount)}
                        </p>
                        <Badge variant="outline" className={cn(
                          "text-[9px] px-2 py-0 font-bold uppercase border",
                          sale.status === "paid" ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/20" :
                          sale.status === "partial" ? "bg-amber-500/5 text-amber-600 border-amber-500/20" :
                          "bg-red-500/5 text-red-600 border-red-500/20"
                        )}>
                          {sale.status}
                        </Badge>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stock Purchases */}
        <motion.div variants={fadeUp} className="flex">
          <Card className="w-full flex flex-col border-2 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <CardHeader className="border-b bg-gradient-to-r from-rose-500/5 to-transparent py-3.5 px-5 shrink-0 space-y-0">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/10">
                    <Truck className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-black leading-tight">Stock Purchases</CardTitle>
                    <p className="text-[10px] text-muted-foreground font-semibold">{purchases.length} total</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-[11px] font-bold text-muted-foreground hover:text-rose-600 rounded-lg px-2.5 shrink-0" onClick={() => router.push("/purchases")}>
                  View All <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <div className="divide-y">
                {recentPurchases.length === 0 ? (
                  <div className="p-10 text-center flex flex-col items-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground mb-3">
                      <Truck className="h-7 w-7" />
                    </div>
                    <p className="text-sm font-bold">No purchases yet</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Add stock from Purchases</p>
                  </div>
                ) : (
                  recentPurchases.map((po, i) => (
                    <motion.div key={po._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 px-5 py-3.5 hover:bg-rose-500/[0.03] transition-colors group cursor-pointer" onClick={() => router.push("/purchases")}>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0 group-hover:scale-105 transition-transform">
                        <Factory className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold truncate">{po.companyName}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Hash className="h-3 w-3 text-muted-foreground/50" />
                          <p className="text-[10px] text-muted-foreground font-mono font-semibold">{po.poNumber}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 flex flex-col items-end gap-1">
                        <p className="text-[13px] font-black text-rose-600 dark:text-rose-400 font-mono">
                          -{formatCurrency(po.totalAmount)}
                        </p>
                        <Badge variant="outline" className={cn(
                          "text-[9px] px-2 py-0 font-bold uppercase border",
                          po.paymentMethod === "cash" ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/20" :
                          po.paymentMethod === "credit" ? "bg-orange-500/5 text-orange-600 border-orange-500/20" :
                          "bg-blue-500/5 text-blue-600 border-blue-500/20"
                        )}>
                          {po.paymentMethod}
                        </Badge>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stock Alerts */}
        <motion.div variants={fadeUp} className="flex">
          <Card className="w-full flex flex-col border-2 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <CardHeader className="border-b bg-gradient-to-r from-amber-500/5 to-transparent py-3.5 px-5 shrink-0 space-y-0">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10">
                    <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-black leading-tight">Stock Alerts</CardTitle>
                    <p className="text-[10px] text-muted-foreground font-semibold">{outOfStockCount} out, {lowStockCount} low</p>
                  </div>
                </div>
                {(outOfStockCount + lowStockCount) > 0 ? (
                  <Badge className="h-6 px-2.5 font-black shadow-sm bg-red-500 hover:bg-red-600 text-white text-[11px] shrink-0">
                    {outOfStockCount + lowStockCount}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="h-6 px-2.5 font-black text-[11px] shrink-0 bg-emerald-500/5 text-emerald-600 border-emerald-500/20">
                    OK
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <div className="divide-y">
                {topAlerts.length === 0 ? (
                  <div className="p-10 text-center flex flex-col items-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-3">
                      <CheckCircle2 className="h-7 w-7" />
                    </div>
                    <p className="text-sm font-black text-emerald-700 dark:text-emerald-400">All stock healthy</p>
                    <p className="text-[10px] text-muted-foreground mt-1 font-medium">No items running low right now</p>
                  </div>
                ) : (
                  topAlerts.map((alert, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 px-5 py-3.5 hover:bg-amber-500/[0.03] transition-colors group">
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl shrink-0 group-hover:scale-105 transition-transform",
                        alert.status === "out_of_stock" ? "bg-red-500/10 text-red-600 dark:text-red-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      )}>
                        <Package className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold truncate">{alert.productName}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-muted-foreground font-semibold">{alert.label}</span>
                          <span className="text-muted-foreground/30">|</span>
                          <span className="text-[10px] font-mono font-bold">
                            <span className={alert.stock === 0 ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400"}>{alert.stock}</span>
                            <span className="text-muted-foreground/50">/{alert.minStock}</span>
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className={cn(
                        "text-[9px] font-black shrink-0 px-2.5 py-0.5 border",
                        alert.status === "out_of_stock"
                          ? "bg-red-500/5 text-red-700 dark:text-red-400 border-red-500/20"
                          : "bg-amber-500/5 text-amber-700 dark:text-amber-400 border-amber-500/20"
                      )}>
                        {alert.status === "out_of_stock" ? "OUT OF STOCK" : "LOW STOCK"}
                      </Badge>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}