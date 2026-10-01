export const dummyCategories = [
    { id: "cat-1", name: "Chips", description: "All types of chips and crisps", productCount: 24, status: "active", createdAt: "2024-01-15" },
    { id: "cat-2", name: "Daal", description: "Lentils and pulses varieties", productCount: 18, status: "active", createdAt: "2024-01-15" },
    { id: "cat-3", name: "Cookies", description: "Biscuits and cookies", productCount: 32, status: "active", createdAt: "2024-01-16" },
    { id: "cat-4", name: "Beverages", description: "Drinks and juices", productCount: 15, status: "active", createdAt: "2024-01-16" },
    { id: "cat-5", name: "Grocery", description: "Daily grocery items", productCount: 56, status: "active", createdAt: "2024-01-17" },
    { id: "cat-6", name: "Snacks", description: "Namkeen and snack items", productCount: 28, status: "active", createdAt: "2024-01-17" },
    { id: "cat-7", name: "Rice", description: "All types of rice", productCount: 12, status: "active", createdAt: "2024-01-18" },
    { id: "cat-8", name: "Oil & Ghee", description: "Cooking oils and ghee", productCount: 9, status: "active", createdAt: "2024-01-18" },
    { id: "cat-9", name: "Spices", description: "All cooking spices", productCount: 35, status: "active", createdAt: "2024-01-19" },
    { id: "cat-10", name: "Sugar & Salt", description: "Sugar and salt varieties", productCount: 6, status: "active", createdAt: "2024-01-19" },
  ];
  
  export const dummyProducts = [
    { id: "prod-1", name: "Lays Classic Salted", category: "Chips", categoryId: "cat-1", price: 50, costPrice: 40, stock: 150, minStock: 20, unit: "pcs", barcode: "8901234567001", status: "in_stock", createdAt: "2024-01-20" },
    { id: "prod-2", name: "Kurkure Masala Munch", category: "Chips", categoryId: "cat-1", price: 30, costPrice: 22, stock: 200, minStock: 30, unit: "pcs", barcode: "8901234567002", status: "in_stock", createdAt: "2024-01-20" },
    { id: "prod-3", name: "Chana Daal 1kg", category: "Daal", categoryId: "cat-2", price: 280, costPrice: 240, stock: 45, minStock: 10, unit: "kg", barcode: "8901234567003", status: "in_stock", createdAt: "2024-01-21" },
    { id: "prod-4", name: "Masoor Daal 1kg", category: "Daal", categoryId: "cat-2", price: 320, costPrice: 275, stock: 5, minStock: 10, unit: "kg", barcode: "8901234567004", status: "low_stock", createdAt: "2024-01-21" },
    { id: "prod-5", name: "Oreo Original", category: "Cookies", categoryId: "cat-3", price: 60, costPrice: 48, stock: 0, minStock: 15, unit: "pcs", barcode: "8901234567005", status: "out_of_stock", createdAt: "2024-01-22" },
    { id: "prod-6", name: "Sooper Biscuit", category: "Cookies", categoryId: "cat-3", price: 25, costPrice: 18, stock: 300, minStock: 50, unit: "pcs", barcode: "8901234567006", status: "in_stock", createdAt: "2024-01-22" },
    { id: "prod-7", name: "Pepsi 1.5L", category: "Beverages", categoryId: "cat-4", price: 160, costPrice: 135, stock: 80, minStock: 20, unit: "pcs", barcode: "8901234567007", status: "in_stock", createdAt: "2024-01-23" },
    { id: "prod-8", name: "Nestle Pure Life 1.5L", category: "Beverages", categoryId: "cat-4", price: 80, costPrice: 60, stock: 3, minStock: 15, unit: "pcs", barcode: "8901234567008", status: "low_stock", createdAt: "2024-01-23" },
    { id: "prod-9", name: "Sunflower Oil 5L", category: "Oil & Ghee", categoryId: "cat-8", price: 2200, costPrice: 1950, stock: 25, minStock: 5, unit: "pcs", barcode: "8901234567009", status: "in_stock", createdAt: "2024-01-24" },
    { id: "prod-10", name: "Basmati Rice 5kg", category: "Rice", categoryId: "cat-7", price: 950, costPrice: 820, stock: 0, minStock: 8, unit: "pcs", barcode: "8901234567010", status: "out_of_stock", createdAt: "2024-01-24" },
    { id: "prod-11", name: "Sugar 1kg", category: "Sugar & Salt", categoryId: "cat-10", price: 140, costPrice: 120, stock: 60, minStock: 15, unit: "kg", barcode: "8901234567011", status: "in_stock", createdAt: "2024-01-25" },
    { id: "prod-12", name: "Salt 800g", category: "Sugar & Salt", categoryId: "cat-10", price: 55, costPrice: 40, stock: 90, minStock: 20, unit: "pcs", barcode: "8901234567012", status: "in_stock", createdAt: "2024-01-25" },
    { id: "prod-13", name: "Red Chilli Powder 200g", category: "Spices", categoryId: "cat-9", price: 180, costPrice: 145, stock: 40, minStock: 10, unit: "pcs", barcode: "8901234567013", status: "in_stock", createdAt: "2024-01-26" },
    { id: "prod-14", name: "Turmeric Powder 200g", category: "Spices", categoryId: "cat-9", price: 120, costPrice: 95, stock: 55, minStock: 10, unit: "pcs", barcode: "8901234567014", status: "in_stock", createdAt: "2024-01-26" },
    { id: "prod-15", name: "Nimko Mix 250g", category: "Snacks", categoryId: "cat-6", price: 100, costPrice: 78, stock: 2, minStock: 12, unit: "pcs", barcode: "8901234567015", status: "low_stock", createdAt: "2024-01-27" },
  ];
  
  export const dummyShopkeepers = [
    { id: "sk-1", name: "Ahmed Khan", shopName: "Khan General Store", phone: "0301-1234567", address: "Shop 12, Main Bazar, Lahore", totalCredit: 15600, totalPurchases: 245000, status: "active", createdAt: "2024-01-10" },
    { id: "sk-2", name: "Muhammad Ali", shopName: "Ali Grocery", phone: "0302-2345678", address: "Shop 5, Saddar, Karachi", totalCredit: 8900, totalPurchases: 189000, status: "active", createdAt: "2024-01-12" },
    { id: "sk-3", name: "Usman Malik", shopName: "Malik Mart", phone: "0303-3456789", address: "Shop 23, GT Road, Rawalpindi", totalCredit: 0, totalPurchases: 320000, status: "active", createdAt: "2024-01-14" },
    { id: "sk-4", name: "Hassan Raza", shopName: "Raza Corner", phone: "0304-4567890", address: "Shop 8, University Road, Faisalabad", totalCredit: 25400, totalPurchases: 156000, status: "active", createdAt: "2024-01-15" },
    { id: "sk-5", name: "Bilal Ahmad", shopName: "Ahmad Store", phone: "0305-5678901", address: "Shop 15, Mall Road, Multan", totalCredit: 3200, totalPurchases: 98000, status: "active", createdAt: "2024-01-18" },
    { id: "sk-6", name: "Tariq Mehmood", shopName: "Mehmood Grocery", phone: "0306-6789012", address: "Shop 3, Cantt Area, Peshawar", totalCredit: 42000, totalPurchases: 412000, status: "active", createdAt: "2024-01-20" },
    { id: "sk-7", name: "Imran Shah", shopName: "Shah Ji Store", phone: "0307-7890123", address: "Shop 19, Old City, Hyderabad", totalCredit: 11500, totalPurchases: 167000, status: "inactive", createdAt: "2024-01-22" },
    { id: "sk-8", name: "Waqas Hussain", shopName: "Hussain Mart", phone: "0308-8901234", address: "Shop 7, Jinnah Road, Quetta", totalCredit: 0, totalPurchases: 285000, status: "active", createdAt: "2024-01-25" },
  ];
  
  export const dummySales = [
    { id: "sale-1", invoiceNo: "INV-2024-001", shopkeeperId: "sk-1", shopkeeperName: "Ahmed Khan", items: 8, totalAmount: 4580, paidAmount: 4580, creditAmount: 0, paymentMethod: "cash", status: "completed", date: "2024-02-01" },
    { id: "sale-2", invoiceNo: "INV-2024-002", shopkeeperId: "sk-2", shopkeeperName: "Muhammad Ali", items: 12, totalAmount: 8900, paidAmount: 5000, creditAmount: 3900, paymentMethod: "partial", status: "completed", date: "2024-02-01" },
    { id: "sale-3", invoiceNo: "INV-2024-003", shopkeeperId: "sk-4", shopkeeperName: "Hassan Raza", items: 5, totalAmount: 2340, paidAmount: 0, creditAmount: 2340, paymentMethod: "credit", status: "completed", date: "2024-02-02" },
    { id: "sale-4", invoiceNo: "INV-2024-004", shopkeeperId: "sk-3", shopkeeperName: "Usman Malik", items: 15, totalAmount: 12500, paidAmount: 12500, creditAmount: 0, paymentMethod: "cash", status: "completed", date: "2024-02-02" },
    { id: "sale-5", invoiceNo: "INV-2024-005", shopkeeperId: "sk-6", shopkeeperName: "Tariq Mehmood", items: 20, totalAmount: 18750, paidAmount: 10000, creditAmount: 8750, paymentMethod: "partial", status: "completed", date: "2024-02-03" },
    { id: "sale-6", invoiceNo: "INV-2024-006", shopkeeperId: "sk-1", shopkeeperName: "Ahmed Khan", items: 6, totalAmount: 3200, paidAmount: 3200, creditAmount: 0, paymentMethod: "cash", status: "completed", date: "2024-02-03" },
    { id: "sale-7", invoiceNo: "INV-2024-007", shopkeeperId: "sk-5", shopkeeperName: "Bilal Ahmad", items: 10, totalAmount: 7600, paidAmount: 7600, creditAmount: 0, paymentMethod: "cash", status: "completed", date: "2024-02-04" },
    { id: "sale-8", invoiceNo: "INV-2024-008", shopkeeperId: "sk-2", shopkeeperName: "Muhammad Ali", items: 3, totalAmount: 1890, paidAmount: 0, creditAmount: 1890, paymentMethod: "credit", status: "pending", date: "2024-02-04" },
    { id: "sale-9", invoiceNo: "INV-2024-009", shopkeeperId: "sk-8", shopkeeperName: "Waqas Hussain", items: 18, totalAmount: 14200, paidAmount: 14200, creditAmount: 0, paymentMethod: "cash", status: "completed", date: "2024-02-05" },
    { id: "sale-10", invoiceNo: "INV-2024-010", shopkeeperId: "sk-4", shopkeeperName: "Hassan Raza", items: 7, totalAmount: 5400, paidAmount: 2000, creditAmount: 3400, paymentMethod: "partial", status: "completed", date: "2024-02-05" },
  ];
  
  export const dummyCredits = [
    { id: "cr-1", shopkeeperId: "sk-1", shopkeeperName: "Ahmed Khan", shopName: "Khan General Store", totalCredit: 15600, lastPayment: 5000, lastPaymentDate: "2024-02-01", invoices: ["INV-2024-001", "INV-2024-006"], status: "pending" },
    { id: "cr-2", shopkeeperId: "sk-2", shopkeeperName: "Muhammad Ali", shopName: "Ali Grocery", totalCredit: 8900, lastPayment: 3000, lastPaymentDate: "2024-01-28", invoices: ["INV-2024-002", "INV-2024-008"], status: "pending" },
    { id: "cr-3", shopkeeperId: "sk-4", shopkeeperName: "Hassan Raza", shopName: "Raza Corner", totalCredit: 25400, lastPayment: 0, lastPaymentDate: null, invoices: ["INV-2024-003", "INV-2024-010"], status: "overdue" },
    { id: "cr-4", shopkeeperId: "sk-5", shopkeeperName: "Bilal Ahmad", shopName: "Ahmad Store", totalCredit: 3200, lastPayment: 2000, lastPaymentDate: "2024-02-03", invoices: [], status: "pending" },
    { id: "cr-5", shopkeeperId: "sk-6", shopkeeperName: "Tariq Mehmood", shopName: "Mehmood Grocery", totalCredit: 42000, lastPayment: 10000, lastPaymentDate: "2024-02-02", invoices: ["INV-2024-005"], status: "overdue" },
    { id: "cr-6", shopkeeperId: "sk-7", shopkeeperName: "Imran Shah", shopName: "Shah Ji Store", totalCredit: 11500, lastPayment: 5000, lastPaymentDate: "2024-01-25", invoices: [], status: "overdue" },
  ];
  
  export const dummyAlerts = [
    { id: "alert-1", type: "out_of_stock", productId: "prod-5", productName: "Oreo Original", message: "Product is out of stock", stock: 0, minStock: 15, severity: "critical", isRead: false, createdAt: "2024-02-05T10:30:00" },
    { id: "alert-2", type: "out_of_stock", productId: "prod-10", productName: "Basmati Rice 5kg", message: "Product is out of stock", stock: 0, minStock: 8, severity: "critical", isRead: false, createdAt: "2024-02-05T09:15:00" },
    { id: "alert-3", type: "low_stock", productId: "prod-4", productName: "Masoor Daal 1kg", message: "Stock is below minimum level", stock: 5, minStock: 10, severity: "warning", isRead: false, createdAt: "2024-02-04T14:20:00" },
    { id: "alert-4", type: "low_stock", productId: "prod-8", productName: "Nestle Pure Life 1.5L", message: "Stock is below minimum level", stock: 3, minStock: 15, severity: "warning", isRead: true, createdAt: "2024-02-04T11:45:00" },
    { id: "alert-5", type: "low_stock", productId: "prod-15", productName: "Nimko Mix 250g", message: "Stock is below minimum level", stock: 2, minStock: 12, severity: "warning", isRead: false, createdAt: "2024-02-03T16:30:00" },
    { id: "alert-6", type: "credit_overdue", shopkeeperId: "sk-4", shopkeeperName: "Hassan Raza", message: "Credit amount overdue: Rs. 25,400", amount: 25400, severity: "critical", isRead: false, createdAt: "2024-02-05T08:00:00" },
    { id: "alert-7", type: "credit_overdue", shopkeeperId: "sk-6", shopkeeperName: "Tariq Mehmood", message: "Credit amount overdue: Rs. 42,000", amount: 42000, severity: "critical", isRead: true, createdAt: "2024-02-04T08:00:00" },
    { id: "alert-8", type: "credit_high", shopkeeperId: "sk-7", shopkeeperName: "Imran Shah", message: "High credit balance: Rs. 11,500", amount: 11500, severity: "warning", isRead: false, createdAt: "2024-02-03T08:00:00" },
  ];
  
  export const dummyInvoices = [
    {
      id: "inv-1",
      invoiceNo: "INV-2024-001",
      shopkeeperId: "sk-1",
      shopkeeperName: "Ahmed Khan",
      shopName: "Khan General Store",
      phone: "0301-1234567",
      address: "Shop 12, Main Bazar, Lahore",
      items: [
        { productId: "prod-1", name: "Lays Classic Salted", qty: 24, price: 50, total: 1200 },
        { productId: "prod-2", name: "Kurkure Masala Munch", qty: 30, price: 30, total: 900 },
        { productId: "prod-6", name: "Sooper Biscuit", qty: 48, price: 25, total: 1200 },
        { productId: "prod-7", name: "Pepsi 1.5L", qty: 8, price: 160, total: 1280 },
      ],
      subtotal: 4580,
      discount: 0,
      totalAmount: 4580,
      paidAmount: 4580,
      creditAmount: 0,
      paymentMethod: "cash",
      status: "paid",
      date: "2024-02-01T10:30:00",
    },
    {
      id: "inv-2",
      invoiceNo: "INV-2024-002",
      shopkeeperId: "sk-2",
      shopkeeperName: "Muhammad Ali",
      shopName: "Ali Grocery",
      phone: "0302-2345678",
      address: "Shop 5, Saddar, Karachi",
      items: [
        { productId: "prod-3", name: "Chana Daal 1kg", qty: 10, price: 280, total: 2800 },
        { productId: "prod-9", name: "Sunflower Oil 5L", qty: 2, price: 2200, total: 4400 },
        { productId: "prod-11", name: "Sugar 1kg", qty: 5, price: 140, total: 700 },
        { productId: "prod-13", name: "Red Chilli Powder 200g", qty: 5, price: 180, total: 900 },
        { productId: "prod-14", name: "Turmeric Powder 200g", qty: 1, price: 120, total: 120 },
      ],
      subtotal: 8920,
      discount: 20,
      totalAmount: 8900,
      paidAmount: 5000,
      creditAmount: 3900,
      paymentMethod: "partial",
      status: "partial",
      date: "2024-02-01T14:15:00",
    },
    {
      id: "inv-3",
      invoiceNo: "INV-2024-003",
      shopkeeperId: "sk-4",
      shopkeeperName: "Hassan Raza",
      shopName: "Raza Corner",
      phone: "0304-4567890",
      address: "Shop 8, University Road, Faisalabad",
      items: [
        { productId: "prod-1", name: "Lays Classic Salted", qty: 12, price: 50, total: 600 },
        { productId: "prod-6", name: "Sooper Biscuit", qty: 24, price: 25, total: 600 },
        { productId: "prod-12", name: "Salt 800g", qty: 10, price: 55, total: 550 },
        { productId: "prod-14", name: "Turmeric Powder 200g", qty: 5, price: 120, total: 600 },
      ],
      subtotal: 2350,
      discount: 10,
      totalAmount: 2340,
      paidAmount: 0,
      creditAmount: 2340,
      paymentMethod: "credit",
      status: "unpaid",
      date: "2024-02-02T09:45:00",
    },
  ];
  
  export const dummyRevenueData = [
    { month: "Jan", revenue: 185000, expenses: 142000, profit: 43000 },
    { month: "Feb", revenue: 220000, expenses: 168000, profit: 52000 },
    { month: "Mar", revenue: 198000, expenses: 155000, profit: 43000 },
    { month: "Apr", revenue: 245000, expenses: 185000, profit: 60000 },
    { month: "May", revenue: 267000, expenses: 198000, profit: 69000 },
    { month: "Jun", revenue: 234000, expenses: 178000, profit: 56000 },
    { month: "Jul", revenue: 289000, expenses: 215000, profit: 74000 },
    { month: "Aug", revenue: 312000, expenses: 235000, profit: 77000 },
    { month: "Sep", revenue: 278000, expenses: 210000, profit: 68000 },
    { month: "Oct", revenue: 295000, expenses: 220000, profit: 75000 },
    { month: "Nov", revenue: 330000, expenses: 248000, profit: 82000 },
    { month: "Dec", revenue: 356000, expenses: 265000, profit: 91000 },
  ];
  
  export const dummyDailySalesData = [
    { day: "Mon", sales: 45200 },
    { day: "Tue", sales: 38700 },
    { day: "Wed", sales: 52300 },
    { day: "Thu", sales: 41800 },
    { day: "Fri", sales: 61500 },
    { day: "Sat", sales: 72400 },
    { day: "Sun", sales: 28900 },
  ];
  
  export const dummyCategorySalesData = [
    { name: "Chips", value: 28, fill: "hsl(245, 58%, 51%)" },
    { name: "Daal", value: 15, fill: "hsl(160, 60%, 45%)" },
    { name: "Cookies", value: 20, fill: "hsl(30, 80%, 55%)" },
    { name: "Beverages", value: 12, fill: "hsl(280, 65%, 60%)" },
    { name: "Grocery", value: 25, fill: "hsl(340, 75%, 55%)" },
  ];
  
  export const dummyReports = [
    { id: "rpt-1", title: "Daily Sales Report", type: "daily", date: "2024-02-05", totalSales: 45600, totalItems: 156, generatedAt: "2024-02-05T18:00:00" },
    { id: "rpt-2", title: "Weekly Sales Report", type: "weekly", date: "2024-02-04", totalSales: 289500, totalItems: 1024, generatedAt: "2024-02-04T18:00:00" },
    { id: "rpt-3", title: "Monthly Sales Report", type: "monthly", date: "2024-01-31", totalSales: 1245000, totalItems: 4520, generatedAt: "2024-01-31T23:59:00" },
    { id: "rpt-4", title: "Shopkeeper Report - Ahmed Khan", type: "shopkeeper", date: "2024-02-05", totalSales: 78500, totalItems: 320, generatedAt: "2024-02-05T12:00:00" },
    { id: "rpt-5", title: "Stock Report", type: "stock", date: "2024-02-05", totalSales: 0, totalItems: 15, generatedAt: "2024-02-05T08:00:00" },
  ];
  
  export const dummyUser = {
    id: "user-1",
    name: "Store Admin",
    email: "admin@storepos.com",
    role: "admin",
    avatar: null,
    storeName: "Al-Madina Wholesale",
    storeAddress: "Shop 45, Wholesale Market, Lahore",
    storePhone: "042-35678901",
  };