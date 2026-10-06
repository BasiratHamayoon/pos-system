"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, X, Grid3X3, List } from "lucide-react";
import POSCategoryFilter from "./POSCategoryFilter";

const POSSearchBar = forwardRef(({
  searchTerm, setSearchTerm, categories, selectedCategory, setSelectedCategory, viewMode, setViewMode
}, ref) => {
  return (
    <Card className="shrink-0">
      <CardContent className="p-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={ref}
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
                  viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-accent text-muted-foreground"
                )}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "h-full w-10 flex items-center justify-center transition-colors",
                  viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-accent text-muted-foreground"
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

POSSearchBar.displayName = "POSSearchBar";
export default POSSearchBar;