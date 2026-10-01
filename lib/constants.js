export const APP_NAME = "StorePOS";
export const APP_DESCRIPTION = "Professional Point of Sale System";
export const APP_VERSION = "1.0.0";

export const ITEMS_PER_PAGE = 10;

export const PAYMENT_METHODS = [
  { value: "cash", label: "Cash" },
  { value: "credit", label: "Credit" },
  { value: "partial", label: "Partial Payment" },
];

export const ORDER_STATUS = [
  { value: "completed", label: "Completed" },
  { value: "pending", label: "Pending" },
  { value: "cancelled", label: "Cancelled" },
];

export const STOCK_STATUS = [
  { value: "in_stock", label: "In Stock" },
  { value: "low_stock", label: "Low Stock" },
  { value: "out_of_stock", label: "Out of Stock" },
];

export const REPORT_TYPES = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

export const NAVIGATION_ITEMS = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    title: "POS Terminal",
    href: "/pos",
    icon: "Monitor",
  },
  {
    title: "Products",
    href: "/products",
    icon: "Package",
  },
  {
    title: "Categories",
    href: "/categories",
    icon: "Tags",
  },
  {
    title: "Sales",
    href: "/sales",
    icon: "ShoppingCart",
  },
  {
    title: "Shopkeepers",
    href: "/shopkeepers",
    icon: "Users",
  },
  {
    title: "Credit",
    href: "/credit",
    icon: "CreditCard",
  },
  {
    title: "Invoices",
    href: "/invoices",
    icon: "FileText",
  },
  {
    title: "Reports",
    href: "/reports",
    icon: "BarChart3",
  },
  {
    title: "Alerts",
    href: "/alerts",
    icon: "Bell",
  },
  {
    title: "Profit & Loss",
    href: "/profit-loss",
    icon: "TrendingUp",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: "Settings",
  },
];