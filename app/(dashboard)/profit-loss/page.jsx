"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { formatCurrency, cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowRightLeft,
  Calendar,
  Wallet,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Cell
} from "recharts";

const monthlyData = [
  { month: "Jan", revenue: 185000, cost: 142000, profit: 43000, expenses: 12000, netProfit: 31000 },
  { month: "Feb", revenue: 220000, cost: 168000, profit: 52000, expenses: 14000, netProfit: 38000 },
  { month: "Mar", revenue: 198000, cost: 155000, profit: 43000, expenses: 13000, netProfit: 30000 },
  { month: "Apr", revenue: 245000, cost: 185000, profit: 60000, expenses: 15000, netProfit: 45000 },
  { month: "May", revenue: 267000, cost: 198000, profit: 69000, expenses: 16000, netProfit: 53000 },
  { month: "Jun", revenue: 234000, cost: 178000, profit: 56000, expenses: 14500, netProfit: 41500 },
  { month: "Jul", revenue: 289000, cost: 215000, profit: 74000, expenses: 18000, netProfit: 56000 },
];

const categoryProfitData = [
  { name: "Chips", revenue: 45000, cost: 32000, profit: 13000, margin: 28.8 },
  { name: "Daal", revenue: 85000, cost: 72000, profit: 13000, margin: 15.2 },
  { name: "Cookies", revenue: 35000, cost: 24000, profit: 11000, margin: 31.4 },
  { name: "Beverages", revenue: 65000, cost: 50000, profit: 15000, margin: 23.0 },
  { name: "Grocery", revenue: 125000, cost: 105000, profit: 20000, margin: 16.0 },
];

