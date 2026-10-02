"use client";

import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  removeFromCart,
  updateCartQty,
  clearCart,
  setCartShopkeeper,
  addSale,
} from "@/store/slices/salesSlice";
import { addInvoice } from "@/store/slices/invoiceSlice";
import { formatCurrency, generateId, cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  X,
  Grid3X3,
  List,
  AlertTriangle,
  ShoppingCart,
  CheckCircle2,
  Printer,
  RotateCcw,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import POSProductGrid from "@/components/pos/POSProductGrid";
import POSCartDrawer from "@/components/pos/POSCartDrawer";
import POSReceipt from "@/components/pos/POSReceipt";
import POSCategoryFilter from "@/components/pos/POSCategoryFilter";

export default function POSPage() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const { shopkeepers } = useSelector((state) => state.shopkeepers);
  const { cart, cartShopkeeper } = useSelector((state) => state.sales);
  const { storeInfo } = useSelector((state) => state.settings);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [cartOpen, setCartOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [lastInvoice, setLastInvoice] = useState(null);
  const [discount, setDiscount] = useState(0);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        setSearchTerm("");
        if (cartOpen) setCartOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cartOpen]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode?.includes(searchTerm);
    const matchesCategory =
      selectedCategory === "all" || product.categoryId === selectedCategory;
    return matchesSearch && matchesCategory && product.stock > 0;
  });

  const cartSubtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = (cartSubtotal * discount) / 100;
  const cartTotal = cartSubtotal - discountAmount;
  const cartItemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleAddToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing && existing.qty >= product.stock) return;
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        costPrice: product.costPrice,
        stock: product.stock,
        category: product.category,
        barcode: product.barcode,
      })
    );
    setCartOpen(true);
  };

  const handleUpdateQty = (id, qty) => {
    const product = products.find((p) => p.id === id);
    if (qty <= 0) {
      dispatch(removeFromCart(id));
      return;
    }
    if (product && qty > product.stock) return;
    dispatch(updateCartQty({ id, qty }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    setDiscount(0);
    setClearConfirmOpen(false);
    setCartOpen(false);
  };

  const handleCheckout = (paymentData) => {
    const invoiceNo = Math.floor(1000 + Math.random() * 9000).toString();
    const now = new Date();

    const sale = {
      id: generateId(),
      invoiceNo,
      shopkeeperId: cartShopkeeper?.id || null,
      shopkeeperName: cartShopkeeper?.name || "Walk-in Customer",
      items: cart.length,
      totalAmount: cartTotal,
      paidAmount: paymentData.paidAmount,
      creditAmount: paymentData.creditAmount,
      paymentMethod: paymentData.paymentMethod,
      status: paymentData.creditAmount > 0 ? "pending" : "completed",
      date: now.toISOString().split("T")[0],
    };

    const invoice = {
      id: generateId(),
      invoiceNo,
      partyCode: cartShopkeeper ? cartShopkeeper.id.slice(-4) : "CASH",
      shopkeeperId: cartShopkeeper?.id || null,
      shopkeeperName: cartShopkeeper?.name || "Walk-in Customer",
      shopName: cartShopkeeper?.shopName || "Walk-in",
      phone: cartShopkeeper?.phone || "",
      address: cartShopkeeper?.address || "",
      items: cart.map((item, idx) => ({
        productId: item.id,
        name: item.name,
        qty: item.qty,
        price: item.price,
        total: item.total,
        code: item.barcode?.slice(-3) || `3${idx}${idx}`,
      })),
      subtotal: cartSubtotal,
      discount: discountAmount,
      discountPercent: discount,
      totalAmount: cartTotal,
      paidAmount: paymentData.paidAmount,
      creditAmount: paymentData.creditAmount,
      paymentMethod: paymentData.paymentMethod,
      status:
        paymentData.creditAmount > 0
          ? paymentData.paidAmount > 0
            ? "partial"
            : "unpaid"
          : "paid",
      date: now.toISOString(),
      storeName: storeInfo.name,
      storeAddress: storeInfo.address,
      storePhone: storeInfo.phone,
    };

    dispatch(addSale(sale));
    dispatch(addInvoice(invoice));
    setLastInvoice(invoice);

    setCartOpen(false);
    dispatch(clearCart());
    setDiscount(0);
    setTimeout(() => setSuccessModalOpen(true), 300);
  };

  const handlePrintDirect = () => {
    setSuccessModalOpen(false);
    setTimeout(() => {
      setReceiptOpen(true);
      setTimeout(() => window.print(), 400);
    }, 150);
  };

  const handleViewReceipt = () => {
    setSuccessModalOpen(false);
    setTimeout(() => setReceiptOpen(true), 300);
  };

  const handleNewTransaction = () => {
    setSuccessModalOpen(false);
    setReceiptOpen(false);
    setLastInvoice(null);
  };

  return (
    <div className="flex flex-col gap-4 h-full min-h-0">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            POS Terminal
            <span className="flex h-5 items-center rounded-full bg-emerald-500/10 px-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              ACTIVE
            </span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Click products to add them to cart
          </p>
        </div>
      </motion.div>

      <Card className="shrink-0">
        <CardContent className="p-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchRef}
                type="text"
                placeholder="Search products or scan barcode... (Press /)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-9 h-11 text-sm rounded-xl bg-muted/30 focus-visible:bg-background border-transparent focus-visible:border-primary/40"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <POSCategoryFilter
                categories={categories}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
              />
              <div className="flex items-center border rounded-lg overflow-hidden h-10">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "h-full w-10 flex items-center justify-center transition-colors",
                    viewMode === "grid"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-accent text-muted-foreground"
                  )}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "h-full w-10 flex items-center justify-center transition-colors",
                    viewMode === "list"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-accent text-muted-foreground"
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden rounded-xl pb-24 pr-1">
        <POSProductGrid
          products={filteredProducts}
          viewMode={viewMode}
          cart={cart}
          onAddToCart={handleAddToCart}
        />
      </div>

      <AnimatePresence>
        {cartItemCount > 0 && !cartOpen && (
          <motion.button
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 20 }}
            onClick={() => setCartOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 h-14 pl-5 pr-6 rounded-full gradient-primary text-white shadow-2xl shadow-primary/40 hover:scale-105 transition-transform"
          >
            <div className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold ring-2 ring-white">
                {cartItemCount}
              </span>
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-[10px] font-medium text-white/80">View Cart</span>
              <span className="text-sm font-bold">{formatCurrency(cartTotal)}</span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <POSCartDrawer
        open={cartOpen}
        onOpenChange={setCartOpen}
        cart={cart}
        discount={discount}
        subtotal={cartSubtotal}
        discountAmount={discountAmount}
        total={cartTotal}
        itemCount={cartItemCount}
        shopkeepers={shopkeepers}
        selectedShopkeeper={cartShopkeeper}
        onSelectShopkeeper={(sk) => dispatch(setCartShopkeeper(sk))}
        onUpdateQty={handleUpdateQty}
        onRemove={(id) => dispatch(removeFromCart(id))}
        onDiscountChange={setDiscount}
        onClear={() => setClearConfirmOpen(true)}
        onCheckout={handleCheckout}
      />

      <Dialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-2xl p-0 overflow-hidden text-center">
          <div className="gradient-primary pt-8 pb-6 px-6 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm shadow-inner"
            >
              <CheckCircle2 className="h-8 w-8 text-white" />
            </motion.div>
            <DialogTitle className="text-xl font-bold text-white mb-1">
              Payment Successful!
            </DialogTitle>
            <DialogDescription className="text-white/80 text-sm font-medium">
              Transaction #{lastInvoice?.invoiceNo} recorded securely.
            </DialogDescription>
          </div>
          <div className="p-6 bg-background space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 flex flex-col gap-1">
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">
                Total Received
              </span>
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-500">
                {formatCurrency(lastInvoice?.totalAmount || 0)}
              </span>
            </div>

            <div className="space-y-2 w-full pt-2">
              <Button
                onClick={handlePrintDirect}
                className="w-full h-12 rounded-xl font-bold gap-2 text-sm shadow-lg shadow-primary/20"
              >
                <Printer className="h-4 w-4" /> Print Receipt
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleViewReceipt}
                  className="flex-1 h-11 rounded-xl font-semibold gap-2"
                >
                  <Eye className="h-4 w-4" /> View
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleNewTransaction}
                  className="flex-1 h-11 rounded-xl font-semibold gap-2"
                >
                  <RotateCcw className="h-4 w-4" /> New Sale
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <POSReceipt
        open={receiptOpen}
        onOpenChange={setReceiptOpen}
        invoice={lastInvoice}
        storeInfo={storeInfo}
        onPrint={() => window.print()}
        onNewSale={handleNewTransaction}
      />

      <Dialog open={clearConfirmOpen} onOpenChange={setClearConfirmOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-2xl">
          <DialogHeader className="flex flex-col items-center text-center pt-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-3">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-base font-bold">Clear Cart</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Remove all items from the cart?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-2 mt-4 sm:justify-center">
            <Button
              variant="outline"
              onClick={() => setClearConfirmOpen(false)}
              className="flex-1 h-10 text-xs font-semibold rounded-xl"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleClearCart}
              className="flex-1 h-10 text-xs font-semibold rounded-xl"
            >
              Clear Cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}