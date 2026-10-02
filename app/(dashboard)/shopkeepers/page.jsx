"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { removeShopkeeper } from "@/store/actions/shopkeeperActions";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Search,
  Plus,
  Users,
  AlertTriangle,
  Trash2,
  Eye,
  Store,
  CreditCard,
  ShoppingCart,
  UserPlus
} from "lucide-react";
import { motion } from "framer-motion";

export default function ShopkeepersPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { shopkeepers } = useSelector((state) => state.shopkeepers);
  const { credits } = useSelector((state) => state.credits);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const totalShopkeepers = shopkeepers.length;
  const activeShopkeepers = shopkeepers.filter((s) => s.status === "active").length;
  const totalPurchases = shopkeepers.reduce((sum, s) => sum + (s.totalPurchases || 0), 0);
  
  // Real total credit from credits slice, fallback to shopkeeper data
  const totalCredit = credits.reduce((sum, c) => sum + c.totalCredit, 0);

  const filteredShopkeepers = shopkeepers.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone?.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    {
      title: "Total Customers",
      value: totalShopkeepers,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Active Customers",
      value: activeShopkeepers,
      icon: Store,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "Total Sales",
      value: formatCurrency(totalPurchases),
      icon: ShoppingCart,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      title: "Total Credit",
      value: formatCurrency(totalCredit),
      icon: CreditCard,
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
    },
  ];

  const handleDelete = () => {
    if (deleteConfirm) {
      dispatch(removeShopkeeper(deleteConfirm));
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full min-h-0">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Shopkeepers</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your registered customers and their credit
          </p>
        </div>
        <Button
          onClick={() => router.push("/shopkeepers/add")}
          className="gap-2 h-10 px-4 rounded-xl shadow-md shadow-primary/20"
        >
          <UserPlus className="h-4 w-4" /> Add Customer
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 shrink-0">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={`border-2 ${stat.border} shadow-sm`}>
              <CardContent className="p-4 flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color} shrink-0`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-black tracking-tight mt-0.5 truncate">
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="flex-1 min-h-0 flex flex-col overflow-hidden border-2 shadow-sm">
        <div className="p-4 border-b bg-muted/20 shrink-0 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, shop name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-background border-muted-foreground/20"
            />
          </div>
          <div className="flex items-center gap-2">
            {["all", "active", "inactive"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "px-4 h-10 rounded-xl text-xs font-bold capitalize transition-all border",
                  statusFilter === status
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-background text-muted-foreground border-muted hover:bg-muted/50"
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto sidebar-scroll">
          <table className="w-full text-sm text-left">
            <thead className="sticky top-0 bg-muted/40 backdrop-blur-md z-10 border-b">
              <tr>
                <th className="px-4 py-3 font-semibold text-muted-foreground">Customer</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">Shop Details</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Total Sales</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Credit Balance</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">Status</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredShopkeepers.map((shopkeeper) => {
                // Find matching credit record if exists to get latest credit amount
                const creditRecord = credits.find(c => c.shopkeeperId === shopkeeper.id);
                const currentCredit = creditRecord ? creditRecord.totalCredit : shopkeeper.totalCredit;

                return (
                  <tr
                    key={shopkeeper.id}
                    className="hover:bg-accent/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs shrink-0">
                          {shopkeeper.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
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
                    <td className="px-4 py-3 text-right">
                      <p className="font-bold">{formatCurrency(shopkeeper.totalPurchases || 0)}</p>
                      <p className="text-[10px] text-muted-foreground">
                        Since {formatDate(shopkeeper.createdAt)}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={cn(
                          "font-bold",
                          currentCredit > 0 ? "text-orange-600" : "text-muted-foreground"
                        )}
                      >
                        {formatCurrency(currentCredit)}
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
                        {shopkeeper.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-primary hover:bg-primary/10"
                          onClick={() => router.push(`/shopkeepers/${shopkeeper.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteConfirm(shopkeeper.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredShopkeepers.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No shopkeepers found. Try adjusting your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-[400px] rounded-2xl">
          <DialogHeader className="flex flex-col items-center text-center pt-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-3">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-base font-bold">
              Delete Customer
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Are you sure? This will remove the shopkeeper profile. Past invoices will retain their name, but credit links may break.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-2 mt-4 sm:justify-center">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              className="flex-1 h-10 text-xs font-bold rounded-xl"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="flex-1 h-10 text-xs font-bold rounded-xl"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}