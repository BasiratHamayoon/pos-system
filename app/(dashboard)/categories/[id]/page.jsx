"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { editCategory } from "@/store/actions/categoryActions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Tags, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const category = categories.find((c) => c.id === params.id);
    if (category) {
      setFormData(category);
    }
  }, [categories, params.id]);

  if (!formData) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold">Category Not Found</h2>
        <Button variant="link" onClick={() => router.push("/categories")} className="mt-2">Return to Categories</Button>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(editCategory(formData));
    router.push("/categories");
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto pb-10">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => router.push("/categories")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Category</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Update category information</p>
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
                  <Tags className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold">Category Details</h3>
                  <p className="text-xs text-muted-foreground">ID: {formData.id}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category Name *</Label>
                  <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="h-11 rounded-xl bg-muted/30" />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</Label>
                  <textarea value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} className="flex w-full rounded-xl border border-input bg-muted/30 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-none" />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</Label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="flex h-11 w-full rounded-xl border border-input bg-muted/30 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => router.push("/categories")} className="h-11 px-6 rounded-xl font-bold">
                  Cancel
                </Button>
                <Button type="submit" className="h-11 px-6 rounded-xl font-bold gap-2 shadow-lg shadow-primary/20">
                  <Save className="h-4 w-4" /> Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </motion.div>
    </div>
  );
}