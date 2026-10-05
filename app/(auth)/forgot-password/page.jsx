"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/store/actions/authActions";
import { debounce } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, CheckCircle2, Store, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const processSubmit = async (emailVal) => {
    setIsLoading(true);
    setError("");
    try {
      await forgotPassword(emailVal);
      setIsSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSubmit = useCallback(debounce((e) => processSubmit(e), 500), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    debouncedSubmit(email);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full"
    >
      <div className="rounded-2xl border border-border bg-card text-card-foreground shadow-xl shadow-black/5 dark:shadow-black/30 overflow-hidden">
        <div className="h-1 w-full gradient-primary" />

        <div className="px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary text-white shadow-md shadow-primary/25 shrink-0">
              <Store className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold tracking-tight leading-none">
                Reset Password
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Enter your email address
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-destructive/10 text-destructive text-xs border border-destructive/20"
                    >
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold">
                      Email Address
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9 h-10 text-sm rounded-xl bg-background"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-10 text-sm font-bold rounded-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
                        <span>Sending...</span>
                      </div>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>

                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-muted-foreground hover:text-primary transition-colors mt-2"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Back to Sign In
                  </Link>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="text-lg font-bold mb-1">Check your email</h2>
                <p className="text-xs text-muted-foreground mb-4">
                  We sent a reset link to <span className="font-semibold text-foreground">{email}</span>
                </p>
                <Button
                  variant="outline"
                  onClick={() => router.push('/login')}
                  className="w-full h-10 text-sm font-bold rounded-xl"
                >
                  Return to Login
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}