"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchShopkeepers, removeShopkeeper } from "@/store/actions/shopkeeperActions";
import { formatCurrency, cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Users,
  AlertTriangle,
  Store,
  CreditCard,
  ShoppingCart,
  UserPlus,
} from "lucide-react";
import { motion } from "framer-motion";
import ShopkeeperStats from "@/components/shopkeepers/ShopkeeperStats";
import ShopkeeperTable from "@/components/shopkeepers/ShopkeeperTable";

export default function ShopkeepersPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { shopkeepers, isLoading } = useSelector((state) => state.shopkeepers);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchShopkeepers());
  }, [dispatch]);

  const totalShopkeepers = shopkeepers.length;
  const activeShopkeepers = shopkeepers.filter((s) => s.status === "active").length;
  const totalPurchases = shopkeepers.reduce((sum, s) => sum + (s.totalPurchases || 0), 0);
  const totalCredit = shopkeepers.reduce((sum, s) => sum + (s.totalCredit || 0), 0);

  const filteredShopkeepers = shopkeepers.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone?.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { title: "Total Customers", value: totalShopkeepers, icon: Users, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { title: "Active Customers", value: activeShopkeepers, icon: Store, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { title: "Total Sales", value: formatCurrency(totalPurchases), icon: ShoppingCart, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { title: "Total Credit", value: formatCurrency(totalCredit), icon: CreditCard, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  ];

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleteLoading(true);
    try {
      await dispatch(removeShopkeeper(deleteConfirm));
      setDeleteConfirm(null);
    } catch (err) {
      alert(err);
    } finally {
      setDeleteLoading(false);
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

      <ShopkeeperStats stats={stats} />

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
          <ShopkeeperTable
            shopkeepers={filteredShopkeepers}
            isLoading={isLoading}
            onDelete={setDeleteConfirm}
          />
        </div>
      </Card>

      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-[400px] rounded-2xl">
          <DialogHeader className="flex flex-col items-center text-center pt-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-3">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-base font-bold">Delete Customer</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Are you sure? This will remove the shopkeeper profile permanently.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-2 mt-4 sm:justify-center">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="flex-1 h-10 text-xs font-bold rounded-xl">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading} className="flex-1 h-10 text-xs font-bold rounded-xl">
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}