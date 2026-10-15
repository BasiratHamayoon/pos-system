"use client";

import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { fetchProductById, editProduct } from "@/store/actions/productActions";
import { fetchCategories } from "@/store/actions/categoryActions";
import { fetchBrands } from "@/store/actions/brandActions";
import { fetchVariantTemplates } from "@/store/actions/variantTemplateActions";
import { debounce } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Package, AlertCircle, Plus, Trash2, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();

  const { categories } = useSelector((state) => state.categories);
  const { brands } = useSelector((state) => state.brands);
  const { variantTemplates } = useSelector((state) => state.variantTemplates);

  const [formData, setFormData] = useState({ name: "", categoryId: "", brandId: "" });
  const [variants, setVariants] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (categories.length === 0) dispatch(fetchCategories());
    if (brands.length === 0) dispatch(fetchBrands());
    dispatch(fetchVariantTemplates());

    const loadProduct = async () => {
      try {
        const product = await fetchProductById(params.id);
        setFormData({
          name: product.name,
          categoryId: product.category,
          brandId: product.brand || "",
        });

        if (product.variants && product.variants.length > 0) {
          const loadedVariants = product.variants.map(v => ({
            _id: v._id,
            variantTemplateId: v.variantTemplate || "",
            price: v.price.toString(),
            costPrice: v.costPrice.toString(),
            stock: v.stock.toString(),
            minStock: v.minStock.toString()
          }));
          setVariants(loadedVariants);
        } else {
          setVariants([{ variantTemplateId: "", price: "0", costPrice: "0", stock: "0", minStock: "10" }]);
        }
      } catch (err) {
        setError(err);
      } finally {
        setFetchLoading(false);
      }
    };
    loadProduct();
  }, [dispatch, params.id, categories.length, brands.length]);

  const activeTemplates = variantTemplates.filter(v => v.status === "active");

  const handleAddVariant = () => {
    setVariants([...variants, { variantTemplateId: "", price: "", costPrice: "", stock: "", minStock: "10" }]);
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

  const getTemplateDetails = (templateId) => {
    return activeTemplates.find(t => t._id === templateId);
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
      if (!v.variantTemplateId) {
        setError("Please select a variant template for all variants");
        setIsLoading(false);
        return;
      }
      if (!v.price || !v.costPrice || !v.stock || !v.minStock) {
        setError("All pricing and stock fields are required");
        setIsLoading(false);
        return;
      }
    }

    const templateIds = variants.map(v => v.variantTemplateId);
    if (new Set(templateIds).size !== templateIds.length) {
      setError("You cannot select the same variant template twice");
      setIsLoading(false);
      return;
    }

    const payload = {
      name: formData.name,
      categoryId: formData.categoryId,
      brandId: formData.brandId || null,
      variants: variants.map(v => {
        const template = getTemplateDetails(v.variantTemplateId);
        return {
          ...(v._id ? { _id: v._id } : {}),
          variantTemplateId: v.variantTemplateId,
          label: template.label,
          unitValue: template.unitValue,
          unit: template.unitName,
          price: parseFloat(v.price) || 0,
          costPrice: parseFloat(v.costPrice) || 0,
          stock: parseInt(v.stock) || 0,
          minStock: parseInt(v.minStock) || 0,
        };
      })
    };

    try {
      await dispatch(editProduct(params.id, payload));
      router.push("/products");
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSubmit = useCallback(debounce(() => processSubmit(), 500), [dispatch, params.id, formData, variants]);

  const handleSubmit = (e) => {
    e.preventDefault();
    debouncedSubmit();
  };

  if (fetchLoading) {
    return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => router.push("/products")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Update inventory details and variants</p>
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
                <div><h3 className="font-bold">Basic Information</h3><p className="text-xs text-muted-foreground">ID: {params.id}</p></div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-xs border border-destructive/20">
                  <AlertCircle className="h-4 w-4 shrink-0" /><span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2 md:col-span-3">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Master Product Name *</Label>
                  <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="h-11 rounded-xl bg-muted/30" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category *</Label>
                  <select required value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} className="flex h-11 w-full rounded-xl border bg-muted/30 px-3 py-2 text-sm">
                    {categories.map((cat) => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Brand (Optional)</Label>
                  <select value={formData.brandId} onChange={(e) => setFormData({ ...formData, brandId: e.target.value })} className="flex h-11 w-full rounded-xl border bg-muted/30 px-3 py-2 text-sm">
                    <option value="">No Brand</option>
                    {brands.map((b) => (<option key={b._id} value={b._id}>{b.name}</option>))}
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
                  <p className="text-xs text-muted-foreground mt-0.5">Select templates and update pricing & stock</p>
                </div>
                <Button type="button" onClick={handleAddVariant} variant="outline" className="gap-2 h-9 rounded-lg text-xs font-bold">
                  <Plus className="h-3.5 w-3.5" /> Add Variant
                </Button>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {variants.map((variant, index) => {
                    const selectedTemplate = getTemplateDetails(variant.variantTemplateId);
                    return (
                      <motion.div key={index} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="p-4 rounded-xl border-2 bg-muted/10 relative space-y-4">
                        {variants.length > 1 && (
                          <button type="button" onClick={() => handleRemoveVariant(index)} className="absolute -top-3 -right-3 h-7 w-7 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-md hover:scale-110 transition-transform z-10">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}

                        <div className="flex items-end gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                          <Layers className="h-4 w-4 text-primary mt-2 shrink-0" />
                          <div className="flex-1 space-y-1">
                            <Label className="text-[10px] font-bold text-primary uppercase">Select Variant Template *</Label>
                            <select required value={variant.variantTemplateId} onChange={(e) => updateVariant(index, 'variantTemplateId', e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-xs font-semibold">
                              <option value="" disabled>-- Choose a variant --</option>
                              {activeTemplates.map(t => (
                                <option key={t._id} value={t._id}>
                                  {t.label} ({t.unitValue} {t.unitSymbol})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold text-muted-foreground">Sale Price *</Label>
                            <div className="relative">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">Rs</span>
                              <Input required type="number" step="0.01" min="0" value={variant.price} onChange={(e) => updateVariant(index, 'price', e.target.value)} className="h-10 text-xs bg-background pl-7" />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold text-muted-foreground">Cost Price *</Label>
                            <div className="relative">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">Rs</span>
                              <Input required type="number" step="0.01" min="0" value={variant.costPrice} onChange={(e) => updateVariant(index, 'costPrice', e.target.value)} className="h-10 text-xs bg-background pl-7" />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold text-muted-foreground">Current Stock *</Label>
                            <Input required type="number" min="0" value={variant.stock} onChange={(e) => updateVariant(index, 'stock', e.target.value)} className="h-10 text-xs bg-background" />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold text-muted-foreground">Min Stock Alert *</Label>
                            <Input required type="number" min="0" value={variant.minStock} onChange={(e) => updateVariant(index, 'minStock', e.target.value)} className="h-10 text-xs bg-background" />
                          </div>
                        </div>

                        {selectedTemplate && (
                          <div className="flex flex-wrap gap-4 pt-3 border-t text-[11px] text-muted-foreground">
                            <span><strong className="text-foreground">Label:</strong> {selectedTemplate.label}</span>
                            <span><strong className="text-foreground">Size:</strong> {selectedTemplate.unitValue}</span>
                            <span><strong className="text-foreground">Unit:</strong> {selectedTemplate.unitName} ({selectedTemplate.unitSymbol})</span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              <div className="pt-6 border-t flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => router.push("/products")} className="h-11 px-6 rounded-xl font-bold">Cancel</Button>
                <Button type="submit" className="h-11 px-6 rounded-xl font-bold gap-2 shadow-lg shadow-primary/20" disabled={isLoading}>
                  <Save className="h-4 w-4" /> {isLoading ? "Updating..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </motion.div>
    </div>
  );
}