"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { fetchCredits, makePayment } from "@/store/actions/creditActions";
import { fetchSales } from "@/store/actions/salesActions";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { ArrowLeft, Store, AlertCircle, CreditCard, Banknote, History, FileText, ArrowRightLeft, Calendar, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CreditDetailPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();

  const { credits } = useSelector((state) => state.credits);
  const { sales } = useSelector((state) => state.sales);

  const [credit, setCredit] = useState(null);
  const [linkedSales, setLinkedSales] = useState([]);
  
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (credits.length === 0) dispatch(fetchCredits());
    if (sales.length === 0) dispatch(fetchSales());
  }, [dispatch, credits.length, sales.length]);

  useEffect(() => {
    const foundCredit = credits.find((c) => c._id === params.id);
    if (foundCredit) {
      setCredit(foundCredit);
      const matchedSales = sales.filter((s) => foundCredit.invoices?.includes(s.invoiceNo));
      setLinkedSales(matchedSales.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }
  }, [credits, sales, params.id]);

  if (!credit) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted"><AlertCircle className="h-7 w-7 text-muted-foreground" /></div>
        <h2 className="text-xl font-bold">Credit Record Not Found</h2>
        <Button variant="outline" onClick={() => router.push("/credit")} className="mt-2 rounded-xl">Return to Credits</Button>
      </div>
    );
  }

  const handleOpenPayment = () => {
    setPaymentAmount(credit.totalCredit.toString());
    setPaymentError("");
    setPaymentModal(true);
  };

  const handleProcessPayment = async () => {
    setPaymentError("");
    const amount = parseFloat(paymentAmount);

    if (isNaN(amount) || amount <= 0) { setPaymentError("Please enter a valid amount greater than 0"); return; }
    if (amount > credit.totalCredit) { setPaymentError("Payment cannot exceed total outstanding credit"); return; }

    setIsProcessing(true);
    try {
      await dispatch(makePayment(credit._id, amount));
      setPaymentModal(false);
      setPaymentAmount("");
    } catch (err) {
      setPaymentError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 h-full min-h-0 max-w-6xl mx-auto pb-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => router.push("/credit")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight truncate">{credit.shopkeeperName}</h1>
              <Badge variant="secondary" className={cn("font-bold uppercase tracking-wider text-[9px] shrink-0", credit.status === "paid" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : credit.status === "pending" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400")}>
                {credit.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><Store className="h-3 w-3 shrink-0" /> {credit.shopName}</p>
          </div>
        </div>
        {credit.totalCredit > 0 && (
          <Button onClick={handleOpenPayment} className="gap-2 h-10 px-6 rounded-xl shadow-md shadow-primary/20 shrink-0 font-bold">
            <Banknote className="h-4 w-4" /> Receive Payment
          </Button>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 flex-1 min-h-0 items-stretch">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="min-h-0 flex flex-col gap-5">
          <Card className="border-2 shadow-sm flex flex-col">
            <CardHeader className="border-b bg-muted/10 py-4 px-5 shrink-0">
              <CardTitle className="text-sm font-bold flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" /> Credit Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-5 flex-1 flex flex-col justify-center">
              <div className="text-center py-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Total Outstanding</p>
                <p className={cn("text-5xl font-black tracking-tight", credit.totalCredit > 0 ? "text-orange-600 dark:text-orange-500" : "text-emerald-600 dark:text-emerald-500")}>
                  {formatCurrency(credit.totalCredit)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 shadow-sm flex flex-col flex-1">
            <CardHeader className="border-b bg-muted/10 py-4 px-5 shrink-0">
              <CardTitle className="text-sm font-bold flex items-center gap-2"><History className="h-4 w-4 text-primary" /> Last Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-5 flex-1 space-y-4">
              {credit.lastPaymentDate ? (
                <>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Amount Paid</p>
                    <p className="font-bold text-lg text-emerald-600 dark:text-emerald-500">{formatCurrency(credit.lastPayment)}</p>
                  </div>
                  <Separator />
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Date</p>
                    <p className="font-semibold text-sm flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-muted-foreground" />{formatDate(credit.lastPaymentDate)}</p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-4 opacity-70">
                  <Banknote className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-sm font-bold">No Payments Yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 min-h-0 flex">
          <Card className="border-2 shadow-sm w-full flex flex-col min-h-0 overflow-hidden">
            <CardHeader className="border-b bg-muted/10 py-4 px-5 shrink-0">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> Linked Invoices
                <span className="ml-auto text-[11px] font-semibold text-muted-foreground">{linkedSales.length} invoice{linkedSales.length === 1 ? "" : "s"}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 min-h-0 overflow-y-auto sidebar-scroll">
              {linkedSales.length > 0 ? (
                <table className="w-full text-sm text-left">
                  <thead className="sticky top-0 bg-muted/40 backdrop-blur-md z-10 border-b">
                    <tr>
                      <th className="px-5 py-3 font-semibold text-muted-foreground">Invoice</th>
                      <th className="px-4 py-3 font-semibold text-muted-foreground text-center">Date</th>
                      <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Total Bill</th>
                      <th className="px-5 py-3 font-semibold text-muted-foreground text-right">Credit Added</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {linkedSales.map((sale) => (
                      <tr key={sale._id} onClick={() => router.push(`/sales/${sale._id}`)} className="hover:bg-accent/50 transition-colors cursor-pointer group">
                        <td className="px-5 py-3.5"><p className="font-bold text-sm group-hover:text-primary transition-colors">{sale.invoiceNo}</p></td>
                        <td className="px-4 py-3.5 text-center text-xs">{formatDate(sale.createdAt)}</td>
                        <td className="px-4 py-3.5 text-right font-medium">{formatCurrency(sale.totalAmount)}</td>
                        <td className="px-5 py-3.5 text-right"><span className="font-bold text-orange-600 dark:text-orange-500">{formatCurrency(sale.creditAmount)}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="h-full min-h-[280px] flex flex-col items-center justify-center p-8 text-center opacity-70">
                  <FileText className="h-12 w-12 text-muted-foreground mb-3" />
                  <p className="text-sm font-bold">No Invoices Linked</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <AnimatePresence>
        {paymentModal && (
          <Dialog open={paymentModal} onOpenChange={setPaymentModal}>
            <DialogContent className="sm:max-w-[420px] rounded-2xl p-0 overflow-hidden">
              <div className="gradient-primary p-6 text-white text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 mx-auto mb-3 backdrop-blur-sm"><Banknote className="h-6 w-6 text-white" /></div>
                <DialogTitle className="text-lg font-bold text-white mb-1">Receive Payment</DialogTitle>
                <DialogDescription className="text-white/80 text-xs font-medium">{credit.shopkeeperName}</DialogDescription>
              </div>

              <div className="p-6 bg-background space-y-5">
                <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/50">
                  <span className="text-xs font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wider">Total Outstanding</span>
                  <span className="text-xl font-black text-orange-600 dark:text-orange-500">{formatCurrency(credit.totalCredit)}</span>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Payment Amount Received</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">Rs.</span>
                    <Input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} className="pl-10 h-12 text-lg font-bold rounded-xl bg-muted/30 focus-visible:ring-primary/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" min="1" max={credit.totalCredit} />
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button onClick={() => setPaymentAmount(credit.totalCredit.toString())} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 transition-all">Clear Full Amount</button>
                  </div>
                </div>

                {paymentError && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20">
                    <AlertTriangle className="h-4 w-4 shrink-0" /><span>{paymentError}</span>
                  </motion.div>
                )}

                <DialogFooter className="flex flex-row gap-2 sm:justify-center pt-2 border-t">
                  <Button variant="outline" onClick={() => setPaymentModal(false)} className="flex-1 h-11 text-xs font-bold rounded-xl">Cancel</Button>
                  <Button onClick={handleProcessPayment} disabled={isProcessing} className="flex-1 h-11 text-xs font-bold rounded-xl shadow-lg shadow-primary/20 gap-2">
                    <ArrowRightLeft className="h-4 w-4" /> {isProcessing ? "Processing..." : "Process Payment"}
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}