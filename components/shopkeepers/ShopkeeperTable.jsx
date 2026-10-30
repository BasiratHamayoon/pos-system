"use client";

import { useRouter } from "next/navigation";
import { Eye, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

export default function ShopkeeperTable({ shopkeepers, isLoading, onDelete }) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!shopkeepers || shopkeepers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-sm font-medium">No shopkeepers found</p>
        <p className="text-xs mt-1">Add your first customer to get started</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="text-xs font-bold uppercase tracking-wider">Customer</TableHead>
          <TableHead className="text-xs font-bold uppercase tracking-wider hidden md:table-cell">Shop</TableHead>
          <TableHead className="text-xs font-bold uppercase tracking-wider hidden sm:table-cell">Phone</TableHead>
          <TableHead className="text-xs font-bold uppercase tracking-wider">Status</TableHead>
          <TableHead className="text-xs font-bold uppercase tracking-wider text-right hidden sm:table-cell">Credit</TableHead>
          <TableHead className="text-xs font-bold uppercase tracking-wider text-right w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {shopkeepers.map((s) => (
          <TableRow key={s._id} className="group">
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                  {s.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "SK"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground truncate md:hidden">{s.shopName}</p>
                </div>
              </div>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <span className="text-sm text-muted-foreground">{s.shopName || "—"}</span>
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              <span className="text-sm text-muted-foreground">{s.phone || "—"}</span>
            </TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={
                  s.status === "active"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold"
                    : "bg-gray-50 text-gray-500 border-gray-200 text-[10px] font-bold"
                }
              >
                {s.status || "active"}
              </Badge>
            </TableCell>
            <TableCell className="text-right hidden sm:table-cell">
              <span className={`text-sm font-semibold ${(s.totalCredit || 0) > 0 ? "text-red-500" : "text-emerald-600"}`}>
                {formatCurrency(s.totalCredit || 0)}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary hover:bg-primary/10"
                  onClick={() => router.push(`/shopkeepers/${s._id}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  onClick={() => onDelete(s._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}