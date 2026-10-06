"use client";

import { motion } from "framer-motion";

export default function POSHeader() {
  return (
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
  );
}