"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, Printer, Eye, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";

export default function POSSuccessModal({ open, onOpenChange, invoice, onPrint, onView, onNewSale }) {
  const paid = Number(invoice?.paidAmount || 0);
  const credit = Number(invoice?.creditAmount || 0);
  const total = Number(invoice?.totalAmount || 0);

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
          <DialogTitle className="text-xl font-bold text-white mb-1">Transaction Successful!</DialogTitle>
          <DialogDescription className="text-white/80 text-sm font-medium">
            Invoice #{invoice?.invoiceNo} recorded
          </DialogDescription>
        </div>

        <div className="p-6 bg-background space-y-4">
          <div className="p-4 rounded-xl bg-muted/30 border space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-semibold">Total Bill</span>
              <span className="font-bold">{formatCurrency(total)}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-emerald-600 font-bold">Cash Received</span>
              <span className="font-black text-emerald-600">{formatCurrency(paid)}</span>
            </div>
            {credit > 0 && (
              <div className="flex justify-between items-center text-xs pt-1 border-t border-dashed">
                <span className="text-orange-600 font-bold">Added to Khata / Udhaar</span>
                <span className="font-black text-orange-600">{formatCurrency(credit)}</span>
              </div>
            )}
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