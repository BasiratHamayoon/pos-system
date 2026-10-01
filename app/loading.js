"use client";

import { motion } from "framer-motion";
import { Store } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background gap-4">
      <motion.div
        animate={{ scale: [1, 1.08, 1], rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary text-white shadow-lg shadow-primary/30"
      >
        <Store className="h-7 w-7" />
      </motion.div>
      <motion.p
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="text-xs font-semibold tracking-widest uppercase text-muted-foreground"
      >
        Loading...
      </motion.p>
    </div>
  );
}