"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchPurchaseAnalytics } from "@/store/actions/analyticsActions";
import { formatCurrency, cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar,
} from "recharts";
import { ArrowLeft, Truck, Wallet, Package, Factory, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

export default function PurchaseAnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchPurchaseAnalytics();
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (isLoading) return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  if (!data) return <div className="text-center text-muted-foreground p-10">No purchase data available yet.</div>;

  const stats = [
    { title: "Total Spent", value: formatCurrency(data.totalSpent), icon: TrendingDown, color: "text-rose-600", bg: "bg-rose-500/10", border: "border-rose-500/20" },
    { title: "Total Paid", value: formatCurrency(data.totalPaid), icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { title: "Still Due", value: formatCurrency(data.totalDue), icon: Factory, color: "text-orange-600", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { title: "Orders Placed", value: data.totalOrders, icon: Truck, color: "text-blue-600", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  ];

  return (
    <div className="flex flex-col gap-6 h-full min-h-0 overflow-y-auto pr-1">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 shrink-0">
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => router.push("/purchases")}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Purchase Analytics</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Monthly spending and supplier insights</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 shrink-0">
        {stats.map((stat, i) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className={`border-2 ${stat.border} shadow-sm`}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color} shrink-0`}><stat.icon className="h-6 w-6" /></div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-muted-foreground uppercase truncate">{stat.title}</p>
                  <p className="text-2xl font-black tracking-tight truncate">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="xl:col-span-2">
          <Card>
            <CardHeader><CardTitle className="text-sm font-bold">Monthly Spending Trend</CardTitle></CardHeader>
            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.monthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="spentGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.60 0.23 25)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="oklch(0.60 0.23 25)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fontSize: 11, fontFamily: 'monospace' }} tickFormatter={(v) => `Rs${v/1000}k`} axisLine={false} tickLine={false} dx={-10} />
                  <Tooltip />
                  <Area type="monotone" dataKey="spent" stroke="oklch(0.60 0.23 25)" strokeWidth={3} fill="url(#spentGrad)" name="Spent" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="h-full">
            <CardHeader><CardTitle className="text-sm font-bold">Top Suppliers</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {data.topSuppliers.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-xl">
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">{s.name}</p>
                    <p className="text-[10px] text-muted-foreground">{s.orders} orders</p>
                  </div>
                  <span className="text-sm font-black text-primary">{formatCurrency(s.spent)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader><CardTitle className="text-sm font-bold">Monthly Statement</CardTitle></CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/30 border-b">
                <tr>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">Month</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-center">Orders</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Total Spent</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Paid</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Still Due</th>
                </tr>
              </thead>
              <tbody className="divide-y font-mono text-[13px]">
                {data.monthlyData.map((m, i) => (
                  <tr key={i} className="hover:bg-accent/30">
                    <td className="px-4 py-3 font-sans font-bold">{m.month} {m.year}</td>
                    <td className="px-4 py-3 text-center">{m.orders}</td>
                    <td className="px-4 py-3 text-right text-rose-600 font-bold">{formatCurrency(m.spent)}</td>
                    <td className="px-4 py-3 text-right text-emerald-600 font-bold">{formatCurrency(m.paid)}</td>
                    <td className="px-4 py-3 text-right text-orange-600 font-bold">{formatCurrency(m.due)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}