"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchSuppliers, removeSupplier } from "@/store/actions/supplierActions";
import { formatCurrency, cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Search, Plus, Factory, AlertTriangle, Trash2, Pencil, Truck, Wallet } from "lucide-react";
import { motion } from "framer-motion";

export default function SuppliersPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { suppliers, isLoading } = useSelector((state) => state.suppliers);

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  const totalSuppliers = suppliers.length;
  const totalPurchased = suppliers.reduce((sum, s) => sum + (s.totalPurchased || 0), 0);
  const totalPayable = suppliers.reduce((sum, s) => sum + (s.totalPayable || 0), 0);

  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { title: "Total Suppliers", value: totalSuppliers, icon: Factory, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { title: "Total Stock Bought", value: formatCurrency(totalPurchased), icon: Truck, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { title: "Total Payable (Due)", value: formatCurrency(totalPayable), icon: Wallet, color: "text-red-600 dark:text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  ];

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleteLoading(true);
    try {
      await dispatch(removeSupplier(deleteConfirm));
      setDeleteConfirm(null);
    } catch (err) { alert(err); } finally { setDeleteLoading(false); }
  };

  return (
    <div className="flex flex-col gap-6 h-full min-h-0">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Suppliers & Warehouses</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Manage stock providers and payables</p>
        </div>
        <Button onClick={() => router.push("/suppliers/add")} className="gap-2 h-10 px-4 rounded-xl shadow-md shadow-primary/20">
          <Plus className="h-4 w-4" /> Add Supplier
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0">
        {stats.map((stat, index) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <Card className={`border-2 ${stat.border} shadow-sm`}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color} shrink-0`}><stat.icon className="h-6 w-6" /></div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">{stat.title}</p>
                  <p className="text-2xl font-black tracking-tight mt-0.5 truncate">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="flex-1 min-h-0 flex flex-col overflow-hidden border-2 shadow-sm">
        <div className="p-4 border-b bg-muted/20 shrink-0">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="text" placeholder="Search by supplier or company..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-10 rounded-xl bg-background border-muted-foreground/20" />
          </div>
        </div>

        <div className="flex-1 overflow-auto sidebar-scroll">
          {isLoading ? (
            <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="sticky top-0 bg-muted/40 backdrop-blur-md z-10 border-b">
                <tr>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">Supplier</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">Contact</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Total Purchased</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Payable Balance</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier._id} className="hover:bg-accent/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs shrink-0">
                          {supplier.companyName.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold truncate">{supplier.companyName}</p>
                          <p className="text-[10px] text-muted-foreground">Rep: {supplier.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-xs">{supplier.phone}</p>
                      <p className="text-[10px] text-muted-foreground truncate max-w-[200px]">{supplier.address || "No address"}</p>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-primary">
                      {formatCurrency(supplier.totalPurchased)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Badge variant="outline" className={cn("font-bold text-[11px]", supplier.totalPayable > 0 ? "text-red-600 border-red-200 bg-red-50 dark:bg-red-900/20" : "text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20")}>
                        {formatCurrency(supplier.totalPayable)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10" onClick={() => router.push(`/suppliers/${supplier._id}`)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => setDeleteConfirm(supplier._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredSuppliers.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">No suppliers found. Add your first supplier.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-[400px] rounded-2xl">
          <DialogHeader className="flex flex-col items-center text-center pt-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-3"><AlertTriangle className="h-6 w-6" /></div>
            <DialogTitle className="text-base font-bold">Delete Supplier</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">Are you sure? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-2 mt-4 sm:justify-center">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="flex-1 h-10 text-xs font-bold rounded-xl">Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading} className="flex-1 h-10 text-xs font-bold rounded-xl">{deleteLoading ? "Deleting..." : "Delete"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}