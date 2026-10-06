"use client";

import { cn, formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Plus, ShoppingCart, AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function POSProductGrid({ products, viewMode, cart, onAddToCart }) {
  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-3">
            <Package className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="text-sm font-semibold mb-1">No products found</p>
          <p className="text-xs text-muted-foreground">Try adjusting your search or category filter</p>
        </CardContent>
      </Card>
    );
  }

  const formatUnit = (p) => {
    if (!p.unit || p.unit === "pcs") return "pc";
    return `${p.unitValue}${p.unit}`;
  };

  if (viewMode === "list") {
    return (
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {products.map((product, index) => {
              const cartItem = cart.find((c) => c._id === product._id);
              const isInCart = !!cartItem;
              const isMaxed = cartItem && cartItem.qty >= product.stock;

              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className={cn(
                    "flex items-center gap-3 p-3 hover:bg-accent/30 transition-colors cursor-pointer group",
                    isMaxed && "opacity-60"
                  )}
                  onClick={() => !isMaxed && onAddToCart(product)}
                >
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl shrink-0",
                    isInCart ? "bg-primary/10 text-primary" : "bg-muted"
                  )}>
                    <Package className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold truncate">
                        {product.name} <span className="text-muted-foreground font-normal">{formatUnit(product)}</span>
                      </p>
                      {isInCart && (
                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full shrink-0">
                          <ShoppingCart className="h-2.5 w-2.5" />
                          {cartItem.qty}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {product.brand && <span className="text-[10px] text-muted-foreground">{product.brand}</span>}
                      <span className="text-[10px] text-muted-foreground">• Stock: {product.stock}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold">{formatCurrency(product.price)}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); if (!isMaxed) onAddToCart(product); }}
                    disabled={isMaxed}
                    className={cn(
                      "h-8 w-8 flex items-center justify-center rounded-lg transition-all shrink-0",
                      isMaxed ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 pb-4">
      {products.map((product, index) => {
        const cartItem = cart.find((c) => c._id === product._id);
        const isInCart = !!cartItem;
        const isMaxed = cartItem && cartItem.qty >= product.stock;

        return (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.02 }}
          >
            <Card
              className={cn(
                "cursor-pointer transition-all hover:shadow-md hover:border-primary/40 group relative overflow-hidden h-full",
                isInCart && "ring-2 ring-primary/40",
                isMaxed && "opacity-60 cursor-not-allowed"
              )}
              onClick={() => !isMaxed && onAddToCart(product)}
            >
              <CardContent className="p-3 flex flex-col h-full">
                <div className="flex items-start justify-between mb-2">
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl",
                    isInCart ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}>
                    <Package className="h-5 w-5" />
                  </div>
                  {isInCart && (
                    <span className="flex items-center gap-0.5 text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                      <ShoppingCart className="h-2.5 w-2.5" />
                      {cartItem.qty}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">{product.name}</p>
                  {product.brand && <p className="text-[10px] text-muted-foreground truncate">{product.brand}</p>}
                  <p className="text-[9px] text-primary font-semibold mt-0.5">{formatUnit(product)}</p>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t">
                  <p className="text-sm font-bold">{formatCurrency(product.price)}</p>
                  <div className="flex items-center gap-1">
                    {product.stock <= 5 ? (
                      <AlertTriangle className="h-3 w-3 text-amber-500" />
                    ) : (
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    )}
                    <span className="text-[10px] text-muted-foreground font-medium">{product.stock}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}