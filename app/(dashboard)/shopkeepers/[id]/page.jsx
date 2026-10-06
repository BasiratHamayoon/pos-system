"use client";

import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { fetchShopkeeperById, editShopkeeper } from "@/store/actions/shopkeeperActions";
import { debounce } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function EditShopkeeperPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();
  const { shopkeepers } = useSelector((state) => state.shopkeepers);

  const [formData, setFormData] = useState({
    name: "",
    shopName: "",
    phone: "",
    address: "",
    status: "active",
  });
  const [fetchLoading, setFetchLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadShopkeeper = async () => {
      try {
        const sk = await fetchShopkeeperById(params.id);
        if (sk) {
          setFormData({
            name: sk.name || "",
            shopName: sk.shopName || "",
            phone: sk.phone || "",
            address: sk.address || "",
            status: sk.status || "active",
          });
        }
      } catch (err) {
        // Fallback to local Redux state if available
        const localSk = shopkeepers.find((s) => String(s._id || s.id) === String(params.id));
        if (localSk) {
          setFormData({
            name: localSk.name || "",
            shopName: localSk.shopName || "",
            phone: localSk.phone || "",
            address: localSk.address || "",
            status: localSk.status || "active",
          });
        } else {
          setError(err);
        }
      } finally {
        setFetchLoading(false);
      }
    };
    loadShopkeeper();
  }, [params.id, shopkeepers]);

  const processSubmit = async (data) => {
    setIsLoading(true);
    setError("");
    try {
      await dispatch(editShopkeeper(params.id, {
        name: data.name,
        shopName: data.shopName,
        phone: data.phone,
        address: data.address,
        status: data.status,
      }));
      router.push("/shopkeepers");
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSubmit = useCallback(debounce((d) => processSubmit(d), 500), [dispatch, params.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    debouncedSubmit(formData);
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-10">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => router.push("/shopkeepers")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Profile</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Update customer information</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <form onSubmit={handleSubmit}>
          <Card className="border-2 shadow-sm overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary to-primary/50" />
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary text-sm font-bold">
                  {formData.name ? formData.name.split(" ").map(n => n[0]).join("").slice(0, 2) : "CU"}
                </div>
                <div>
                  <h3 className="font-bold">Profile Details</h3>
                  <p className="text-xs text-muted-foreground font-mono">ID: {params.id}</p>
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
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Owner Name *</Label>
                  <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="h-11 rounded-xl bg-muted/30" />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Shop / Business Name *</Label>
                  <Input required value={formData.shopName} onChange={(e) => setFormData({ ...formData, shopName: e.target.value })} className="h-11 rounded-xl bg-muted/30" />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone Number *</Label>
                  <Input required type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="h-11 rounded-xl bg-muted/30" />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Store Address</Label>
                  <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="h-11 rounded-xl bg-muted/30" />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Account Status</Label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="flex h-11 w-full rounded-xl border border-input bg-muted/30 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    <option value="active">Active (Can purchase)</option>
                    <option value="inactive">Inactive (Suspended)</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => router.push("/shopkeepers")} className="h-11 px-6 rounded-xl font-bold">
                  Cancel
                </Button>
                <Button type="submit" className="h-11 px-6 rounded-xl font-bold gap-2 shadow-lg shadow-primary/20" disabled={isLoading}>
                  <Save className="h-4 w-4" /> {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </motion.div>
    </div>
  );
}