"use client";

import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "@/store/actions/productActions";
import { fetchSales } from "@/store/actions/salesActions";
import { fetchShopkeepers } from "@/store/actions/shopkeeperActions";
import { fetchCredits } from "@/store/actions/creditActions";
import { fetchProfitLoss } from "@/store/actions/analyticsActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
  Calendar,
  MoreHorizontal,
  Zap,
  Package,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border rounded-xl shadow-xl p-3 min-w-[140px] z-50 relative">
        <p className="text-xs font-bold mb-1.5 pb-1.5 border-b">{label}</p>
        {payload.map((entry, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-3 text-xs mb-1 last:mb-0"
          >
            <div className="flex items-center gap-1.5">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
            </div>
            <span className="font-semibold font-mono">
              Rs {(entry.value / 1000).toFixed(1)}k
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
  const { data: analyticsData } = useSelector((state) => state.analytics);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      await Promise.all([
        dispatch(fetchProducts()),
        dispatch(fetchSales()),
        dispatch(fetchShopkeepers()),
        dispatch(fetchCredits()),
        dispatch(fetchProfitLoss()),
      ]);
      setIsLoading(false);
    };
    loadDashboardData();
  }, [dispatch]);

  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalCredit = credits.reduce((sum, c) => sum + c.totalCredit, 0);
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= p.minStock).length;

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      gradient: "from-emerald-500/20 to-teal-500/10",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Total Sales",
      value: sales.length.toString(),
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
      gradient: "from-blue-500/20 to-cyan-500/10",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Market Credit",
      value: formatCurrency(totalCredit),
      change: "-3.1%",
      trend: "down",
      icon: CreditCard,
      gradient: "from-orange-500/20 to-amber-500/10",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
    {
      title: "Customers",
      value: shopkeepers.length.toString(),
      change: `+${shopkeepers.filter((s) => s.status === "active").length} active`,
      trend: "up",
      icon: Users,
      gradient: "from-violet-500/20 to-purple-500/10",
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-600 dark:text-violet-400",
    },
  ];

  const CHART_COLORS = [
    "oklch(0.58 0.17 185)",
    "oklch(0.65 0.17 155)",
    "oklch(0.72 0.18 85)",
    "oklch(0.60 0.20 290)",
    "oklch(0.65 0.22 15)",
  ];

  const topProducts = [...products]
    .filter((p) => p.stock > 0)
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 5);

  const recentSales = [...sales].slice(0, 5);
  const alertProducts = products.filter((p) => p.status !== "in_stock").slice(0, 4);

  // Generate Daily Sales Data from actual sales array
  const dailySalesData = useMemo(() => {
    const daysMap = {};
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayName = d.toLocaleString('en-us', { weekday: 'short' });
      daysMap[dateStr] = { day: dayName, sales: 0 };
    }

    sales.forEach(sale => {
      const dateStr = (sale.date || sale.createdAt || "").toString().split("T")[0];
      if (daysMap[dateStr]) {
        daysMap[dateStr].sales += sale.totalAmount;
      }
    });

    return Object.values(daysMap);
  }, [sales]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 h-full min-h-0 overflow-y-auto sidebar-scroll pb-6 pr-1">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 flex-wrap">
            Dashboard
            <span className="flex h-5 items-center rounded-full bg-emerald-500/10 px-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              LIVE
            </span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Welcome back! Here is what is happening with your store today.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" className="h-9 gap-2 text-xs" onClick={() => router.push("/reports")}>
            <Calendar className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reports</span>
            <span className="sm:hidden">Reports</span>
          </Button>
          <Button size="sm" className="h-9 gap-2 text-xs" onClick={() => router.push("/pos")}>
            <Zap className="h-3.5 w-3.5" />
            Quick Sale
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 shrink-0">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className={`relative overflow-hidden border bg-gradient-to-br ${stat.gradient} h-full`}
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div
                    className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl ${stat.iconBg}`}
                  >
                    <stat.icon
                      className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.iconColor}`}
                    />
                  </div>
                  <button
                    type="button"
                    className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-background/50 transition-colors"
                  >
                    <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground truncate">
                    {stat.title}
                  </p>
                  <p className="text-xl sm:text-2xl font-black tracking-tight truncate">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-1 pt-1 flex-wrap">
                    <span
                      className={`flex items-center gap-0.5 text-[10px] sm:text-[11px] font-semibold px-1.5 py-0.5 rounded ${
                        stat.trend === "up"
                          ? "text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30"
                          : "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
                      }`}
                    >
                      {stat.trend === "up" ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {stat.change}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-muted-foreground">
                      vs last month
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 shrink-0 items-stretch">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-2 flex"
        >
          <Card className="w-full flex flex-col">
            <CardHeader className="pb-2 flex-row items-center justify-between space-y-0 flex-wrap gap-2 shrink-0">
              <div>
                <CardTitle className="text-sm font-bold">
                  Revenue Overview
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Monthly revenue vs expenses
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-[11px] text-muted-foreground">
                    Revenue
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-chart-2" />
                  <span className="text-[11px] text-muted-foreground">
                    Profit
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2 flex-1 min-h-[260px]">
              <div className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={analyticsData.monthlyData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.58 0.17 185)" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="oklch(0.58 0.17 185)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.65 0.17 155)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="oklch(0.65 0.17 155)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis
                      tick={{ fontSize: 11, fontFamily: 'monospace' }}
                      tickFormatter={(v) => `Rs${v / 1000}k`}
                      axisLine={false}
                      tickLine={false}
                      dx={-10}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--muted-foreground)', strokeWidth: 1, strokeDasharray: '3 3' }} />
                    <Area type="monotone" dataKey="revenue" stroke="oklch(0.58 0.17 185)" strokeWidth={3} fill="url(#revGrad)" name="Revenue" />
                    <Area type="monotone" dataKey="netProfit" stroke="oklch(0.65 0.17 155)" strokeWidth={3} fill="url(#profGrad)" name="Net Profit" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex"
        >
          <Card className="h-full w-full flex flex-col">
            <CardHeader className="pb-2 shrink-0">
              <CardTitle className="text-sm font-bold">
                Sales by Category
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Top performing categories
              </p>
            </CardHeader>
            <CardContent className="pt-2 flex-1 flex flex-col">
              <div className="flex-1 min-h-[160px] w-full relative">
                {analyticsData.categoryProfitData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.categoryProfitData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="revenue"
                      >
                        {analyticsData.categoryProfitData.map((entry, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) =>
                          active && payload?.length ? (
                            <div className="bg-popover border rounded-xl shadow-xl p-2 z-50 relative">
                              <p className="text-xs font-bold mb-1">{payload[0].name}</p>
                              <p className="text-[11px] font-mono text-primary font-semibold">{formatCurrency(payload[0].value)}</p>
                            </div>
                          ) : null
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground font-semibold">
                    No category data
                  </div>
                )}
              </div>
              <div className="space-y-2 mt-4 shrink-0">
                {analyticsData.categoryProfitData.slice(0, 3).map((cat, i) => (
                  <div key={cat.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                      <span className="text-muted-foreground truncate font-semibold">{cat.name}</span>
                    </div>
                    <span className="font-bold shrink-0 font-mono text-[11px]">{formatCurrency(cat.revenue)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 shrink-0 items-start pb-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex">
          <Card className="w-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold">Weekly Sales</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Sales performance this week</p>
            </CardHeader>
            <CardContent className="pt-2 flex-1 min-h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailySalesData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.58 0.17 185)" stopOpacity={1} />
                      <stop offset="100%" stopColor="oklch(0.58 0.17 185)" stopOpacity={0.5} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fontSize: 11, fontFamily: 'monospace' }} tickFormatter={(v) => `Rs${v / 1000}k`} axisLine={false} tickLine={false} dx={-10} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)", opacity: 0.5 }} />
                  <Bar dataKey="sales" fill="url(#barGrad)" radius={[6, 6, 0, 0]} name="Sales" maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="flex">
          <Card className="w-full flex flex-col">
            <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-sm font-bold">Recent Sales</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Latest transactions</p>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => router.push("/sales")}>
                View All <ArrowUpRight className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="pt-0 flex-1">
              <div className="space-y-3">
                {recentSales.map((sale) => (
                  <div key={sale._id} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/20 hover:bg-muted/50 transition-colors border">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary text-[11px] font-bold shrink-0">
                      {sale.shopkeeperName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">{sale.shopkeeperName}</p>
                      <p className="text-[10px] text-muted-foreground truncate font-mono mt-0.5">{sale.invoiceNo}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-black text-primary font-mono">{formatCurrency(sale.totalAmount)}</p>
                      <Badge variant="secondary" className={`text-[9px] px-2 py-0.5 mt-1 font-bold ${
                        sale.status === "paid" || sale.status === "completed" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200" :
                        sale.status === "partial" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200" :
                        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200"
                      }`}>
                        {sale.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {recentSales.length === 0 && (
                  <div className="text-center py-8 text-xs text-muted-foreground font-medium">No sales recorded yet.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex">
          <Card className="w-full flex flex-col">
            <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2 flex-wrap">
                  Stock Alerts
                  {outOfStock + lowStock > 0 && (
                    <Badge variant="destructive" className="text-[10px] h-5 px-2 font-black">
                      {outOfStock + lowStock}
                    </Badge>
                  )}
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Items needing attention</p>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => router.push("/products")}>
                View All <ArrowUpRight className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="pt-0 flex-1">
              <div className="space-y-3">
                {alertProducts.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed rounded-xl bg-muted/10">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 mx-auto mb-2">
                      <Package className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">All products in stock</p>
                  </div>
                ) : (
                  alertProducts.map((product) => (
                    <div key={product._id} className="flex items-center gap-3 p-3 rounded-xl border bg-card hover:border-primary/30 transition-colors shadow-sm">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg shrink-0 ${
                        product.status === "out_of_stock" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}>
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">{product.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                          Stock: {product.stock} <span className="mx-1">•</span> Min: {product.minStock}
                        </p>
                      </div>
                      <Badge variant="secondary" className={`text-[10px] font-black shrink-0 ${
                        product.status === "out_of_stock" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200"
                      }`}>
                        {product.status === "out_of_stock" ? "OUT" : "LOW"}
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