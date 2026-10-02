"use client";

import { useState, useEffect } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Percent,
  RotateCcw,
  ArrowRight,
  Package,
  User,
  CheckCircle2,
  Search,
  X,
  Store,
  ChevronLeft,
  Banknote,
  CreditCard,
  ArrowLeftRight,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const paymentMethods = [
  {
    id: "cash",
    label: "Cash",
    icon: Banknote,
    color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    id: "credit",
    label: "Credit",
    icon: CreditCard,
    color: "text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-500/20",
  },
  {
    id: "partial",
    label: "Partial",
    icon: ArrowLeftRight,
    color: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
];

export default function POSCartDrawer({
  open,
  onOpenChange,
  cart,
  discount,
  subtotal,
  discountAmount,
  total,
  itemCount,
  shopkeepers,
  selectedShopkeeper,
  onSelectShopkeeper,
  onUpdateQty,
  onRemove,
  onDiscountChange,
  onClear,
  onCheckout,
}) {
  // Views: "cart" | "customer" | "checkout"
  const [view, setView] = useState("cart");
  const [searchCustomer, setSearchCustomer] = useState("");
  
  // Checkout State
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paidAmount, setPaidAmount] = useState("");
  const [checkoutError, setCheckoutError] = useState("");

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      if (view === "checkout") {
        setPaymentMethod("cash");
        setPaidAmount(total.toString());
      }
    } else {
      document.body.style.overflow = "";
      setTimeout(() => setView("cart"), 300); // Reset view after close animation
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, total, view]);

  useEffect(() => {
    if (paymentMethod === "cash") {
      setPaidAmount(total.toString());
    } else if (paymentMethod === "credit") {
      setPaidAmount("0");
    } else {
      setPaidAmount("");
    }
    setCheckoutError("");
  }, [paymentMethod, total]);

  const filteredShopkeepers = shopkeepers.filter(
    (s) =>
      s.status === "active" &&
      (s.name.toLowerCase().includes(searchCustomer.toLowerCase()) ||
        s.shopName.toLowerCase().includes(searchCustomer.toLowerCase()))
  );

  const handleCheckoutSubmit = () => {
    setCheckoutError("");
    const paid = parseFloat(paidAmount) || 0;
    const creditAmount = Math.max(0, total - paid);

    if (paymentMethod === "credit" && !selectedShopkeeper) {
      setCheckoutError("Please select a customer for credit sales");
      return;
    }

    if (paymentMethod === "partial") {
      if (!selectedShopkeeper) {
        setCheckoutError("Please select a customer for partial payment");
        return;
      }
      if (paid <= 0) {
        setCheckoutError("Paid amount must be greater than zero");
        return;
      }
      if (paid >= total) {
        setCheckoutError("For partial payment, paid amount must be less than total");
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
  const paid = parseFloat(paidAmount) || 0;
  const changeAmount = Math.max(0, paid - total);
  const creditAmount = Math.max(0, total - paid);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-[2px]"
            onClick={() => onOpenChange(false)}
          />

          <motion.aside
            key="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 z-[70] h-full w-full sm:w-[420px] bg-background border-l shadow-2xl flex flex-col overflow-hidden"
          >
            {/* VIEW 1: CART */}
            <AnimatePresence mode="wait">
              {view === "cart" && (
                <motion.div
                  key="view-cart"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col h-full absolute inset-0 bg-background"
                >
                  <div className="flex h-16 items-center justify-between px-4 border-b shrink-0 bg-card">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <ShoppingCart className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold leading-none">Current Order</p>
                        <p className="text-[10px] text-muted-foreground font-medium mt-1 uppercase tracking-wider">
                          {itemCount} {itemCount === 1 ? "Item" : "Items"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {cart.length > 0 && (
                        <button
                          onClick={onClear}
                          className="flex items-center gap-1 text-[11px] font-bold text-destructive hover:bg-destructive/10 px-2 py-1.5 rounded-lg transition-colors"
                        >
                          <RotateCcw className="h-3 w-3" />
                          Clear
                        </button>
                      )}
                      <button
                        onClick={() => onOpenChange(false)}
                        className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-accent transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 border-b bg-muted/20 shrink-0">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                      Customer Details
                    </p>
                    <button
                      onClick={() => setView("customer")}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-card border shadow-sm hover:border-primary/40 transition-all text-left"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-lg shrink-0",
                            selectedShopkeeper
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          <User className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col items-start min-w-0">
                          <span className="text-sm font-bold truncate w-full">
                            {selectedShopkeeper ? selectedShopkeeper.name : "Walk-in Customer"}
                          </span>
                          <span className="text-[10px] text-muted-foreground truncate w-full">
                            {selectedShopkeeper ? selectedShopkeeper.shopName : "Cash sale only"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
                        Change
                      </div>
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto sidebar-scroll bg-muted/5">
                    {cart.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full opacity-50 px-6 text-center">
                        <Package className="h-12 w-12 text-muted-foreground mb-3" />
                        <p className="text-sm font-bold">Your cart is empty</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Add products to start a sale
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 space-y-2">
                        {cart.map((item) => (
                          <div
                            key={item.id}
                            className="p-3 rounded-xl border bg-card shadow-sm"
                          >
                            <div className="flex items-start justify-between gap-2 mb-3">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate">{item.name}</p>
                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                  {formatCurrency(item.price)} each • Stock: {item.stock}
                                </p>
                              </div>
                              <button
                                onClick={() => onRemove(item.id)}
                                className="h-7 w-7 flex items-center justify-center rounded-lg text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center bg-muted/50 rounded-lg p-0.5 border">
                                <button
                                  onClick={() => onUpdateQty(item.id, item.qty - 1)}
                                  className="h-7 w-7 flex items-center justify-center rounded-md bg-background shadow-sm"
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="h-7 w-10 flex items-center justify-center text-xs font-bold">
                                  {item.qty}
                                </span>
                                <button
                                  onClick={() => onUpdateQty(item.id, item.qty + 1)}
                                  disabled={item.qty >= item.stock}
                                  className={cn(
                                    "h-7 w-7 flex items-center justify-center rounded-md bg-background shadow-sm",
                                    item.qty >= item.stock && "opacity-40 cursor-not-allowed"
                                  )}
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <p className="text-sm font-bold text-primary">
                                {formatCurrency(item.total)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border-t bg-card shrink-0 p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted shrink-0">
                        <Percent className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="relative flex-1">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="Discount %"
                          value={discount || ""}
                          onChange={(e) =>
                            onDiscountChange(
                              Math.min(100, Math.max(0, parseFloat(e.target.value) || 0))
                            )
                          }
                          className="h-10 text-sm font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                          %
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 p-3 rounded-xl bg-muted/30">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-bold">{formatCurrency(subtotal)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-xs text-destructive">
                          <span>Discount ({discount}%)</span>
                          <span className="font-bold">-{formatCurrency(discountAmount)}</span>
                        </div>
                      )}
                      <div className="pt-2 border-t flex justify-between items-center">
                        <span className="text-sm font-bold">Grand Total</span>
                        <span className="text-xl font-black text-primary">
                          {formatCurrency(total)}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={() => setView("checkout")}
                      disabled={cart.length === 0}
                      className="w-full h-12 text-sm font-bold rounded-xl gap-2 shadow-lg shadow-primary/20"
                    >
                      Checkout Now
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* VIEW 2: CUSTOMER SELECTION */}
              {view === "customer" && (
                <motion.div
                  key="view-customer"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col h-full absolute inset-0 bg-background"
                >
                  <div className="flex h-16 items-center gap-3 px-2 border-b shrink-0 bg-card">
                    <button
                      onClick={() => setView("cart")}
                      className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-accent transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div>
                      <p className="text-sm font-bold leading-none">Select Customer</p>
                      <p className="text-[10px] text-muted-foreground font-medium mt-1 uppercase tracking-wider">
                        Search or select
                      </p>
                    </div>
                  </div>

                  <div className="p-4 border-b bg-card shrink-0">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search by name or shop..."
                        value={searchCustomer}
                        onChange={(e) => setSearchCustomer(e.target.value)}
                        className="w-full h-11 pl-10 pr-3 text-sm rounded-xl bg-muted/50 border-0 outline-none focus:ring-2 focus:ring-primary/40"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto sidebar-scroll p-3 space-y-2 bg-muted/5">
                    <button
                      onClick={() => {
                        onSelectShopkeeper(null);
                        setView("cart");
                      }}
                      className={cn(
                        "flex items-center gap-3 w-full p-3 rounded-xl border text-left transition-all",
                        !selectedShopkeeper
                          ? "bg-primary/5 border-primary shadow-sm"
                          : "bg-card hover:border-primary/40"
                      )}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground shrink-0">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold">Walk-in Customer</p>
                        <p className="text-[11px] text-muted-foreground">Cash sale only</p>
                      </div>
                      {!selectedShopkeeper && (
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                      )}
                    </button>

                    {filteredShopkeepers.map((sk) => (
                      <button
                        key={sk.id}
                        onClick={() => {
                          onSelectShopkeeper(sk);
                          setView("cart");
                        }}
                        className={cn(
                          "flex items-center gap-3 w-full p-3 rounded-xl border text-left transition-all",
                          selectedShopkeeper?.id === sk.id
                            ? "bg-primary/5 border-primary shadow-sm"
                            : "bg-card hover:border-primary/40"
                        )}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary text-[12px] font-bold shrink-0">
                          {sk.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate">{sk.name}</p>
                          <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                            <Store className="h-3 w-3" />
                            {sk.shopName}
                          </p>
                        </div>
                        {selectedShopkeeper?.id === sk.id && (
                          <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* VIEW 3: CHECKOUT */}
              {view === "checkout" && (
                <motion.div
                  key="view-checkout"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col h-full absolute inset-0 bg-background"
                >
                  <div className="flex h-16 items-center gap-3 px-2 border-b shrink-0 bg-card">
                    <button
                      onClick={() => setView("cart")}
                      className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-accent transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div>
                      <p className="text-sm font-bold leading-none">Checkout</p>
                      <p className="text-[10px] text-muted-foreground font-medium mt-1 uppercase tracking-wider">
                        Payment & Completion
                      </p>
                    </div>
                  </div>

                  <div className="gradient-primary p-5 text-white shrink-0 shadow-inner">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-white/70 uppercase tracking-wider font-semibold mb-1">To Pay</p>
                        <p className="text-3xl font-black">{formatCurrency(total)}</p>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <p className="text-[10px] text-white/70 uppercase tracking-wider font-semibold mb-1">Customer</p>
                        <div className="flex items-center gap-1.5 bg-white/20 px-2 py-1 rounded-md backdrop-blur-sm">
                          <User className="h-3 w-3" />
                          <span className="text-xs font-bold max-w-[100px] truncate">
                            {selectedShopkeeper ? selectedShopkeeper.name : "Walk-in"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto sidebar-scroll p-4 space-y-5 bg-card">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Select Payment Method
                      </Label>
                      <div className="grid grid-cols-3 gap-2">
                        {paymentMethods.map((method) => {
                          const Icon = method.icon;
                          const isActive = paymentMethod === method.id;
                          const isDisabled = (method.id === "credit" || method.id === "partial") && !selectedShopkeeper;

                          return (
                            <button
                              key={method.id}
                              onClick={() => !isDisabled && setPaymentMethod(method.id)}
                              disabled={isDisabled}
                              className={cn(
                                "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all",
                                isActive ? method.color : "border-transparent bg-muted/50 hover:bg-accent",
                                isDisabled && "opacity-40 cursor-not-allowed"
                              )}
                            >
                              <Icon className="h-5 w-5" />
                              <span className="text-[11px] font-bold">{method.label}</span>
                            </button>
                          );
                        })}
                      </div>
                      {!selectedShopkeeper && (
                        <p className="text-[10px] font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1 pt-1">
                          <AlertCircle className="h-3 w-3" />
                          Select a customer first to use Credit/Partial
                        </p>
                      )}
                    </div>

                    {paymentMethod !== "credit" && (
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {paymentMethod === "partial" ? "Paying Amount Now" : "Cash Received"}
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                            Rs.
                          </span>
                          <Input
                            type="number"
                            value={paidAmount}
                            onChange={(e) => setPaidAmount(e.target.value)}
                            className="pl-10 h-12 text-lg font-bold rounded-xl bg-muted/30 focus-visible:ring-primary/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            min="0"
                          />
                        </div>
                        {paymentMethod === "cash" && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {quickAmounts.map((amount) => (
                              <button
                                key={amount}
                                onClick={() => setPaidAmount(amount.toString())}
                                className={cn(
                                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                                  parseFloat(paidAmount) === amount
                                    ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                                    : "hover:bg-accent border-transparent bg-muted/50"
                                )}
                              >
                                {formatCurrency(amount)}
                              </button>
                            ))}
                            <button
                              onClick={() => setPaidAmount(total.toString())}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 transition-all border border-transparent"
                            >
                              Exact
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="space-y-2 p-3 rounded-xl bg-muted/30 border border-dashed border-muted-foreground/30">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground font-medium">Total Bill</span>
                        <span className="font-bold">{formatCurrency(total)}</span>
                      </div>
                      {paymentMethod !== "credit" && (
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground font-medium">Paid</span>
                          <span className="font-bold text-emerald-600">{formatCurrency(paid)}</span>
                        </div>
                      )}
                      {paymentMethod === "cash" && paid > total && (
                        <div className="flex justify-between text-xs pt-1 mt-1 border-t border-dashed">
                          <span className="font-bold text-foreground">Change to Return</span>
                          <span className="font-black text-blue-600 text-sm">
                            {formatCurrency(changeAmount)}
                          </span>
                        </div>
                      )}
                      {(paymentMethod === "credit" || paymentMethod === "partial") && (
                        <div className="flex justify-between text-xs pt-1 mt-1 border-t border-dashed">
                          <span className="font-bold text-foreground">Adding to Credit</span>
                          <span className="font-black text-orange-600 text-sm">
                            {formatCurrency(paymentMethod === "credit" ? total : creditAmount)}
                          </span>
                        </div>
                      )}
                    </div>

                    {checkoutError && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20"
                      >
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{checkoutError}</span>
                      </motion.div>
                    )}
                  </div>

                  <div className="p-4 border-t bg-card shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] z-10 relative">
                    <Button
                      onClick={handleCheckoutSubmit}
                      className="w-full h-12 text-sm font-bold rounded-xl gap-2 shadow-lg shadow-primary/20"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Complete Transaction
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}