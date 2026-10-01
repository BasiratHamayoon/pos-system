"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/store/actions/authActions";
import { clearError } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@storepos.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(loginUser({ email, password }));
    setTimeout(() => {
      const { store } = require("@/store/store");
      if (store.getState().auth.isAuthenticated) {
        router.push("/dashboard");
      }
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="lg:hidden flex items-center gap-2.5 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary text-white shadow-lg shadow-primary/30">
          <Store className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-bold">StorePOS</h2>
          <p className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">
            Modern Business
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight mb-1.5">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access your dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-xs border border-destructive/20"
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
              placeholder="admin@storepos.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9 h-11 text-sm"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs font-semibold">
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-xs text-primary hover:underline font-semibold"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-9 pr-9 h-11 text-sm"
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

        <Button
          type="submit"
          className="w-full h-11 text-sm font-semibold group"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
              <span>Signing in...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          )}
        </Button>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-3 text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
              Demo Credentials
            </span>
          </div>
        </div>

        <div className="rounded-lg bg-muted/50 border p-3 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Email:</span>
            <span className="font-mono font-semibold">admin@storepos.com</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Password:</span>
            <span className="font-mono font-semibold">admin123</span>
          </div>
        </div>
      </form>
    </motion.div>
  );
}