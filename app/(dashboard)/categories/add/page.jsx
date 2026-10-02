"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { createCategory } from "@/store/actions/categoryActions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Tags } from "lucide-react";
import { motion } from "framer-motion";

export default function AddCategoryPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createCategory(formData));
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
            <h1 className="text-2xl font-bold tracking-tight">Add Category</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Create a new product grouping</p>
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
                  <p className="text-xs text-muted-foreground">Basic information for sorting products</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category Name *</Label>
                  <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="h-11 rounded-xl bg-muted/30" placeholder="e.g. Beverages" />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</Label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} className="flex w-full rounded-xl border border-input bg-muted/30 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-none" placeholder="Brief description of items in this category..." />
                </div>
              </div>

              <div className="pt-6 border-t flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => router.push("/categories")} className="h-11 px-6 rounded-xl font-bold">
                  Cancel
                </Button>
                <Button type="submit" className="h-11 px-6 rounded-xl font-bold gap-2 shadow-lg shadow-primary/20">
                  <Save className="h-4 w-4" /> Save Category
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </motion.div>
    </div>
  );
}