"use client";

import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { createProduct } from "@/store/actions/productActions";
import { fetchCategories } from "@/store/actions/categoryActions";
import { debounce } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Package, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function AddProductPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    categoryId: "",
    price: "",
    costPrice: "",
    stock: "",
    minStock: "10",
    unitValue: "1",
    unit: "pcs",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  const processSubmit = async (data) => {
    setIsLoading(true);
    setError("");

    const payload = {
      ...data,
      price: parseFloat(data.price) || 0,
      costPrice: parseFloat(data.costPrice) || 0,
      stock: parseInt(data.stock) || 0,
      minStock: parseInt(data.minStock) || 0,
      unitValue: parseFloat(data.unitValue) || 1,
    };

    try {
      await dispatch(createProduct(payload));
      router.push("/products");
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSubmit = useCallback(debounce((d) => processSubmit(d), 500), [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    debouncedSubmit(formData);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-10">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => router.push("/products")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Add Product</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Create a new item in your inventory</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <form onSubmit={handleSubmit}>
          <Card className="border-2 shadow-sm overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary to-primary/50" />
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold">Product Information</h3>
                  <p className="text-xs text-muted-foreground">Enter all required details below</p>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-xs border border-destructive/20">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Product Name *</Label>
                  <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="h-11 rounded-xl bg-muted/30" placeholder="e.g. Classic Salted Chips" />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Brand</Label>
                  <Input value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className="h-11 rounded-xl bg-muted/30" placeholder="e.g. Lays, Pepsi, Nestle" />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category *</Label>
                  <select required value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} className="flex h-11 w-full rounded-xl border border-input bg-muted/30 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <option value="" disabled>Select a category...</option>
                    {categories.filter(c => c.status === 'active').map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2 p-4 rounded-xl bg-accent/30 border border-dashed">
                  <Label className="text-xs font-bold uppercase tracking-wider text-primary">Unit & Packaging Size</Label>
                  <p className="text-[11px] text-muted-foreground">Define the size of a single pack/piece (e.g. 1.5 Liter bottle, 1kg daal pack, 100g chips)</p>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-muted-foreground">Size / Value</Label>
                      <Input type="number" step="0.01" min="0" value={formData.unitValue} onChange={(e) => setFormData({ ...formData, unitValue: e.target.value })} className="h-10 rounded-lg bg-background" placeholder="1.5" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-muted-foreground">Unit Type</Label>
                      <select value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <option value="pcs">Pieces (pcs)</option>
                        <option value="pack">Pack</option>
                        <option value="box">Box</option>
                        <option value="kg">Kilograms (kg)</option>
                        <option value="g">Grams (g)</option>
                        <option value="l">Liters (L)</option>
                        <option value="ml">Milliliters (ml)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Selling Price *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-bold">Rs.</span>
                    <Input required type="number" step="0.01" min="0" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="pl-10 h-11 rounded-xl bg-muted/30" placeholder="0.00" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cost Price *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-bold">Rs.</span>
                    <Input required type="number" step="0.01" min="0" value={formData.costPrice} onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })} className="pl-10 h-11 rounded-xl bg-muted/30" placeholder="0.00" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Initial Stock *</Label>
                  <Input required type="number" min="0" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="h-11 rounded-xl bg-muted/30" placeholder="e.g. 100" />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Minimum Stock Alert</Label>
                  <Input type="number" min="0" value={formData.minStock} onChange={(e) => setFormData({ ...formData, minStock: e.target.value })} className="h-11 rounded-xl bg-muted/30" placeholder="e.g. 10" />
                </div>
              </div>

              <div className="pt-6 border-t flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => router.push("/products")} className="h-11 px-6 rounded-xl font-bold">
                  Cancel
                </Button>
                <Button type="submit" className="h-11 px-6 rounded-xl font-bold gap-2 shadow-lg shadow-primary/20" disabled={isLoading}>
                  <Save className="h-4 w-4" /> {isLoading ? "Saving..." : "Save Product"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </motion.div>
    </div>
  );
}