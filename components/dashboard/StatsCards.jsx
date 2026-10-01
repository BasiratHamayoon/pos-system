"use client";

import { useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CreditCard,
} from "lucide-react";
import { motion } from "framer-motion";

export default function StatsCards() {
  const { products } = useSelector((state) => state.products);
  const { sales } = useSelector((state) => state.sales);
  const { shopkeepers } = useSelector((state) => state.shopkeepers);
  const { credits } = useSelector((state) => state.credits);
  const { alerts } = useSelector((state) => state.alerts);

  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalCash = sales.reduce((sum, s) => sum + s.paidAmount, 0);
  const totalCredit = credits.reduce((sum, c) => sum + c.totalCredit, 0);
  const outOfStock = products.filter((p) => p.status === "out_of_stock").length;
  const lowStock = products.filter((p) => p.status === "low_stock").length;
  const unreadAlerts = alerts.filter((a) => !a.isRead).length;

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      change: "+12.5%",
      changeType: "positive",
      icon: DollarSign,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Total Cash",
      value: formatCurrency(totalCash),
      change: "+8.2%",
      changeType: "positive",
      icon: ShoppingCart,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Total Credit",
      value: formatCurrency(totalCredit),
      change: "-3.1%",
      changeType: "negative",
      icon: CreditCard,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      title: "Total Products",
      value: products.length.toString(),
      change: `${outOfStock} out of stock`,
      changeType: outOfStock > 0 ? "negative" : "neutral",
      icon: Package,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Total Sales",
      value: sales.length.toString(),
      change: "+15.3%",
      changeType: "positive",
      icon: TrendingUp,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      title: "Shopkeepers",
      value: shopkeepers.length.toString(),
      change: `${shopkeepers.filter((s) => s.status === "active").length} active`,
      changeType: "neutral",
      icon: Users,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    },
    {
      title: "Stock Alerts",
      value: (outOfStock + lowStock).toString(),
      change: `${outOfStock} critical`,
      changeType: outOfStock > 0 ? "negative" : "neutral",
      icon: AlertTriangle,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/30",
    },
    {
      title: "Pending Alerts",
      value: unreadAlerts.toString(),
      change: "Unread",
      changeType: unreadAlerts > 0 ? "negative" : "neutral",
      icon: AlertTriangle,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground">{stat.title}</span>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-xl font-bold">{stat.value}</span>
                <span
                  className={`text-[11px] font-medium flex items-center gap-0.5 ${
                    stat.changeType === "positive"
                      ? "text-green-600 dark:text-green-400"
                      : stat.changeType === "negative"
                      ? "text-red-600 dark:text-red-400"
                      : "text-muted-foreground"
                  }`}
                >
                  {stat.changeType === "positive" && <TrendingUp className="h-3 w-3" />}
                  {stat.changeType === "negative" && <TrendingDown className="h-3 w-3" />}
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}