"use client";

import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

export default function RecentSales() {
  const { sales } = useSelector((state) => state.sales);
  const recentSales = [...sales].slice(0, 5);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Recent Sales</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {recentSales.map((sale, index) => (
            <motion.div
              key={sale.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between py-2 border-b last:border-0"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{sale.shopkeeperName}</p>
                <p className="text-[11px] text-muted-foreground">{sale.invoiceNo}</p>
              </div>
              <div className="text-right ml-3">
                <p className="text-xs font-semibold">{formatCurrency(sale.totalAmount)}</p>
                <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${getStatusColor(sale.status)}`}>
                  {sale.status}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}