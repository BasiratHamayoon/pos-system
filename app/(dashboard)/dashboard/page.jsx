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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  AlertTriangle,
  CreditCard,
  Zap,
  Package,
  Factory,
  Truck,
  Wallet,
  ArrowRight,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border rounded-xl shadow-xl p-3 min-w-[160px] z-50 relative">
        <p className="text-xs font-bold mb-2 pb-2 border-b">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4 text-xs mb-1 last:mb-0">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-muted-foreground font-medium">{entry.name}:</span>
            </div>
            <span className="font-bold font-mono text-[11px]">
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

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
    const loadDashboardData = async () => {
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
    loadDashboardData();
  }, [dispatch]);

  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalSpent = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
  const totalReceivable = credits.reduce((sum, c) => sum + c.totalCredit, 0);
  const totalPayable = suppliers.reduce((sum, s) => sum + (s.totalPayable || 0), 0);
  
  const stockAlerts = useMemo(() => {
    const alerts = [];
    products.forEach(product => {
      product.variants?.forEach(variant => {
        if (variant.stock === 0) {
          alerts.push({ ...variant, productName: product.name, status: "out_of_stock" });
        } else if (variant.stock <= variant.minStock) {
          alerts.push({ ...variant, productName: product.name, status: "low_stock" });
        }
      });
    });
    return alerts.sort((a, b) => a.stock - b.stock);
  }, [products]);

  const outOfStockCount = stockAlerts.filter(a => a.status === "out_of_stock").length;
  const lowStockCount = stockAlerts.filter(a => a.status === "low_stock").length;

  const financialStats = [
    {
      title: "Revenue",
      value: formatCurrency(totalRevenue),
      desc: "Total incoming cashflow",
      icon: TrendingUp,
      gradient: "from-emerald-500/10 to-teal-500/5",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500/20"
    },
    {
      title: "Expenses",
      value: formatCurrency(totalSpent),
      desc: "Total stock purchases",
      icon: TrendingDown,
      gradient: "from-rose-500/10 to-red-500/5",
      iconBg: "bg-rose-500/10",
      iconColor: "text-rose-600 dark:text-rose-400",
      border: "border-rose-500/20"
    },
    {
      title: "Receivable (Udhaar)",
      value: formatCurrency(totalReceivable),
      desc: "Money owed by customers",
      icon: CreditCard,
      gradient: "from-blue-500/10 to-cyan-500/5",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
      border: "border-blue-500/20"
    },
    {
      title: "Payable (To Suppliers)",
      value: formatCurrency(totalPayable),
      desc: "Money owed to suppliers",
      icon: Wallet,
      gradient: "from-orange-500/10 to-amber-500/5",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-600 dark:text-orange-400",
      border: "border-orange-500/20"
    },
  ];

  const recentSales = [...sales].slice(0, 8);
  const recentPurchases = [...purchases].slice(0, 8);
  const topAlerts = stockAlerts.slice(0, 8);

  const cashflowTrend = useMemo(() => {
    const days = {};
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayName = d.toLocaleString('en-us', { weekday: 'short' });
      days[dateStr] = { day: dayName, IN: 0, OUT: 0 };
    }
    sales.forEach(s => {
      const d = (s.date || s.createdAt || "").toString().split("T")[0];
      if (days[d]) days[d].IN += s.totalAmount;
    });
    purchases.forEach(p => {
      const d = (p.createdAt || "").toString().split("T")[0];
      if (days[d]) days[d].OUT += p.totalAmount;
    });
    return Object.values(days);
  }, [sales, purchases]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full min-h-0 overflow-y-auto sidebar-scroll pb-6 pr-1">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 bg-card p-5 rounded-2xl border shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              Store Dashboard
              <span className="flex h-5 items-center rounded-full bg-emerald-500/10 px-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">LIVE</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5 font-medium">
              Real-time snapshot of your business health
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-10 px-4 rounded-xl gap-2 font-bold" onClick={() => router.push("/purchases/add")}>
            <Truck className="h-4 w-4" /> Stock In
          </Button>
          <Button size="sm" className="h-10 px-4 rounded-xl gap-2 font-bold shadow-md shadow-primary/20" onClick={() => router.push("/pos")}>
            <Zap className="h-4 w-4" /> Quick Sale
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 shrink-0">
        {financialStats.map((stat, index) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <Card className={`relative overflow-hidden border-2 ${stat.border} bg-gradient-to-br ${stat.gradient} h-full`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider truncate">{stat.title}</p>
                  <p className="text-2xl font-black tracking-tight truncate">{stat.value}</p>
                  <p className="text-[10px] font-medium text-muted-foreground opacity-80">{stat.desc}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 shrink-0">
        {[
          { title: "Products", value: products.length, icon: Package, color: "text-blue-600", bg: "bg-blue-500/10", route: "/products" },
          { title: "Customers", value: shopkeepers.length, icon: Users, color: "text-emerald-600", bg: "bg-emerald-500/10", route: "/shopkeepers" },
          { title: "Suppliers", value: suppliers.length, icon: Factory, color: "text-purple-600", bg: "bg-purple-500/10", route: "/suppliers" },
          { title: "Stock Issues", value: outOfStockCount + lowStockCount, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-500/10", route: "/products" },
        ].map((stat, i) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }} onClick={() => router.push(stat.route)} className="cursor-pointer hover:scale-[1.02] transition-transform">
            <Card className="h-full border shadow-sm hover:border-primary/30 transition-colors">
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{stat.title}</p>
                  <p className="text-xl font-black mt-0.5">{stat.value}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} ${stat.color} shrink-0`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="shrink-0">
        <Card className="w-full border-2 shadow-sm">
          <CardHeader className="pb-2 border-b bg-muted/10 px-5 py-4 flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" /> Cash Flow (Last 7 Days)
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Comparing incoming sales revenue vs outgoing purchase costs</p>
            </div>
          </CardHeader>
          <CardContent className="pt-4 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashflowTrend} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="inGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.65 0.17 155)" stopOpacity={1} />
                    <stop offset="100%" stopColor="oklch(0.65 0.17 155)" stopOpacity={0.4} />
                  </linearGradient>
                  <linearGradient id="outGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.60 0.23 25)" stopOpacity={1} />
                    <stop offset="100%" stopColor="oklch(0.60 0.23 25)" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.6} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 11, fontFamily: 'monospace' }} tickFormatter={(v) => `Rs${v/1000}k`} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.3 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '10px' }} />
                <Bar dataKey="IN" fill="url(#inGrad)" radius={[4, 4, 0, 0]} name="Cash In (Sales)" maxBarSize={35} />
                <Bar dataKey="OUT" fill="url(#outGrad)" radius={[4, 4, 0, 0]} name="Cash Out (Purchases)" maxBarSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch min-h-[400px]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex h-full">
          <Card className="w-full flex flex-col h-full border-2 shadow-sm">
            <CardHeader className="border-b bg-muted/10 py-4 px-5 shrink-0 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-emerald-600" /> Recent Sales
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-7 text-xs font-bold text-muted-foreground hover:text-primary" onClick={() => router.push("/sales")}>
                All <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto sidebar-scroll">
              <div className="divide-y">
                {recentSales.length === 0 ? <div className="p-8 text-center text-xs font-medium text-muted-foreground">No recent sales</div> :
                recentSales.map((sale) => (
                  <div key={sale._id} className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 text-[11px] font-bold shrink-0">
                      {sale.shopkeeperName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{sale.shopkeeperName}</p>
                      <p className="text-[10px] text-muted-foreground font-mono mt-0.5">INV: {sale.invoiceNo}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-black text-emerald-600 font-mono">{formatCurrency(sale.totalAmount)}</p>
                      <Badge variant="secondary" className="text-[9px] px-1.5 py-0 mt-1 font-bold uppercase">{sale.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="flex h-full">
          <Card className="w-full flex flex-col h-full border-2 shadow-sm">
            <CardHeader className="border-b bg-muted/10 py-4 px-5 shrink-0 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Truck className="h-4 w-4 text-rose-600" /> Stock Purchases
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-7 text-xs font-bold text-muted-foreground hover:text-primary" onClick={() => router.push("/purchases")}>
                All <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto sidebar-scroll">
              <div className="divide-y">
                {recentPurchases.length === 0 ? <div className="p-8 text-center text-xs font-medium text-muted-foreground">No recent purchases</div> :
                recentPurchases.map((po) => (
                  <div key={po._id} className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 shrink-0">
                      <Factory className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{po.companyName}</p>
                      <p className="text-[10px] text-muted-foreground font-mono mt-0.5">PO: {po.poNumber}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-black text-rose-600 font-mono">{formatCurrency(po.totalAmount)}</p>
                      <Badge variant="secondary" className="text-[9px] px-1.5 py-0 mt-1 font-bold uppercase">{po.paymentMethod}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex h-full">
          <Card className="w-full flex flex-col h-full border-2 shadow-sm">
            <CardHeader className="border-b bg-muted/10 py-4 px-5 shrink-0 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" /> Stock Alerts
              </CardTitle>
              {topAlerts.length > 0 && (
                <Badge variant="destructive" className="h-6 px-2 font-black shadow-sm">
                  {outOfStockCount + lowStockCount}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto sidebar-scroll">
              <div className="divide-y">
                {topAlerts.length === 0 ? (
                  <div className="p-8 text-center flex flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 mb-3">
                      <Package className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">All stock healthy</p>
                    <p className="text-[10px] text-muted-foreground mt-1">No items are running low.</p>
                  </div>
                ) : (
                  topAlerts.map((alert, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors">
                      <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl shrink-0", alert.status === "out_of_stock" ? "bg-red-100 text-red-600 dark:bg-red-900/30" : "bg-amber-100 text-amber-600 dark:bg-amber-900/30")}>
                        <Package className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{alert.productName}</p>
                        <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
                          {alert.label} <span className="mx-1">•</span> <span className="font-bold text-foreground">Stock: {alert.stock}</span> (Min: {alert.minStock})
                        </p>
                      </div>
                      <Badge variant="secondary" className={cn("text-[10px] font-black shrink-0 px-2 py-0.5 border", alert.status === "out_of_stock" ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50" : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50")}>
                        {alert.status === "out_of_stock" ? "OUT" : "LOW"}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}