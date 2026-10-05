"use client";

import { useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword as resetPasswordAction } from "@/store/actions/authActions";
import { debounce } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, CheckCircle2, Store, ArrowLeft, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const processSubmit = async (passVal) => {
    setIsLoading(true);
    setError("");
    try {
      await resetPasswordAction(token, passVal);
      setIsSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSubmit = useCallback(debounce((p) => processSubmit(p), 500), [token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!token) {
      setError("Invalid or missing reset token");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    debouncedSubmit(password);
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
                Create Password
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Enter your new password below
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div key="form" exit={{ opacity: 0, y: -10 }}>
                <form onSubmit={handleSubmit} className="space-y-3.5">
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
                    <Label htmlFor="password" className="text-xs font-semibold">
                      New Password
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-9 pr-9 h-10 text-sm rounded-xl bg-background"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="confirm" className="text-xs font-semibold">
                      Confirm Password
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="confirm"
                        type={showConfirm ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-9 pr-9 h-10 text-sm rounded-xl bg-background"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
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
                        <span>Updating...</span>
                      </div>
                    ) : (
                      "Reset Password"
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
                <h2 className="text-lg font-bold mb-1">Update Successful</h2>
                <p className="text-xs text-muted-foreground mb-4">
                  Your password has been changed.
                </p>
                <p className="text-[10px] text-muted-foreground">Redirecting to login...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex justify-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}