"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

export default function POSClearConfirmDialog({ open, onOpenChange, onConfirm }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] rounded-2xl">
        <DialogHeader className="flex flex-col items-center text-center pt-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-3">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <DialogTitle className="text-base font-bold">Clear Cart</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Remove all items from the cart?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row gap-2 mt-4 sm:justify-center">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 h-10 text-xs font-semibold rounded-xl">
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} className="flex-1 h-10 text-xs font-semibold rounded-xl">
            Clear Cart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}