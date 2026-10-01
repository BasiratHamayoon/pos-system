"use client";

import { Sun, Moon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/store/slices/themeSlice";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="relative h-9 w-9 flex items-center justify-center rounded-lg hover:bg-accent transition-colors"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          {mode === "light" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4 text-amber-500" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}