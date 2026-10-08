"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Monitor,
  Package,
  Tags,
  ShoppingCart,
  Users,
  CreditCard,
  FileText,
  BarChart3,
  TrendingUp,
  Settings,
  Store, 
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  {
    group: "Main",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "POS Terminal", href: "/pos", icon: Monitor },
    ],
  },
  {
    group: "Inventory",
    items: [
      { title: "Products", href: "/products", icon: Package },
      { title: "Categories", href: "/categories", icon: Tags },
      { title: "Brands", href: "/brands", icon: Store }, 
    ],
  },
  {
    group: "Operations",
    items: [
      { title: "Sales", href: "/sales", icon: ShoppingCart },
      { title: "Shopkeepers", href: "/shopkeepers", icon: Users },
      { title: "Credit", href: "/credit", icon: CreditCard },
      { title: "Invoices", href: "/invoices", icon: FileText },
    ],
  },
  {
    group: "Insights",
    items: [
      { title: "Reports", href: "/reports", icon: BarChart3 },
      { title: "Profit & Loss", href: "/profit-loss", icon: TrendingUp },
    ],
  },
  {
    group: "System",
    items: [{ title: "Settings", href: "/settings", icon: Settings }],
  },
];

export default function MobileSidebar({ open, onOpenChange }) {
  const pathname = usePathname();
  const router = useRouter();
  const [openGroups, setOpenGroups] = useState(() =>
    navItems.reduce((acc, s) => ({ ...acc, [s.group]: true }), {})
  );

  const toggleGroup = (group) => {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const handleNav = (href) => {
    router.push(href);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[280px] p-0 bg-sidebar flex flex-col">
        <SheetHeader className="px-4 h-16 border-b flex-row items-center shrink-0 space-y-0">
          <SheetTitle className="flex items-center gap-2.5 text-left">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary text-white shadow-md shadow-primary/25">
              <Store className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-none">StorePOS</span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase mt-1">
                v1.0.0
              </span>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto overflow-x-hidden sidebar-scroll px-3 py-4">
          <nav className="flex flex-col gap-3">
            {navItems.map((section) => (
              <div key={section.group}>
                <button
                  onClick={() => toggleGroup(section.group)}
                  className="flex items-center justify-between w-full px-3 py-1 mb-1 text-[10px] font-bold tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>{section.group}</span>
                  <motion.div
                    animate={{ rotate: openGroups[section.group] ? 0 : -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {openGroups[section.group] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-0.5">
                        {section.items.map((item) => {
                          const isActive =
                            pathname === item.href || pathname.startsWith(item.href + "/");
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.href}
                              onClick={() => handleNav(item.href)}
                              className={cn(
                                "flex items-center w-full h-9 px-3 gap-2.5 rounded-lg text-sm font-medium transition-all",
                                isActive
                                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                  : "text-sidebar-foreground hover:bg-sidebar-accent"
                              )}
                            >
                              <Icon className="h-4 w-4 shrink-0" />
                              <span>{item.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}