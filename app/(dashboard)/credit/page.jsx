"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { makePayment } from "@/store/actions/creditActions";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Search,
  CreditCard,
  AlertTriangle,
  Banknote,
  ArrowRightLeft,
  Store,
  User,
  History,
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CreditPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { credits } = useSelector((state) => state.credits);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentModal, setPaymentModal] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentError, setPaymentError] = useState("");

  // Only consider records that actually have a credit balance
  const activeCreditRecords = credits.filter(c => c.totalCredit > 0 || c.status === "paid");

  const totalOutstanding = activeCreditRecords.reduce((sum, c) => sum + c.totalCredit, 0);
  const overdueCount = activeCreditRecords.filter((c) => c.status === "overdue").length;
  const pendingCount = activeCreditRecords.filter((c) => c.status === "pending").length;

  const filteredCredits = activeCreditRecords.filter((c) => {
    const matchesSearch =
      c.shopkeeperName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.shopName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    {
      title: "Total Outstanding",
      value: formatCurrency(totalOutstanding),
      icon: CreditCard,
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
    },
    {
      title: "Active Accounts",
      value: pendingCount + overdueCount,
      icon: User,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Overdue Accounts",
      value: overdueCount,
      icon: AlertTriangle,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    },
  ];

  const handleOpenPayment = (credit) => {
    setPaymentModal(credit);
    setPaymentAmount(credit.totalCredit.toString());
    setPaymentError("");
  };

  const handleProcessPayment = () => {
    setPaymentError("");
    const amount = parseFloat(paymentAmount);

    if (isNaN(amount) || amount <= 0) {
      setPaymentError("Please enter a valid amount greater than 0");
      return;
    }
    if (amount > paymentModal.totalCredit) {
      setPaymentError("Payment cannot exceed total outstanding credit");
      return;
    }

    dispatch(makePayment(paymentModal.id, amount));
    setPaymentModal(null);
    setPaymentAmount("");
  };

  return (
    <div className="flex flex-col gap-6 h-full min-h-0">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Credit Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Track outstanding balances and process payments
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={`border-2 ${stat.border} shadow-sm h-full`}>
              <CardContent className="p-4 flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color} shrink-0`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-black tracking-tight mt-0.5 truncate">
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="flex-1 min-h-0 flex flex-col overflow-hidden border-2 shadow-sm">
        <div className="p-4 border-b bg-muted/20 shrink-0 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by customer or shop name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-background border-muted-foreground/20"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {["all", "pending", "overdue", "paid"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "px-4 h-10 rounded-xl text-xs font-bold capitalize transition-all border",
                  statusFilter === status
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-background text-muted-foreground border-muted hover:bg-muted/50"
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto sidebar-scroll">
          <table className="w-full text-sm text-left">
            <thead className="sticky top-0 bg-muted/40 backdrop-blur-md z-10 border-b">
              <tr>
                <th className="px-4 py-3 font-semibold text-muted-foreground">Customer</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">Outstanding Balance</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground text-center">Invoices Linked</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">Last Payment</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground text-center">Status</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCredits.map((credit) => (
                <tr
                  key={credit.id}
                  className="hover:bg-accent/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs shrink-0">
                        {credit.shopkeeperName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold truncate">{credit.shopkeeperName}</p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                          <Store className="h-3 w-3 shrink-0" /> {credit.shopName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className={cn(
                      "font-black text-lg tracking-tight",
                      credit.totalCredit > 0 ? "text-orange-600 dark:text-orange-500" : "text-emerald-600 dark:text-emerald-500"
                    )}>
                      {formatCurrency(credit.totalCredit)}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center h-6 min-w-6 px-2 rounded-full bg-muted text-xs font-bold">
                      {credit.invoices.length}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {credit.lastPaymentDate ? (
                      <div>
                        <p className="font-bold text-emerald-600">{formatCurrency(credit.lastPayment)}</p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <History className="h-3 w-3" /> {formatDate(credit.lastPaymentDate)}
                        </p>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">No payments yet</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "font-bold uppercase tracking-wider text-[9px]",
                        credit.status === "paid" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200" :
                        credit.status === "pending" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200" :
                        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200"
                      )}
                    >
                      {credit.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary hover:bg-primary/10"
                        onClick={() => router.push(`/credit/${credit.id}`)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        disabled={credit.totalCredit <= 0}
                        onClick={() => handleOpenPayment(credit)}
                        className="h-8 rounded-lg text-xs font-bold gap-1.5"
                      >
                        <Banknote className="h-3.5 w-3.5" />
                        Receive
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCredits.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No credit records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <AnimatePresence>
        {paymentModal && (
          <Dialog open={!!paymentModal} onOpenChange={() => setPaymentModal(null)}>
            <DialogContent className="sm:max-w-[420px] rounded-2xl p-0 overflow-hidden">
              <div className="gradient-primary p-6 text-white text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 mx-auto mb-3 backdrop-blur-sm">
                  <Banknote className="h-6 w-6 text-white" />
                </div>
                <DialogTitle className="text-lg font-bold text-white mb-1">
                  Receive Payment
                </DialogTitle>
                <DialogDescription className="text-white/80 text-xs font-medium">
                  {paymentModal.shopkeeperName}
                </DialogDescription>
              </div>

              <div className="p-6 bg-background space-y-5">
                <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/50">
                  <span className="text-xs font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wider">
                    Total Outstanding
                  </span>
                  <span className="text-xl font-black text-orange-600 dark:text-orange-500">
                    {formatCurrency(paymentModal.totalCredit)}
                  </span>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Payment Amount Received
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                      Rs.
                    </span>
                    <Input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="pl-10 h-12 text-lg font-bold rounded-xl bg-muted/30 focus-visible:ring-primary/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      min="1"
                      max={paymentModal.totalCredit}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      onClick={() => setPaymentAmount(paymentModal.totalCredit.toString())}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                    >
                      Clear Full Amount
                    </button>
                  </div>
                </div>

                {paymentError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20"
                  >
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>{paymentError}</span>
                  </motion.div>
                )}

                <DialogFooter className="flex flex-row gap-2 sm:justify-center pt-2 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setPaymentModal(null)}
                    className="flex-1 h-11 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleProcessPayment}
                    className="flex-1 h-11 text-xs font-bold rounded-xl shadow-lg shadow-primary/20 gap-2"
                  >
                    <ArrowRightLeft className="h-4 w-4" /> Process Payment
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