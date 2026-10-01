"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";

export default function DataTable({ columns, data, onRowClick }) {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {columns.map((column) => (
              <TableHead key={column.key} className={`text-xs font-semibold ${column.className || ""}`}>
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-sm text-muted-foreground">
                No results found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <motion.tr
                key={row.id || index}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`border-b transition-colors hover:bg-muted/50 ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column) => (
                  <TableCell key={column.key} className={`text-sm ${column.cellClassName || ""}`}>
                    {column.render ? column.render(row) : row[column.key]}
                  </TableCell>
                ))}
              </motion.tr>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}