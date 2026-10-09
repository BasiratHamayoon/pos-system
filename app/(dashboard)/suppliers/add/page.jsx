"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { createSupplier } from "@/store/actions/supplierActions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Factory, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function AddSupplierPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ name: "", companyName: "", phone: "", address: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await dispatch(createSupplier(formData));
      router.push("/suppliers");
    } catch (err) { setError(err); } finally { setIsLoading(false); }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto pb-10">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => router.push("/suppliers")}><ArrowLeft className="h-4 w-4" /></Button>
        <div><h1 className="text-2xl font-bold tracking-tight">Add Supplier</h1><p className="text-xs text-muted-foreground mt-0.5">Register a new warehouse or distributor</p></div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <form onSubmit={handleSubmit}>
          <Card className="border-2 shadow-sm overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary to-primary/50" />
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Factory className="h-6 w-6" /></div>
                <div><h3 className="font-bold">Supplier Details</h3></div>
              </div>

              {error && <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-xs"><AlertCircle className="h-4 w-4 shrink-0" /><span>{error}</span></div>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Company / Warehouse Name *</Label>
                  <Input required value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} className="h-11 rounded-xl bg-muted/30" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Representative Name *</Label>
                  <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="h-11 rounded-xl bg-muted/30" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone Number *</Label>
                  <Input required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="h-11 rounded-xl bg-muted/30" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Address</Label>
                  <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="h-11 rounded-xl bg-muted/30" />
                </div>
              </div>

              <div className="pt-6 border-t flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => router.push("/suppliers")} className="h-11 px-6 rounded-xl font-bold">Cancel</Button>
                <Button type="submit" className="h-11 px-6 rounded-xl font-bold gap-2 shadow-lg shadow-primary/20" disabled={isLoading}><Save className="h-4 w-4" /> Save</Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </motion.div>
    </div>
  );
}