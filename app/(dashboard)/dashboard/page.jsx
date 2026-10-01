"use client";

import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import {
  dummyRevenueData,
  dummyDailySalesData,
  dummyCategorySalesData,
} from "@/lib/dummyData";
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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border rounded-lg shadow-xl p-3 min-w-[140px]">
        <p className="text-xs font-bold mb-1.5 pb-1.5 border-b">{label}</p>
        {payload.map((entry, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-1.5">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
            </div>
            <span className="font-semibold">
              Rs. {(entry.value / 1000).toFixed(1)}K
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { products } = useSelector((state) => state.products);
  const { sales } = useSelector((state) => state.sales);
  const { shopkeepers } = useSelector((state) => state.shopkeepers);
  const { credits } = useSelector((state) => state.credits);

  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalCredit = credits.reduce((sum, c) => sum + c.totalCredit, 0);
  const outOfStock = products.filter((p) => p.status === "out_of_stock").length;
  const lowStock = products.filter((p) => p.status === "low_stock").length;

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
      title: "Total Credit",
      value: formatCurrency(totalCredit),
      change: "-3.1%",
      trend: "down",
      icon: CreditCard,
      gradient: "from-orange-500/20 to-amber-500/10",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
    {
      title: "Shopkeepers",
      value: shopkeepers.length.toString(),
      change: "+2 new",
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
  const recentSales = sales.slice(0, 5);
  const alertProducts = products.filter((p) => p.status !== "in_stock").slice(0, 4);

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 flex-wrap">
            Dashboard
            <span className="flex h-5 items-center rounded-full bg-primary/10 px-2 text-[10px] font-bold text-primary">
              LIVE
            </span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Welcome back! Here is what is happening with your store today.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" className="h-9 gap-2 text-xs">
            <Calendar className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Last 30 days</span>
            <span className="sm:hidden">30d</span>
          </Button>
          <Button size="sm" className="h-9 gap-2 text-xs">
            <Zap className="h-3.5 w-3.5" />
            Quick Sale
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
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
                  <p className="text-xl sm:text-2xl font-bold tracking-tight truncate">
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-2"
        >
          <Card>
            <CardHeader className="pb-2 flex-row items-center justify-between space-y-0 flex-wrap gap-2">
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
            <CardContent className="pt-2">
              <div className="h-[260px] sm:h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={dummyRevenueData}
                    margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="oklch(0.58 0.17 185)"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor="oklch(0.58 0.17 185)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="oklch(0.65 0.17 155)"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="oklch(0.65 0.17 155)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="var(--border)"
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => `${v / 1000}K`}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="oklch(0.58 0.17 185)"
                      strokeWidth={2.5}
                      fill="url(#revGrad)"
                      name="Revenue"
                    />
                    <Area
                      type="monotone"
                      dataKey="profit"
                      stroke="oklch(0.65 0.17 155)"
                      strokeWidth={2.5}
                      fill="url(#profGrad)"
                      name="Profit"
                    />
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
        >
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold">
                Sales by Category
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Top performing categories
              </p>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dummyCategorySalesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {dummyCategorySalesData.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={CHART_COLORS[i % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) =>
                        active && payload?.length ? (
                          <div className="bg-popover border rounded-lg shadow-xl p-2">
                            <p className="text-xs font-semibold">
                              {payload[0].name}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {payload[0].value}% share
                            </p>
                          </div>
                        ) : null
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 mt-2">
                {dummyCategorySalesData.slice(0, 3).map((cat, i) => (
                  <div
                    key={cat.name}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: CHART_COLORS[i] }}
                      />
                      <span className="text-muted-foreground truncate">
                        {cat.name}
                      </span>
                    </div>
                    <span className="font-semibold shrink-0">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold">Weekly Sales</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Sales performance this week
              </p>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dummyDailySalesData}
                    margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="oklch(0.58 0.17 185)"
                          stopOpacity={1}
                        />
                        <stop
                          offset="100%"
                          stopColor="oklch(0.58 0.17 185)"
                          stopOpacity={0.5}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="var(--border)"
                    />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => `${v / 1000}K`}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "var(--muted)", opacity: 0.5 }}
                    />
                    <Bar
                      dataKey="sales"
                      fill="url(#barGrad)"
                      radius={[8, 8, 0, 0]}
                      name="Sales"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card>
            <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-sm font-bold">
                  Top Products
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Best stocked items
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1"
              >
                View All
                <ArrowUpRight className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-3">
                {topProducts.map((product, i) => {
                  const maxStock = Math.max(
                    ...topProducts.map((p) => p.stock)
                  );
                  return (
                    <div key={product.id} className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary text-[10px] font-bold shrink-0">
                            #{i + 1}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate">
                              {product.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground truncate">
                              {product.category}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-bold shrink-0">
                          {product.stock}
                        </span>
                      </div>
                      <Progress
                        value={(product.stock / maxStock) * 100}
                        className="h-1"
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-sm font-bold">
                  Recent Sales
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Latest transactions
                </p>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                View All
                <ArrowUpRight className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-2">
                {recentSales.map((sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary text-[11px] font-bold shrink-0">
                      {sale.shopkeeperName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">
                        {sale.shopkeeperName}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {sale.invoiceNo}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold">
                        {formatCurrency(sale.totalAmount)}
                      </p>
                      <Badge
                        variant="secondary"
                        className={`text-[9px] px-1.5 py-0 mt-0.5 font-semibold ${
                          sale.status === "completed"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        }`}
                      >
                        {sale.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Card>
            <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2 flex-wrap">
                  Stock Alerts
                  {outOfStock + lowStock > 0 && (
                    <Badge
                      variant="destructive"
                      className="text-[9px] h-4 px-1.5 font-bold"
                    >
                      {outOfStock + lowStock}
                    </Badge>
                  )}
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Items needing attention
                </p>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                View All
                <ArrowUpRight className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-2">
                {alertProducts.length === 0 ? (
                  <div className="text-center py-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 mx-auto mb-2">
                      <Package className="h-5 w-5" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      All products in stock
                    </p>
                  </div>
                ) : (
                  alertProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 p-2.5 rounded-lg bg-accent/30 hover:bg-accent transition-colors"
                    >
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg shrink-0 ${
                          product.status === "out_of_stock"
                            ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                        }`}
                      >
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">
                          {product.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          Stock: {product.stock} / Min: {product.minStock}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-[9px] font-bold shrink-0 ${
                          product.status === "out_of_stock"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        }`}
                      >
                        {product.status === "out_of_stock" ? "Out" : "Low"}
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