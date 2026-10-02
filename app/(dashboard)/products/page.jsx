"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { removeProduct } from "@/store/actions/productActions";
import { formatCurrency } from "@/lib/utils";
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
  Package,
  AlertTriangle,
  XCircle,
  Trash2,
  Eye,
  DollarSign,
} from "lucide-react";
import { motion } from "framer-motion";

export default function ProductsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const totalProducts = products.length;
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const lowStock = products.filter(
    (p) => p.stock > 0 && p.stock <= p.minStock
  ).length;
  const totalValue = products.reduce(
    (sum, p) => sum + p.costPrice * p.stock,
    0
  );

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode?.includes(searchTerm)
  );

  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Inventory Value",
      value: formatCurrency(totalValue),
      icon: DollarSign,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "Low Stock",
      value: lowStock,
      icon: AlertTriangle,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      title: "Out of Stock",
      value: outOfStock,
      icon: XCircle,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    },
  ];

  const handleDelete = () => {
    if (deleteConfirm) {
      dispatch(removeProduct(deleteConfirm));
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
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your inventory and pricing
          </p>
        </div>
        <Button
          onClick={() => router.push("/products/add")}
          className="gap-2 h-10 px-4 rounded-xl shadow-md shadow-primary/20"
        >
          <Plus className="h-4 w-4" /> Add Product
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
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-black tracking-tight mt-0.5">
                    {stat.value}
                  </p>
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
            <Input
              type="text"
              placeholder="Search products by name, category, or barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-background border-muted-foreground/20"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto sidebar-scroll">
          <table className="w-full text-sm text-left">
            <thead className="sticky top-0 bg-muted/40 backdrop-blur-md z-10 border-b">
              <tr>
                <th className="px-4 py-3 font-semibold text-muted-foreground">
                  Product
                </th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">
                  Category
                </th>
                <th className="px-4 py-3 font-semibold text-muted-foreground text-right">
                  Price
                </th>
                <th className="px-4 py-3 font-semibold text-muted-foreground text-center">
                  Stock
                </th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 font-semibold text-muted-foreground text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-accent/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                        <Package className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold truncate">{product.name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">
                          {product.barcode || "NO BARCODE"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-[11px] font-medium">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <p className="font-bold">{formatCurrency(product.price)}</p>
                    <p className="text-[10px] text-muted-foreground">
                      Cost: {formatCurrency(product.costPrice)}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-bold">
                      {product.stock} {product.unit}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="secondary"
                      className={
                        product.stock === 0
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : product.stock <= product.minStock
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      }
                    >
                      {product.stock === 0
                        ? "Out of Stock"
                        : product.stock <= product.minStock
                        ? "Low Stock"
                        : "In Stock"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary hover:bg-primary/10"
                        onClick={() => router.push(`/products/${product.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteConfirm(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No products found. Adjust your search or add a new product.
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
              Delete Product
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Are you sure? This action cannot be undone.
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