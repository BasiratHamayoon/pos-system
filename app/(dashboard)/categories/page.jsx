"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { removeCategory } from "@/store/actions/categoryActions";
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
  Tags,
  CheckCircle2,
  Package,
  Trash2,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";

export default function CategoriesPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const { products } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const totalCategories = categories.length;
  const activeCategories = categories.filter((c) => c.status === "active").length;

  const enrichedCategories = categories.map((cat) => ({
    ...cat,
    actualProductCount: products.filter(
      (p) => p.categoryId === cat.id || p.category === cat.name
    ).length,
  }));

  const totalProductsMapped = enrichedCategories.reduce(
    (sum, c) => sum + c.actualProductCount,
    0
  );

  const filteredCategories = enrichedCategories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    {
      title: "Total Categories",
      value: totalCategories,
      icon: Tags,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Active Categories",
      value: activeCategories,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "Mapped Products",
      value: totalProductsMapped,
      icon: Package,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
  ];

  const handleDelete = () => {
    if (deleteConfirm) {
      dispatch(removeCategory(deleteConfirm));
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
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Organize products into manageable groups
          </p>
        </div>
        <Button
          onClick={() => router.push("/categories/add")}
          className="gap-2 h-10 px-4 rounded-xl shadow-md shadow-primary/20"
        >
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0">
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
              placeholder="Search categories by name..."
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
                  Category Name
                </th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">
                  Description
                </th>
                <th className="px-4 py-3 font-semibold text-muted-foreground text-center">
                  Products
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
              {filteredCategories.map((category) => (
                <tr
                  key={category.id}
                  className="hover:bg-accent/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                        <Tags className="h-5 w-5" />
                      </div>
                      <p className="font-bold">{category.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-muted-foreground truncate max-w-xs">
                      {category.description || "No description provided"}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant="outline" className="font-bold">
                      {category.actualProductCount} Items
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="secondary"
                      className={
                        category.status === "active"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {category.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary hover:bg-primary/10"
                        onClick={() => router.push(`/categories/${category.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteConfirm(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCategories.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No categories found. Adjust your search or create a new category.
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
              Delete Category
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Are you sure? Removing a category will not delete its products, but
              they will become uncategorized.
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