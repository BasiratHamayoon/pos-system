"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, Printer, Eye, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";

export default function POSSuccessModal({ open, onOpenChange, invoice, onPrint, onView, onNewSale }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] rounded-2xl p-0 overflow-hidden text-center">
        <div className="gradient-primary pt-8 pb-6 px-6 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm shadow-inner"
          >
            <CheckCircle2 className="h-8 w-8 text-white" />
          </motion.div>
          <DialogTitle className="text-xl font-bold text-white mb-1">Payment Successful!</DialogTitle>
          <DialogDescription className="text-white/80 text-sm font-medium">
            Transaction #{invoice?.invoiceNo} recorded securely.
          </DialogDescription>
        </div>
        <div className="p-6 bg-background space-y-4">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 flex flex-col gap-1">
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">Total Received</span>
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-500">
              {formatCurrency(invoice?.totalAmount || 0)}
            </span>
          </div>
          <div className="space-y-2 w-full pt-2">
            <Button onClick={onPrint} className="w-full h-12 rounded-xl font-bold gap-2 text-sm shadow-lg shadow-primary/20">
              <Printer className="h-4 w-4" /> Print Receipt
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onView} className="flex-1 h-11 rounded-xl font-semibold gap-2">
                <Eye className="h-4 w-4" /> View
              </Button>
              <Button variant="secondary" onClick={onNewSale} className="flex-1 h-11 rounded-xl font-semibold gap-2">
                <RotateCcw className="h-4 w-4" /> New Sale
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}