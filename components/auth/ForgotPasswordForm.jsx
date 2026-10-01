"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[400px]"
      >
        <div className="flex flex-col items-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground mb-3 shadow-lg shadow-primary/25"
          >
            <Store className="h-7 w-7" />
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tight">StorePOS</h1>
          <p className="text-sm text-muted-foreground mt-1">Password Recovery</p>
        </div>

        <Card className="shadow-xl shadow-primary/5 border-primary/10">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Forgot Password</CardTitle>
            <CardDescription className="text-sm">
              Enter your email address and we will send you a reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@storepos.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9 h-10"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-10" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                        <span>Sending...</span>
                      </div>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>

                  <div className="text-center">
                    <Link
                      href="/login"
                      className="text-sm text-primary hover:text-primary/80 font-medium inline-flex items-center gap-1"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Back to Sign In
                    </Link>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 mx-auto mb-4"
                  >
                    <CheckCircle className="h-7 w-7" />
                  </motion.div>
                  <h3 className="text-base font-semibold mb-1">Check your email</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    We have sent a password reset link to <span className="font-medium text-foreground">{email}</span>
                  </p>
                  <Link href="/login">
                    <Button variant="outline" className="h-9">
                      <ArrowLeft className="h-3.5 w-3.5 mr-2" />
                      Back to Sign In
                    </Button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}