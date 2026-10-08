"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  removeFromCart,
  updateCartQty,
  clearCart,
  setCartShopkeeper,
} from "@/store/slices/salesSlice";
import { createSale } from "@/store/actions/salesActions";
import { fetchProducts } from "@/store/actions/productActions";
import { fetchCategories } from "@/store/actions/categoryActions";
import { fetchShopkeepers } from "@/store/actions/shopkeeperActions";
import { fetchCredits } from "@/store/actions/creditActions";

import POSHeader from "@/components/pos/POSHeader";
import POSSearchBar from "@/components/pos/POSSearchBar";
import POSProductGrid from "@/components/pos/POSProductGrid";
import POSCartDrawer from "@/components/pos/POSCartDrawer";
import POSReceipt from "@/components/pos/POSReceipt";
import POSFloatingCartButton from "@/components/pos/POSFloatingCartButton";
import POSSuccessModal from "@/components/pos/POSSuccessModal";
import POSClearConfirmDialog from "@/components/pos/POSClearConfirmDialog";

export default function POSPage() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const { shopkeepers } = useSelector((state) => state.shopkeepers);
  const { cart, cartShopkeeper } = useSelector((state) => state.sales);
  const { user } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  
  const [cartOpen, setCartOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [lastInvoice, setLastInvoice] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const searchRef = useRef(null);

  // Initialize data and load viewMode from localStorage
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(fetchShopkeepers());

    const savedViewMode = localStorage.getItem("posViewMode");
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }
  }, [dispatch]);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem("posViewMode", mode);
  };

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

  // Flatten Products and Variants for the POS Screen
  const posItems = useMemo(() => {
    const items = [];
    products.forEach((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brandName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        String(product.category) === String(selectedCategory);

      if (matchesSearch && matchesCategory) {
        product.variants?.forEach((variant) => {
          if (variant.stock > 0) {
            items.push({
              _id: `${product._id}_${variant._id}`,
              productId: product._id,
              variantId: variant._id,
              name: product.name,
              variantLabel: variant.label,
              brandName: product.brandName,
              categoryName: product.categoryName,
              price: variant.price,
              costPrice: variant.costPrice,
              stock: variant.stock,
              unitValue: variant.unitValue,
              unit: variant.unit,
              status: variant.status,
            });
          }
        });
      }
    });
    return items;
  }, [products, searchTerm, selectedCategory]);

  const cartSubtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = (cartSubtotal * discount) / 100;
  const cartTotal = cartSubtotal - discountAmount;
  const cartItemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleAddToCart = (item) => {
    const existing = cart.find((c) => c._id === item._id);
    if (existing && existing.qty >= item.stock) return;
    dispatch(addToCart(item));
    setCartOpen(true);
  };

  const handleUpdateQty = (id, qty) => {
    const itemInCart = cart.find((p) => p._id === id);
    if (qty <= 0) {
      dispatch(removeFromCart(id));
      return;
    }
    // We already have the max stock available saved inside the cart item from posItems
    if (itemInCart && qty > itemInCart.stock) return;
    dispatch(updateCartQty({ id, qty }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    setDiscount(0);
    setClearConfirmOpen(false);
    setCartOpen(false);
  };

  const handleCheckout = async (paymentData) => {
    setIsCheckoutLoading(true);
    try {
      const salePayload = {
        shopkeeperId: cartShopkeeper?._id || cartShopkeeper?.id || null,
        items: cart.map((item) => ({
          productId: item.productId, // Send real product ID
          variantLabel: item.variantLabel, // Send variant label
          name: item.name,
          qty: item.qty,
          price: item.price,
        })),
        subtotal: cartSubtotal,
        discount: discountAmount,
        discountPercent: discount,
        totalAmount: cartTotal,
        paidAmount: paymentData.paidAmount,
        creditAmount: paymentData.creditAmount,
        paymentMethod: paymentData.paymentMethod,
      };

      const sale = await dispatch(createSale(salePayload));

      setLastInvoice(sale);
      setCartOpen(false);
      dispatch(clearCart());
      setDiscount(0);

      dispatch(fetchProducts());
      dispatch(fetchShopkeepers());
      dispatch(fetchCredits());

      setTimeout(() => setSuccessModalOpen(true), 300);
    } catch (err) {
      alert(err);
    } finally {
      setIsCheckoutLoading(false);
    }
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
      <POSHeader />

      <POSSearchBar
        ref={searchRef}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        viewMode={viewMode}
        setViewMode={handleViewModeChange}
      />

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden rounded-xl pb-24 pr-1">
        <POSProductGrid
          products={posItems}
          viewMode={viewMode}
          cart={cart}
          onAddToCart={handleAddToCart}
        />
      </div>

      <POSFloatingCartButton
        itemCount={cartItemCount}
        total={cartTotal}
        cartOpen={cartOpen}
        onClick={() => setCartOpen(true)}
      />

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
        isCheckoutLoading={isCheckoutLoading}
      />

      <POSSuccessModal
        open={successModalOpen}
        onOpenChange={setSuccessModalOpen}
        invoice={lastInvoice}
        onPrint={handlePrintDirect}
        onView={handleViewReceipt}
        onNewSale={handleNewTransaction}
      />

      <POSReceipt
        open={receiptOpen}
        onOpenChange={setReceiptOpen}
        invoice={lastInvoice}
        storeInfo={user}
        onPrint={() => window.print()}
        onNewSale={handleNewTransaction}
      />

      <POSClearConfirmDialog
        open={clearConfirmOpen}
        onOpenChange={setClearConfirmOpen}
        onConfirm={handleClearCart}
      />
    </div>
  );
}