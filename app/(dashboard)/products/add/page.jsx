"use client";

import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { createProduct } from "@/store/actions/productActions";
import { fetchCategories } from "@/store/actions/categoryActions";
import { fetchBrands } from "@/store/actions/brandActions";
import { debounce } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Package, AlertCircle, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddProductPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const { brands } = useSelector((state) => state.brands);

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    brandId: "",
  });

  const [variants, setVariants] = useState([
    { label: "Standard", unitValue: "1", unit: "pcs", price: "", costPrice: "", stock: "", minStock: "10" }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (categories.length === 0) dispatch(fetchCategories());
    if (brands.length === 0) dispatch(fetchBrands());
  }, [dispatch, categories.length, brands.length]);

  const handleAddVariant = () => {
    setVariants([...variants, { label: "", unitValue: "1", unit: "pcs", price: "", costPrice: "", stock: "", minStock: "10" }]);
  };

  const handleRemoveVariant = (index) => {
    if (variants.length === 1) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const processSubmit = async () => {
    setIsLoading(true);
    setError("");

    if (!formData.name || !formData.categoryId) {
      setError("Name and Category are required");
      setIsLoading(false);
      return;
    }
    
    for (let v of variants) {
      if (!v.label || !v.price || !v.costPrice || !v.stock || !v.minStock) {
        setError("All variant fields including Min Alert are required");
        setIsLoading(false);
        return;
      }
    }

    const payload = {
      name: formData.name,
      categoryId: formData.categoryId,
      brandId: formData.brandId || null,
      variants: variants.map(v => ({
        label: v.label,
        unitValue: parseFloat(v.unitValue) || 1,
        unit: v.unit,
        price: parseFloat(v.price) || 0,
        costPrice: parseFloat(v.costPrice) || 0,
        stock: parseInt(v.stock) || 0,
        minStock: parseInt(v.minStock) || 0,
      }))
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

  const debouncedSubmit = useCallback(debounce(() => processSubmit(), 500), [dispatch, formData, variants]);

  const handleSubmit = (e) => {
    e.preventDefault();
    debouncedSubmit();
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => router.push("/products")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Add Product</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Create a new item with sizes/variants</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <form onSubmit={handleSubmit}>
          <Card className="border-2 shadow-sm overflow-hidden mb-6">
            <div className="h-2 bg-gradient-to-r from-primary to-primary/50" />
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Package className="h-6 w-6" />
                </div>
                <div><h3 className="font-bold">Basic Information</h3></div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-xs border border-destructive/20">
                  <AlertCircle className="h-4 w-4 shrink-0" /><span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2 md:col-span-3">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Master Product Name *</Label>
                  <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="h-11 rounded-xl bg-muted/30" placeholder="e.g. Lays Classic Salted" />
                </div>
                <div className="space-y-2 md:col-span-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category *</Label>
                  <select required value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} className="flex h-11 w-full rounded-xl border border-input bg-muted/30 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <option value="" disabled>Select category...</option>
                    {categories.filter(c => c.status === 'active').map((cat) => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}
                  </select>
                </div>
                <div className="space-y-2 md:col-span-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Brand (Optional)</Label>
                  <select value={formData.brandId} onChange={(e) => setFormData({ ...formData, brandId: e.target.value })} className="flex h-11 w-full rounded-xl border border-input bg-muted/30 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <option value="">No Brand</option>
                    {brands.filter(b => b.status === 'active').map((b) => (<option key={b._id} value={b._id}>{b.name}</option>))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-sm overflow-hidden">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b">
                <div>
                  <h3 className="font-bold">Product Variants (Sizes & Pricing)</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Add different sizes like Rs 30 Pack, Rs 50 Pack, 1.5 Liter, etc.</p>
                </div>
                <Button type="button" onClick={handleAddVariant} variant="outline" className="gap-2 h-9 rounded-lg text-xs font-bold">
                  <Plus className="h-3.5 w-3.5" /> Add Size Variant
                </Button>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {variants.map((variant, index) => (
                    <motion.div key={index} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="p-4 rounded-xl border-2 bg-muted/10 relative">
                      {variants.length > 1 && (
                        <button type="button" onClick={() => handleRemoveVariant(index)} className="absolute -top-3 -right-3 h-7 w-7 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-md hover:scale-110 transition-transform z-10">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                      
                      <div className="grid grid-cols-2 md:grid-cols-8 gap-4">
                        <div className="space-y-1.5 md:col-span-2">
                          <Label className="text-[10px] font-bold text-muted-foreground">Variant Name / Label *</Label>
                          <Input required value={variant.label} onChange={(e) => updateVariant(index, 'label', e.target.value)} className="h-9 text-xs bg-background" placeholder="e.g. Rs 50 Pack" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-bold text-muted-foreground">Size</Label>
                          <Input type="number" step="0.01" min="0" value={variant.unitValue} onChange={(e) => updateVariant(index, 'unitValue', e.target.value)} className="h-9 text-xs bg-background" placeholder="1" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-bold text-muted-foreground">Unit</Label>
                          <select value={variant.unit} onChange={(e) => updateVariant(index, 'unit', e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                            <option value="pcs">Pcs</option><option value="pack">Pack</option><option value="box">Box</option><option value="kg">KG</option><option value="g">g</option><option value="l">L</option><option value="ml">ml</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-bold text-muted-foreground">Sale Price *</Label>
                          <Input required type="number" step="0.01" min="0" value={variant.price} onChange={(e) => updateVariant(index, 'price', e.target.value)} className="h-9 text-xs bg-background" placeholder="0.00" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-bold text-muted-foreground">Cost Price *</Label>
                          <Input required type="number" step="0.01" min="0" value={variant.costPrice} onChange={(e) => updateVariant(index, 'costPrice', e.target.value)} className="h-9 text-xs bg-background" placeholder="0.00" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-bold text-muted-foreground">Initial Stock *</Label>
                          <Input required type="number" min="0" value={variant.stock} onChange={(e) => updateVariant(index, 'stock', e.target.value)} className="h-9 text-xs bg-background" placeholder="0" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-bold text-muted-foreground">Min Alert *</Label>
                          <Input required type="number" min="0" value={variant.minStock} onChange={(e) => updateVariant(index, 'minStock', e.target.value)} className="h-9 text-xs bg-background" placeholder="10" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="pt-6 border-t flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => router.push("/products")} className="h-11 px-6 rounded-xl font-bold">Cancel</Button>
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