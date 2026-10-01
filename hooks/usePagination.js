"use client";

import { useMemo } from "react";
import { ITEMS_PER_PAGE } from "@/lib/constants";

export function usePagination(items, currentPage, itemsPerPage = ITEMS_PER_PAGE) {
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  return {
    paginatedData,
    totalPages,
    totalItems: items.length,
    startIndex: (currentPage - 1) * itemsPerPage + 1,
    endIndex: Math.min(currentPage * itemsPerPage, items.length),
  };
}