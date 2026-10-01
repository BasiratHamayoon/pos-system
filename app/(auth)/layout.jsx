"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Store, Zap, Shield, TrendingUp } from "lucide-react";

export default function AuthLayout({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const features = [
    { icon: Zap, title: "Lightning Fast", desc: "Process sales in seconds" },
    { icon: Shield, title: "Secure & Reliable", desc: "Your data stays safe" },
    { icon: TrendingUp, title: "Smart Analytics", desc: "Grow with insights" },
  ];

  return (
    <div className="min-h-screen w-full flex bg-background">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden gradient-primary">
        <div className="absolute inset-0 gradient-mesh opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />

        <div className="relative z-10 flex flex-col justify-between p-10 text-white w-full">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2.5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm ring-1 ring-white/20">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">StorePOS</h2>
              <p className="text-[10px] text-white/70 font-medium tracking-wider uppercase">Modern Business</p>
            </div>
          </motion.div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-4xl font-bold leading-tight tracking-tight mb-3 text-balance">
                Run your store with ease & confidence
              </h1>
              <p className="text-sm text-white/80 max-w-md leading-relaxed">
                A complete point of sale solution designed for modern wholesale and retail businesses.
              </p>
            </motion.div>

            <div className="space-y-4">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm ring-1 ring-white/20 shrink-0">
                    <feature.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold mb-0.5">{feature.title}</h3>
                    <p className="text-xs text-white/70">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xs text-white/60"
          >
            © 2025 StorePOS. All rights reserved.
          </motion.div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-10 bg-background">
        <div className="w-full max-w-[400px]">{children}</div>
      </div>
    </div>
  );
}