"use client";

import { useState, useEffect } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Banknote,
  CreditCard,
  ArrowLeftRight,
  CheckCircle2,
  Calculator,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const paymentMethods = [
  {
    id: "cash",
    label: "Cash",
    icon: Banknote,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  },
  {
    id: "credit",
    label: "Credit",
    icon: CreditCard,
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  },
  {
    id: "partial",
    label: "Partial",
    icon: ArrowLeftRight,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  },
];

export default function POSCheckout({
  open,
  onOpenChange,
  total,
  shopkeeper,
  onCheckout,
}) {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paidAmount, setPaidAmount] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setPaymentMethod("cash");
      setPaidAmount(total.toString());
      setError("");
    }
  }, [open, total]);

  useEffect(() => {
    if (paymentMethod === "cash") {
      setPaidAmount(total.toString());
    } else if (paymentMethod === "credit") {
      setPaidAmount("0");
    } else {
      setPaidAmount("");
    }
    setError("");
  }, [paymentMethod, total]);

  const paid = parseFloat(paidAmount) || 0;
  const creditAmount = Math.max(0, total - paid);
  const changeAmount = Math.max(0, paid - total);

  const handleSubmit = () => {
    setError("");

    if (paymentMethod === "credit" && !shopkeeper) {
      setError("Please select a shopkeeper for credit sales");
      return;
    }

    if (paymentMethod === "partial") {
      if (!shopkeeper) {
        setError("Please select a shopkeeper for partial payment");
        return;
      }
      if (paid <= 0) {
        setError("Paid amount must be greater than zero");
        return;
      }
      if (paid >= total) {
        setError("For partial payment, paid amount must be less than total");
        return;
      }
    }

    onCheckout({
      paymentMethod,
      paidAmount: paymentMethod === "credit" ? 0 : Math.min(paid, total),
      creditAmount:
        paymentMethod === "cash"
          ? 0
          : paymentMethod === "credit"
          ? total
          : creditAmount,
    });
  };

  const quickAmounts = [100, 500, 1000, 2000, 5000];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 rounded-2xl overflow-hidden">
        <div className="gradient-primary p-5 text-white">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-white">
              Checkout
            </DialogTitle>
            <p className="text-xs text-white/80 mt-0.5">
              Complete the transaction
            </p>
          </DialogHeader>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-white/70">Total Amount</p>
              <p className="text-3xl font-bold">{formatCurrency(total)}</p>
            </div>
            {shopkeeper && (
              <div className="text-right">
                <p className="text-xs text-white/70">Customer</p>
                <p className="text-sm font-semibold">{shopkeeper.name}</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-5 space-y-5">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Payment Method
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const isActive = paymentMethod === method.id;
                const isDisabled =
                  (method.id === "credit" || method.id === "partial") &&
                  !shopkeeper;

                return (
                  <button
                    key={method.id}
                    onClick={() => !isDisabled && setPaymentMethod(method.id)}
                    disabled={isDisabled}
                    className={cn(
                      "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all",
                      isActive
                        ? `${method.color} border-current`
                        : "border-transparent bg-muted/50 hover:bg-accent",
                      isDisabled && "opacity-40 cursor-not-allowed"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-[11px] font-semibold">
                      {method.label}
                    </span>
                  </button>
                );
              })}
            </div>
            {!shopkeeper && (
              <p className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Select a shopkeeper for credit or partial payment
              </p>
            )}
          </div>

          {paymentMethod !== "credit" && (
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {paymentMethod === "partial" ? "Paying Now" : "Amount Received"}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                  Rs.
                </span>
                <Input
                  type="number"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  className="pl-10 h-12 text-lg font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="0"
                />
              </div>
              {paymentMethod === "cash" && (
                <div className="flex flex-wrap gap-1.5">
                  {quickAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setPaidAmount(amount.toString())}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors border",
                        parseFloat(paidAmount) === amount
                          ? "bg-primary text-primary-foreground border-primary"
                          : "hover:bg-accent border-transparent bg-muted/50"
                      )}
                    >
                      {formatCurrency(amount)}
                    </button>
                  ))}
                  <button
                    onClick={() => setPaidAmount(total.toString())}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    Exact
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2 p-3 rounded-xl bg-muted/30 border">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Total</span>
              <span className="font-semibold">{formatCurrency(total)}</span>
            </div>
            {paymentMethod !== "credit" && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Paid</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(paid)}
                </span>
              </div>
            )}
            {paymentMethod === "cash" && paid > total && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Change</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(changeAmount)}
                </span>
              </div>
            )}
            {(paymentMethod === "credit" || paymentMethod === "partial") && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Credit</span>
                <span className="font-bold text-orange-600 dark:text-orange-400">
                  {formatCurrency(
                    paymentMethod === "credit" ? total : creditAmount
                  )}
                </span>
              </div>
            )}
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-xs border border-destructive/20"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-11 text-xs font-semibold rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 h-11 text-xs font-semibold rounded-xl gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Complete Sale
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}