export default function ProfitLossPage() {
  const { sales } = useSelector((state) => state.sales);
  const [period, setPeriod] = useState("this-year");

  const totalRevenue = monthlyData.reduce((sum, d) => sum + d.revenue, 0);
  const totalCost = monthlyData.reduce((sum, d) => sum + d.cost, 0);
  const totalExpenses = monthlyData.reduce((sum, d) => sum + d.expenses, 0);
  const totalNetProfit = monthlyData.reduce((sum, d) => sum + d.netProfit, 0);
  const overallMargin = ((totalNetProfit / totalRevenue) * 100).toFixed(1);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border rounded-xl shadow-xl p-3 min-w-[160px]">
          <p className="text-xs font-bold mb-2 pb-2 border-b">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4 text-xs mb-1 last:mb-0">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: entry.color }} />
                <span className="text-muted-foreground">{entry.name}:</span>
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

  return (
    <div className="flex flex-col gap-6 h-full min-h-0 pb-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profit & Loss</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Financial performance and margin analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[160px] h-10 rounded-xl bg-background font-semibold text-xs border-muted-foreground/20">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="this-month" className="text-xs font-medium">This Month</SelectItem>
              <SelectItem value="last-month" className="text-xs font-medium">Last Month</SelectItem>
              <SelectItem value="this-quarter" className="text-xs font-medium">This Quarter</SelectItem>
              <SelectItem value="this-year" className="text-xs font-medium">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto sidebar-scroll pr-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card className="border-2 border-blue-500/20 shadow-sm bg-gradient-to-br from-blue-500/5 to-transparent h-full">
              <CardContent className="p-5 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Gross Revenue</p>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <DollarSign className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-2xl font-black tracking-tight text-blue-600 dark:text-blue-500">{formatCurrency(totalRevenue)}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-2 border-red-500/20 shadow-sm bg-gradient-to-br from-red-500/5 to-transparent h-full">
              <CardContent className="p-5 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Cost of Goods (COGS)</p>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
                    <ArrowRightLeft className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-2xl font-black tracking-tight text-red-600 dark:text-red-500">{formatCurrency(totalCost)}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="border-2 border-orange-500/20 shadow-sm bg-gradient-to-br from-orange-500/5 to-transparent h-full">
              <CardContent className="p-5 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Operating Expenses</p>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
                    <Wallet className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-2xl font-black tracking-tight text-orange-600 dark:text-orange-500">{formatCurrency(totalExpenses)}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-2 border-emerald-500/20 shadow-sm bg-gradient-to-br from-emerald-500/10 to-transparent h-full relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-4 translate-y-4">
                <TrendingUp className="h-24 w-24 text-emerald-600" />
              </div>
              <CardContent className="p-5 flex flex-col justify-center relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">Net Profit</p>
                  <Badge variant="outline" className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 font-bold">
                    {overallMargin}% Margin
                  </Badge>
                </div>
                <p className="text-3xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">{formatCurrency(totalNetProfit)}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6 items-stretch">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="xl:col-span-2 flex min-h-0">
            <Card className="border-2 shadow-sm w-full flex flex-col">
              <CardHeader className="border-b bg-muted/10 py-4 px-5 shrink-0">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  Revenue vs Profit Trend
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 flex-1 min-h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.58 0.17 185)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="oklch(0.58 0.17 185)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.65 0.17 155)" stopOpacity={0.5} />
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
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '10px' }} />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      name="Gross Revenue"
                      stroke="oklch(0.58 0.17 185)" 
                      strokeWidth={3}
                      fill="url(#colorRev)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="netProfit" 
                      name="Net Profit"
                      stroke="oklch(0.65 0.17 155)" 
                      strokeWidth={3}
                      fill="url(#colorNet)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex min-h-0">
            <Card className="border-2 shadow-sm w-full flex flex-col">
              <CardHeader className="border-b bg-muted/10 py-4 px-5 shrink-0">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Profit Margins by Category
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-y-auto sidebar-scroll">
                <div className="divide-y">
                  {categoryProfitData.map((cat, i) => (
                    <div key={i} className="p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-sm">{cat.name}</span>
                        <Badge variant="outline" className={cn(
                          "font-bold text-[10px]",
                          cat.margin >= 25 ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                          cat.margin >= 15 ? "bg-blue-100 text-blue-700 border-blue-200" :
                          "bg-orange-100 text-orange-700 border-orange-200"
                        )}>
                          {cat.margin}% Margin
                        </Badge>
                      </div>
                      <div className="flex justify-between text-xs mb-1.5 text-muted-foreground">
                        <span>Revenue: <span className="font-semibold text-foreground">{formatCurrency(cat.revenue)}</span></span>
                        <span>Profit: <span className="font-bold text-primary">{formatCurrency(cat.profit)}</span></span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden flex">
                        <div className="h-full bg-emerald-500" style={{ width: `${(cat.profit / cat.revenue) * 100}%` }} />
                        <div className="h-full bg-red-400" style={{ width: `${(cat.cost / cat.revenue) * 100}%` }} />
                      </div>
                      <div className="flex justify-between text-[9px] font-bold text-muted-foreground mt-1 uppercase tracking-wider">
                        <span className="text-emerald-600">Profit</span>
                        <span className="text-red-500">COGS</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card className="border-2 shadow-sm">
            <CardHeader className="border-b bg-muted/10 py-4 px-5">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Wallet className="h-4 w-4 text-primary" />
                Monthly Statement Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/30 border-b">
                  <tr>
                    <th className="px-5 py-3 font-semibold text-muted-foreground">Month</th>
                    <th className="px-5 py-3 font-semibold text-muted-foreground text-right">Gross Revenue</th>
                    <th className="px-5 py-3 font-semibold text-muted-foreground text-right">COGS</th>
                    <th className="px-5 py-3 font-semibold text-muted-foreground text-right">Gross Profit</th>
                    <th className="px-5 py-3 font-semibold text-muted-foreground text-right">Expenses</th>
                    <th className="px-5 py-3 font-semibold text-muted-foreground text-right">Net Profit</th>
                    <th className="px-5 py-3 font-semibold text-muted-foreground text-right">Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-mono text-[13px]">
                  {monthlyData.map((data, i) => {
                    const margin = ((data.netProfit / data.revenue) * 100).toFixed(1);
                    return (
                      <tr key={i} className="hover:bg-accent/30 transition-colors">
                        <td className="px-5 py-3 font-sans font-bold">{data.month} 2024</td>
                        <td className="px-5 py-3 text-right">{formatCurrency(data.revenue)}</td>
                        <td className="px-5 py-3 text-right text-red-600 dark:text-red-400">-{formatCurrency(data.cost)}</td>
                        <td className="px-5 py-3 text-right font-semibold text-blue-600 dark:text-blue-400">{formatCurrency(data.profit)}</td>
                        <td className="px-5 py-3 text-right text-orange-600 dark:text-orange-400">-{formatCurrency(data.expenses)}</td>
                        <td className="px-5 py-3 text-right font-black text-emerald-600 dark:text-emerald-500">{formatCurrency(data.netProfit)}</td>
                        <td className="px-5 py-3 text-right">
                          <Badge variant="outline" className={cn(
                            "font-sans font-bold",
                            margin >= 20 ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                          )}>
                            {margin}%
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}