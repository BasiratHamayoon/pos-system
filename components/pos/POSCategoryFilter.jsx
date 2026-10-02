"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tags, ChevronDown } from "lucide-react";

export default function POSCategoryFilter({ categories, selected, onSelect }) {
  const selectedCategory = categories.find((c) => c.id === selected);
  const label = selected === "all" ? "All Categories" : selectedCategory?.name || "All";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 h-10 px-3 border rounded-lg text-sm font-medium hover:bg-accent transition-colors min-w-[150px] outline-none focus:ring-2 focus:ring-primary/40 data-[state=open]:bg-accent">
        <Tags className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="truncate text-xs flex-1 text-left">{label}</span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px] max-h-[300px] overflow-y-auto">
        <DropdownMenuItem
          onClick={() => onSelect("all")}
          className={cn(
            "text-xs font-medium cursor-pointer py-2",
            selected === "all" && "bg-primary/10 text-primary focus:bg-primary/20 focus:text-primary"
          )}
        >
          <Tags className="h-3.5 w-3.5 mr-2" />
          All Categories
        </DropdownMenuItem>
        {categories.map((cat) => (
          <DropdownMenuItem
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={cn(
              "flex items-center justify-between text-xs font-medium cursor-pointer py-2",
              selected === cat.id && "bg-primary/10 text-primary focus:bg-primary/20 focus:text-primary"
            )}
          >
            <span className="truncate">{cat.name}</span>
            <span
              className={cn(
                "text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0",
                selected === cat.id
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {cat.productCount}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}