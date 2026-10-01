"use client";

import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Package } from "lucide-react";
import { motion } from "framer-motion";

export default function TopProducts() {
  const { products } = useSelector((state) => state.products);
  const topProducts = [...products]
    .filter((p) => p.stock > 0)
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 5);

  const maxStock = Math.max(...topProducts.map((p) => p.stock));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Top Products by Stock</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {topProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                <Package className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium truncate">{product.name}</p>
                  <span className="text-xs text-muted-foreground ml-2">{product.stock}</span>
                </div>
                <Progress value={(product.stock / maxStock) * 100} className="h-1.5" />
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}