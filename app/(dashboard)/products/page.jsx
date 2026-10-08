"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchProducts, removeProduct } from "@/store/actions/productActions";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Search, Plus, Package, AlertTriangle, Trash2, Pencil, DollarSign, Layers } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Calculate stats based on variants
  const totalProducts = products.length;
  let totalInventoryValue = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;

  products.forEach(p => {
    let pHasLow = false;
    let pHasOut = false;
    p.variants?.forEach(v => {
      totalInventoryValue += (v.costPrice * v.stock);
      if (v.stock === 0) pHasOut = true;
      else if (v.stock <= v.minStock) pHasLow = true;
    });
    if (pHasOut) outOfStockCount++;
    if (pHasLow && !pHasOut) lowStockCount++;
  });

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { title: "Total Products", value: totalProducts, icon: Package, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { title: "Inventory Value", value: formatCurrency(totalInventoryValue), icon: DollarSign, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { title: "Low Stock Items", value: lowStockCount, icon: AlertTriangle, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { title: "Out of Stock", value: outOfStockCount, icon: Layers, color: "text-red-600 dark:text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  ];

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleteLoading(true);
    try {
      await dispatch(removeProduct(deleteConfirm));
      setDeleteConfirm(null);
    } catch (err) {
      alert(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const getPriceDisplay = (variants) => {
    if (!variants || variants.length === 0) return "-";
    if (variants.length === 1) return formatCurrency(variants[0].price);
    const prices = variants.map(v => v.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (min === max) return formatCurrency(min);
    return `${formatCurrency(min)} - ${formatCurrency(max)}`;
  };

  const getTotalStock = (variants) => {
    if (!variants) return 0;
    return variants.reduce((sum, v) => sum + v.stock, 0);
  };

  return (
    <div className="flex flex-col gap-6 h-full min-h-0">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Manage your inventory, brands, and variants</p>
        </div>
        <Button onClick={() => router.push("/products/add")} className="gap-2 h-10 px-4 rounded-xl shadow-md shadow-primary/20">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 shrink-0">
        {stats.map((stat, index) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <Card className={`border-2 ${stat.border} shadow-sm`}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color} shrink-0`}>
                  <stat.icon className="h-6 w-6" />
                </div>
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
            <Input type="text" placeholder="Search by name, brand, or category..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-10 rounded-xl bg-background border-muted-foreground/20" />
          </div>
        </div>

        <div className="flex-1 overflow-auto sidebar-scroll">
          {isLoading ? (
            <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="sticky top-0 bg-muted/40 backdrop-blur-md z-10 border-b">
                <tr>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">Product</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">Category / Brand</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">Variants</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Price Range</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-center">Total Stock</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-accent/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                          <Package className="h-5 w-5" />
                        </div>
                        <p className="font-bold truncate max-w-[200px]">{product.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center w-fit px-2 py-0.5 rounded-md bg-muted text-[10px] font-medium">{product.categoryName}</span>
                        {product.brandName && <span className="text-[10px] text-muted-foreground font-semibold">{product.brandName}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="font-bold bg-background">{product.variants?.length || 0} sizes</Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-primary">
                      {getPriceDisplay(product.variants)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-bold text-xs">{getTotalStock(product.variants)} Units</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10" onClick={() => router.push(`/products/${product._id}`)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => setDeleteConfirm(product._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">No products found. Adjust your search or add a new product.</td></tr>
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
            <DialogTitle className="text-base font-bold">Delete Product</DialogTitle>
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