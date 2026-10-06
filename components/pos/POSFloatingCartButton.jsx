"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function POSFloatingCartButton({ itemCount, total, cartOpen, onClick }) {
  return (
    <AnimatePresence>
      {itemCount > 0 && !cartOpen && (
        <motion.button
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0, y: 20 }}
          onClick={onClick}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 h-14 pl-5 pr-6 rounded-full gradient-primary text-white shadow-2xl shadow-primary/40 hover:scale-105 transition-transform"
        >
          <div className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold ring-2 ring-white">
              {itemCount}
            </span>
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="text-[10px] font-medium text-white/80">View Cart</span>
            <span className="text-sm font-bold">{formatCurrency(total)}</span>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}