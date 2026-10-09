"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { createPurchase } from "@/store/actions/purchaseActions";
import { fetchSuppliers } from "@/store/actions/supplierActions";
import { fetchProducts } from "@/store/actions/productActions";
import { formatCurrency, cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Trash2, Search, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddPurchasePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { suppliers } = useSelector((state) => state.suppliers);
  const { products } = useSelector((state) => state.products);

  const [supplierId, setSupplierId] = useState("");
  const [items, setItems] = useState([]);
  
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [addQty, setAddQty] = useState("");
  const [addCost, setAddCost] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paidAmount, setPaidAmount] = useState("");
  const [discount, setDiscount] = useState("0");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(fetchSuppliers());
    dispatch(fetchProducts());
  }, [dispatch]);

  const searchResults = search.length > 1 
    ? products.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) || 
        p.barcode?.includes(search)
      )
    : [];

  const handleSelectProduct = (prod) => {
    setSelectedProduct(prod);
    setSearch("");
    if (prod.variants && prod.variants.length > 0) {
      const v = prod.variants[0];
      setSelectedVariant(v._id);
      setAddCost(v.costPrice.toString());
      setAddQty("1");
    }
  };

  const handleVariantChange = (vId) => {
    setSelectedVariant(vId);
    const v = selectedProduct.variants.find(vx => vx._id === vId);
    if (v) setAddCost(v.costPrice.toString());
  };

  const handleAddItem = () => {
    if (!selectedProduct || !selectedVariant || !addQty || !addCost) return;
    const variant = selectedProduct.variants.find(v => v._id === selectedVariant);
    
    setItems([...items, {
      id: Math.random().toString(),
      productId: selectedProduct._id,
      variantId: variant._id,
      name: selectedProduct.name,
      variantLabel: variant.label,
      qty: parseInt(addQty),
      costPrice: parseFloat(addCost),
      total: parseInt(addQty) * parseFloat(addCost)
    }]);

    setSelectedProduct(null);
    setSelectedVariant("");
    setAddQty("");
    setAddCost("");
  };

  const subtotal = items.reduce((sum, i) => sum + i.total, 0);
  const discountVal = parseFloat(discount) || 0;
  const totalAmount = subtotal - discountVal;
  const paidVal = parseFloat(paidAmount) || 0;
  let dueAmount = 0;

  if (paymentMethod === 'credit') dueAmount = totalAmount;
  else if (paymentMethod === 'partial') dueAmount = Math.max(0, totalAmount - paidVal);

  useEffect(() => {
    if (paymentMethod === 'cash') setPaidAmount(totalAmount.toString());
    else if (paymentMethod === 'credit') setPaidAmount("0");
  }, [paymentMethod, totalAmount]);

  const handleSubmit = async () => {
    setError("");
    if (!supplierId) { setError("Please select a supplier"); return; }
    if (items.length === 0) { setError("Purchase list is empty"); return; }
    
    setIsLoading(true);
    try {
      await dispatch(createPurchase({
        supplierId,
        items,
        subtotal,
        discount: discountVal,
        totalAmount,
        paidAmount: paymentMethod === 'credit' ? 0 : paidVal,
        dueAmount,
        paymentMethod
      }));
      router.push("/purchases");
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => router.push("/purchases")}><ArrowLeft className="h-4 w-4" /></Button>
          <div><h1 className="text-2xl font-bold tracking-tight">New Purchase Order</h1><p className="text-xs text-muted-foreground mt-0.5">Record incoming stock and payments</p></div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-6">
          <Card className="border-2 shadow-sm">
            <CardHeader className="bg-muted/10 border-b py-3 px-4"><CardTitle className="text-sm font-bold">1. Select Supplier</CardTitle></CardHeader>
            <CardContent className="p-4">
              <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className="flex h-11 w-full rounded-xl border bg-background px-3 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <option value="" disabled>Choose a supplier...</option>
                {suppliers.filter(s => s.status === 'active').map(s => <option key={s._id} value={s._id}>{s.companyName} ({s.name})</option>)}
              </select>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-sm">
            <CardHeader className="bg-muted/10 border-b py-3 px-4"><CardTitle className="text-sm font-bold">2. Add Products to Stock</CardTitle></CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="relative">
                <div className="flex items-center border-2 rounded-xl bg-background overflow-hidden focus-within:border-primary transition-colors">
                  <div className="pl-3"><Search className="h-4 w-4 text-muted-foreground" /></div>
                  <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search product to add..." className="w-full h-11 bg-transparent px-3 text-sm outline-none" />
                </div>
                {searchResults.length > 0 && !selectedProduct && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-xl shadow-xl max-h-[250px] overflow-y-auto z-50 p-1">
                    {searchResults.map(p => (
                      <div key={p._id} onClick={() => handleSelectProduct(p)} className="p-3 hover:bg-accent rounded-lg cursor-pointer flex justify-between items-center text-sm font-medium border-b last:border-0">
                        <div>
                          <span>{p.name}</span>
                          <span className="text-xs text-muted-foreground block">{p.variants?.length || 0} variants</span>
                        </div>
                        <span className="text-xs text-primary">{p.brandName}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedProduct && (
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-primary">{selectedProduct.name}</h4>
                    <button onClick={() => setSelectedProduct(null)} className="text-xs font-semibold text-muted-foreground hover:text-foreground">Cancel</button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase">Variant / Size</Label>
                      <select value={selectedVariant} onChange={(e) => handleVariantChange(e.target.value)} className="w-full h-9 rounded-lg border text-xs font-semibold px-2 outline-none">
                        {selectedProduct.variants?.map(v => <option key={v._id} value={v._id}>{v.label}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase">Incoming Qty</Label>
                      <Input type="number" min="1" value={addQty} onChange={(e) => setAddQty(e.target.value)} className="h-9 text-xs" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase">Unit Cost (Rs)</Label>
                      <Input type="number" min="0" value={addCost} onChange={(e) => setAddCost(e.target.value)} className="h-9 text-xs" />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={handleAddItem} className="w-full h-9 text-xs font-bold gap-1 rounded-lg"><Plus className="h-3.5 w-3.5"/> Add</Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="border rounded-xl overflow-hidden mt-4">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 border-b"><tr className="text-muted-foreground font-bold uppercase tracking-wider"><th className="px-3 py-2">Item</th><th className="px-3 py-2">Variant</th><th className="px-3 py-2 text-center">Qty</th><th className="px-3 py-2 text-right">Cost</th><th className="px-3 py-2 text-right">Total</th><th className="px-3 py-2"></th></tr></thead>
                  <tbody className="divide-y font-medium">
                    {items.map((item, i) => (
                      <tr key={item.id} className="hover:bg-muted/20">
                        <td className="px-3 py-2.5 font-bold">{item.name}</td>
                        <td className="px-3 py-2.5"><Badge variant="secondary" className="text-[9px]">{item.variantLabel}</Badge></td>
                        <td className="px-3 py-2.5 text-center">{item.qty}</td>
                        <td className="px-3 py-2.5 text-right">{formatCurrency(item.costPrice)}</td>
                        <td className="px-3 py-2.5 text-right text-primary font-bold">{formatCurrency(item.total)}</td>
                        <td className="px-3 py-2.5 text-right"><button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="text-destructive hover:text-destructive/80"><Trash2 className="h-3.5 w-3.5" /></button></td>
                      </tr>
                    ))}
                    {items.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No items added to this purchase order yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-2 shadow-sm sticky top-20">
            <CardHeader className="bg-muted/10 border-b py-3 px-4"><CardTitle className="text-sm font-bold">3. Payment & Submit</CardTitle></CardHeader>
            <CardContent className="p-4 space-y-5">
              <div className="space-y-2 p-3 bg-muted/20 border rounded-xl">
                <div className="flex justify-between text-xs"><span className="text-muted-foreground font-medium">Subtotal</span><span className="font-bold">{formatCurrency(subtotal)}</span></div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium">Discount (Rs)</span>
                  <Input type="number" min="0" value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-20 h-7 text-xs text-right p-1" />
                </div>
                <div className="pt-2 border-t flex justify-between items-center"><span className="text-sm font-bold">Grand Total</span><span className="text-lg font-black text-primary">{formatCurrency(totalAmount)}</span></div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Payment Method</Label>
                <div className="grid grid-cols-3 gap-2">
                  {['cash', 'credit', 'partial'].map(m => (
                    <button key={m} onClick={() => setPaymentMethod(m)} className={cn("px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all border-2", paymentMethod === m ? "border-primary bg-primary/10 text-primary" : "border-transparent bg-muted text-muted-foreground hover:bg-accent")}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod !== 'credit' && (
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Paid Amount</Label>
                  <Input type="number" min="0" value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} className="h-10 font-bold" />
                </div>
              )}

              {(paymentMethod === 'credit' || paymentMethod === 'partial') && (
                <div className="flex justify-between text-xs p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50">
                  <span className="font-bold text-red-700 dark:text-red-400">Total Payable (Udhaar)</span>
                  <span className="font-black text-red-600 dark:text-red-500">{formatCurrency(dueAmount)}</span>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-xs border border-destructive/20">
                  <AlertCircle className="h-4 w-4 shrink-0" /><span>{error}</span>
                </div>
              )}

              <Button onClick={handleSubmit} disabled={isLoading || items.length === 0 || !supplierId} className="w-full h-12 font-bold text-sm shadow-lg shadow-primary/20 rounded-xl gap-2">
                {isLoading ? "Saving..." : <><CheckCircle2 className="h-4 w-4" /> Finalize Purchase</>}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}