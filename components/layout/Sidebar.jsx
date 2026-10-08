"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarCollapsed } = useSelector((state) => state.theme);
  const [openGroups, setOpenGroups] = useState(() =>
    navItems.reduce((acc, s) => ({ ...acc, [s.group]: true }), {})
  );

  const toggleGroup = (group) => {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const navItemClasses = (isActive) =>
    cn(
      "group relative flex items-center w-full h-9 rounded-lg text-sm font-medium transition-all cursor-pointer select-none",
      sidebarCollapsed ? "justify-center px-0" : "px-3 gap-2.5",
      isActive
        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
        : "text-sidebar-foreground hover:bg-sidebar-accent"
    );

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r bg-sidebar hidden lg:flex flex-col transition-[width] duration-300 ease-in-out",
          sidebarCollapsed ? "w-[72px]" : "w-[248px]"
        )}
      >
        <div className="flex h-16 items-center justify-center px-4 border-b shrink-0 overflow-hidden">
          <AnimatePresence mode="wait">
            {!sidebarCollapsed ? (
              <motion.div
                key="full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2.5 w-full"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary text-white shadow-md shadow-primary/25 shrink-0">
                  <Store className="h-4 w-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold tracking-tight leading-none truncate">
                    StorePOS
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase mt-0.5">
                    v1.0.0
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary text-white shadow-md shadow-primary/25"
              >
                <Store className="h-4 w-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden sidebar-scroll px-3 py-4">
          <nav className="flex flex-col gap-3">
            {navItems.map((section) => (
              <div key={section.group}>
                {!sidebarCollapsed && (
                  <button
                    type="button"
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
                )}

                <AnimatePresence initial={false}>
                  {(sidebarCollapsed || openGroups[section.group]) && (
                    <motion.div
                      initial={sidebarCollapsed ? false : { height: 0, opacity: 0 }}
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

                          if (sidebarCollapsed) {
                            return (
                              <Tooltip key={item.href}>
                                <TooltipTrigger
                                  onClick={() => router.push(item.href)}
                                  className={navItemClasses(isActive)}
                                >
                                  <Icon className="h-4 w-4 shrink-0" />
                                </TooltipTrigger>
                                <TooltipContent side="right" className="text-xs font-medium">
                                  {item.title}
                                </TooltipContent>
                              </Tooltip>
                            );
                          }

                          return (
                            <button
                              key={item.href}
                              type="button"
                              onClick={() => router.push(item.href)}
                              className={navItemClasses(isActive)}
                            >
                              <Icon className="h-4 w-4 shrink-0" />
                              <span className="truncate">{item.title}</span>
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
      </aside>
    </TooltipProvider>
  );
}