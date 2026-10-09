"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchPurchases } from "@/store/actions/purchaseActions";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Package, Banknote, CreditCard, ArrowRightLeft, Eye } from "lucide-react";
import { motion } from "framer-motion";

export default function PurchasesPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { purchases, isLoading } = useSelector((state) => state.purchases);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchPurchases());
  }, [dispatch]);

  const filteredPurchases = purchases.filter((p) =>
    p.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 h-full min-h-0">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Purchase Orders</h1>
          <p className="text-xs text-muted-foreground mt-0.5">History of incoming stock</p>
        </div>
        <Button onClick={() => router.push("/purchases/add")} className="gap-2 h-10 px-4 rounded-xl shadow-md shadow-primary/20">
          <Plus className="h-4 w-4" /> New Purchase (Stock In)
        </Button>
      </motion.div>

      <Card className="flex-1 min-h-0 flex flex-col overflow-hidden border-2 shadow-sm">
        <div className="p-4 border-b bg-muted/20 shrink-0">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search by PO Number or Supplier..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="pl-10 h-10 rounded-xl bg-background border-muted-foreground/20" 
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto sidebar-scroll">
          {isLoading ? (
            <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="sticky top-0 bg-muted/40 backdrop-blur-md z-10 border-b">
                <tr>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">PO Number / Date</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">Supplier</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-center">Items Added</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Total Amount</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-center">Payment</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredPurchases.map((po) => (
                  <tr key={po._id} className="hover:bg-accent/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-bold font-mono">{po.poNumber}</p>
                      <p className="text-[10px] text-muted-foreground">{formatDate(po.createdAt)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold truncate max-w-[180px]">{po.companyName}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{po.supplierName}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant="outline" className="font-bold">
                        <Package className="h-3 w-3 mr-1" />{po.itemsCount}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <p className="font-bold text-primary">{formatCurrency(po.totalAmount)}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant="outline" className={cn("font-bold uppercase text-[9px] tracking-wider", po.paymentMethod === "cash" && "border-emerald-200 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30", po.paymentMethod === "credit" && "border-red-200 text-red-600 bg-red-50 dark:bg-red-950/30", po.paymentMethod === "partial" && "border-blue-200 text-blue-600 bg-blue-50 dark:bg-blue-950/30")}>
                        {po.paymentMethod === "partial" ? <ArrowRightLeft className="h-3 w-3 mr-1" /> : po.paymentMethod === "cash" ? <Banknote className="h-3 w-3 mr-1" /> : <CreditCard className="h-3 w-3 mr-1" />}
                        {po.paymentMethod}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredPurchases.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">No purchase records found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}