"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Store, Package } from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function ShopkeeperTable({ shopkeepers, isLoading, onDelete }) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <table className="w-full text-sm text-left">
      <thead className="sticky top-0 bg-muted/40 backdrop-blur-md z-10 border-b">
        <tr>
          <th className="px-4 py-3 font-semibold text-muted-foreground">Customer</th>
          <th className="px-4 py-3 font-semibold text-muted-foreground">Shop Details</th>
          <th className="px-4 py-3 font-semibold text-muted-foreground text-center">Orders</th>
          <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Total Sales</th>
          <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Credit Balance</th>
          <th className="px-4 py-3 font-semibold text-muted-foreground">Status</th>
          <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y">
        {shopkeepers.map((shopkeeper) => {
          const id = shopkeeper._id || shopkeeper.id;
          return (
            <tr key={id} className="hover:bg-accent/50 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs shrink-0">
                    {shopkeeper.name ? shopkeeper.name.split(" ").map((n) => n[0]).join("").slice(0, 2) : "CU"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold truncate">{shopkeeper.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                      {shopkeeper.phone || "No phone"}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="min-w-0 max-w-[200px]">
                  <p className="font-semibold flex items-center gap-1.5 truncate">
                    <Store className="h-3 w-3 text-muted-foreground shrink-0" />
                    <span className="truncate">{shopkeeper.shopName}</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                    {shopkeeper.address || "No address"}
                  </p>
                </div>
              </td>
              <td className="px-4 py-3 text-center">
                <Badge variant="outline" className="font-bold">
                  <Package className="h-3 w-3 mr-1" />
                  {shopkeeper.salesCount || 0}
                </Badge>
              </td>
              <td className="px-4 py-3 text-right">
                <p className="font-bold">{formatCurrency(shopkeeper.totalPurchases || 0)}</p>
                <p className="text-[10px] text-muted-foreground">
                  Since {formatDate(shopkeeper.createdAt || new Date())}
                </p>
              </td>
              <td className="px-4 py-3 text-right">
                <span className={cn(
                  "font-bold",
                  shopkeeper.totalCredit > 0 ? "text-orange-600" : "text-muted-foreground"
                )}>
                  {formatCurrency(shopkeeper.totalCredit || 0)}
                </span>
              </td>
              <td className="px-4 py-3">
                <Badge
                  variant="secondary"
                  className={
                    shopkeeper.status === "active"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-muted text-muted-foreground"
                  }
                >
                  {shopkeeper.status || "active"}
                </Badge>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-primary hover:bg-primary/10"
                    onClick={() => router.push(`/shopkeepers/${id}`)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    onClick={() => onDelete(id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          );
        })}
        {shopkeepers.length === 0 && (
          <tr>
            <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
              No shopkeepers found. Try adjusting your filters.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}