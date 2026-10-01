"use client";

import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { CreditCard } from "lucide-react";
import { motion } from "framer-motion";

export default function CreditOverview() {
  const { credits } = useSelector((state) => state.credits);
  const sortedCredits = [...credits].sort((a, b) => b.totalCredit - a.totalCredit).slice(0, 5);
  const totalCredit = credits.reduce((sum, c) => sum + c.totalCredit, 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Credit Overview</CardTitle>
          <span className="text-xs font-semibold text-destructive">{formatCurrency(totalCredit)}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {sortedCredits.map((credit, index) => (
            <motion.div
              key={credit.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 flex-shrink-0">
                <CreditCard className="h-3 w-3 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{credit.shopkeeperName}</p>
                <p className="text-[10px] text-muted-foreground truncate">{credit.shopName}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-semibold">{formatCurrency(credit.totalCredit)}</p>
                <Badge
                  variant="secondary"
                  className={`text-[10px] px-1.5 py-0 ${
                    credit.status === "overdue"
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  }`}
                >
                  {credit.status}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}