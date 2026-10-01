"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Store, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background gradient-mesh px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center max-w-md"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary text-white shadow-lg shadow-primary/30 mb-6">
          <Store className="h-8 w-8" />
        </div>
        <span className="text-xs font-bold tracking-widest uppercase text-primary mb-2">
          Error 404
        </span>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Page Not Found</h1>
        <p className="text-sm text-muted-foreground mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/dashboard">
          <Button size="sm" className="gap-2">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}