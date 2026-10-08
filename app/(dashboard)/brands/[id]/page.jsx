"use client";

import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { fetchBrandById, editBrand } from "@/store/actions/brandActions";
import { debounce } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Store, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function EditBrandPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBrand = async () => {
      try {
        const brand = await fetchBrandById(params.id);
        setFormData(brand);
      } catch (err) { setError(err); } 
      finally { setFetchLoading(false); }
    };
    loadBrand();
  }, [params.id]);

  const processSubmit = async (data) => {
    setIsLoading(true);
    setError("");
    try {
      await dispatch(editBrand(params.id, data));
      router.push("/brands");
    } catch (err) { setError(err); } 
    finally { setIsLoading(false); }
  };

  const debouncedSubmit = useCallback(debounce((d) => processSubmit(d), 500), [dispatch, params.id]);
  const handleSubmit = (e) => { e.preventDefault(); debouncedSubmit(formData); };

  if (fetchLoading) return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  if (!formData) return (
    <div className="flex flex-col items-center justify-center h-full"><AlertCircle className="h-12 w-12 text-muted-foreground mb-4" /><h2 className="text-xl font-bold">Brand Not Found</h2></div>
  );

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto pb-10">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => router.push("/brands")}><ArrowLeft className="h-4 w-4" /></Button>
          <div><h1 className="text-2xl font-bold tracking-tight">Edit Brand</h1><p className="text-xs text-muted-foreground mt-0.5">Update brand information</p></div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <form onSubmit={handleSubmit}>
          <Card className="border-2 shadow-sm overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary to-primary/50" />
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Store className="h-6 w-6" /></div>
                <div><h3 className="font-bold">Brand Details</h3><p className="text-xs text-muted-foreground">ID: {formData._id}</p></div>
              </div>

              {error && <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-xs border border-destructive/20"><AlertCircle className="h-4 w-4 shrink-0" /><span>{error}</span></div>}

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Brand Name *</Label>
                  <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="h-11 rounded-xl bg-muted/30" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</Label>
                  <textarea value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="flex w-full rounded-xl border border-input bg-muted/30 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</Label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="flex h-11 w-full rounded-xl border border-input bg-muted/30 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <option value="active">Active</option><option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => router.push("/brands")} className="h-11 px-6 rounded-xl font-bold">Cancel</Button>
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