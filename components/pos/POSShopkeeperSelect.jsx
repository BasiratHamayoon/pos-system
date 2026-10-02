"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Search,
  X,
  ChevronDown,
  Store,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function POSShopkeeperSelect({
  shopkeepers,
  selected,
  onSelect,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = shopkeepers.filter(
    (s) =>
      s.status === "active" &&
      (s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.shopName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="relative" ref={ref}>
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Customer
            </p>
            {selected && (
              <button
                onClick={() => onSelect(null)}
                className="text-[10px] font-semibold text-destructive hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          <button
            onClick={() => setOpen(!open)}
            className={cn(
              "w-full flex items-center gap-2.5 p-2.5 rounded-xl border transition-all text-left",
              open ? "border-primary bg-primary/5" : "hover:bg-accent/50"
            )}
          >
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg shrink-0",
                selected
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <User className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">
                {selected ? selected.name : "Walk-in Customer"}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {selected
                  ? selected.shopName
                  : "Select a shopkeeper or continue as walk-in"}
              </p>
            </div>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform",
                open && "rotate-180"
              )}
            />
          </button>
        </CardContent>
      </Card>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-1 left-0 right-0 z-50 bg-popover border rounded-xl shadow-xl p-2 max-h-[320px] overflow-hidden flex flex-col"
          >
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search shopkeepers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-xs rounded-lg bg-muted/50 border-0 outline-none focus:ring-1 focus:ring-primary/40"
                autoFocus
              />
            </div>

            <div className="overflow-y-auto space-y-0.5 flex-1">
              <button
                onClick={() => {
                  onSelect(null);
                  setOpen(false);
                  setSearch("");
                }}
                className={cn(
                  "flex items-center gap-2 w-full p-2 rounded-lg text-left transition-colors",
                  !selected ? "bg-primary/10 text-primary" : "hover:bg-accent"
                )}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted shrink-0">
                  <User className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold">Walk-in Customer</p>
                  <p className="text-[10px] text-muted-foreground">
                    Cash sale only
                  </p>
                </div>
                {!selected && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                )}
              </button>

              {filtered.map((shopkeeper) => (
                <button
                  key={shopkeeper.id}
                  onClick={() => {
                    onSelect(shopkeeper);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={cn(
                    "flex items-center gap-2 w-full p-2 rounded-lg text-left transition-colors",
                    selected?.id === shopkeeper.id
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-accent"
                  )}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary text-[10px] font-bold shrink-0">
                    {shopkeeper.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">
                      {shopkeeper.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground truncate flex items-center gap-0.5">
                        <Store className="h-2.5 w-2.5" />
                        {shopkeeper.shopName}
                      </span>
                    </div>
                  </div>
                  {selected?.id === shopkeeper.id && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                  )}
                </button>
              ))}

              {filtered.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-xs text-muted-foreground">
                    No shopkeepers found
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}