"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Printer,
  Phone,
  MapPin,
  Building,
  CreditCard,
  Receipt,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Store,
  FileText,
} from "lucide-react";
import api from "@/lib/api";

// --- Printable Ledger Receipt Component ---
const LedgerReceipt = React.forwardRef(({ shopkeeper, history, totalBill, totalPaid, balance }, ref) => {
  const salesList = Array.isArray(history)
    ? history
    : Array.isArray(history?.sales)
    ? history.sales
    : Array.isArray(history?.data)
    ? history.data
    : [];

  const now = new Date();
  const currentDate = now.toLocaleDateString("en-GB"); // DD/MM/YYYY
  const currentTime = now.toLocaleTimeString("en-US", { hour12: true });

  return (
    <div
      ref={ref}
      className="printable-ledger hidden print:block p-8 bg-white text-black font-sans text-xs max-w-4xl mx-auto border border-gray-300"
    >
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          .printable-ledger, .printable-ledger * { visibility: visible !important; }
          .printable-ledger {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            background: white !important;
            color: black !important;
          }
          @page { size: portrait; margin: 10mm; }
        }
      `}</style>

      {/* Main Header */}
      <div className="border-b-2 border-black pb-3 mb-4 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-black tracking-wide uppercase text-black">
            ABUBAKAR TRADERS CHARSADDA
          </h1>
          <p className="text-xs font-semibold text-gray-700">
            Wholesale & Retail Merchant | Sales Ledger Statement
          </p>
          <p className="text-[11px] text-gray-600">
            Nowshera Road Near Tabeleghi Markaz Charsadda
          </p>
          <p className="text-[11px] font-bold text-black">
            PH: 03189172417, 03429277709, 03139618834
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold uppercase tracking-wider text-black">YEARLY LEDGER</p>
          <p className="text-xs">
            <span className="font-semibold">Date:</span> {currentDate}
          </p>
          <p className="text-xs">
            <span className="font-semibold">Time:</span> {currentTime}
          </p>
        </div>
      </div>

      {/* Customer Info Box */}
      <div className="border border-black p-3 mb-4 rounded-none bg-gray-50/50">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p>
              <strong className="font-bold">M/S (Shopkeeper):</strong>{" "}
              {shopkeeper?.name || shopkeeper?.shopName || "N/A"}
            </p>
            <p>
              <strong className="font-bold">Shop Name:</strong> {shopkeeper?.shopName || "N/A"}
            </p>
            <p>
              <strong className="font-bold">Address:</strong> {shopkeeper?.address || "Charsadda"}
            </p>
          </div>
          <div className="text-right">
            <p>
              <strong className="font-bold">Contact #:</strong> {shopkeeper?.phone || "N/A"}
            </p>
            <p>
              <strong className="font-bold">Ledger Period:</strong> All Time Statement
            </p>
            <p>
              <strong className="font-bold">Total Invoices:</strong> {salesList.length}
            </p>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <table className="w-full text-left border-collapse border border-black text-xs mb-4">
        <thead>
          <tr className="bg-gray-200 border-b border-black text-center font-bold">
            <th className="border border-black p-2 w-12">S.#</th>
            <th className="border border-black p-2 w-24">Date</th>
            <th className="border border-black p-2 w-24">Invoice #</th>
            {/* NEW COLUMN IN PRINT LEDGER */}
            <th className="border border-black p-2 text-left pl-2">Purchased Products</th>
            <th className="border border-black p-2">Total Amount</th>
            <th className="border border-black p-2">Paid Amount</th>
            <th className="border border-black p-2">Balance / Due</th>
            <th className="border border-black p-2 w-20">Status</th>
          </tr>
        </thead>
        <tbody>
          {salesList.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center p-4 border border-black text-gray-500 italic">
                No transactions recorded for this shopkeeper.
              </td>
            </tr>
          ) : (
            salesList.map((inv, index) => {
              const invTotal = Number(inv.totalAmount || inv.grandTotal || 0);
              const invPaid = Number(inv.paidAmount || inv.paid || 0);
              const isPaid = inv.status === "PAID" || inv.isPaid || inv.paymentStatus === "PAID";

              const invBalance = isPaid
                ? 0
                : inv.dueAmount !== undefined && inv.dueAmount !== null
                ? Number(inv.dueAmount)
                : inv.remainingAmount !== undefined && inv.remainingAmount !== null
                ? Number(inv.remainingAmount)
                : inv.balance !== undefined && inv.balance !== null
                ? Number(inv.balance)
                : Math.max(0, invTotal - invPaid);

              const status = invBalance <= 0 ? "PAID" : invPaid > 0 ? "PARTIAL" : "UNPAID";
              const dateStr =
                inv.createdAt || inv.date
                  ? new Date(inv.createdAt || inv.date).toLocaleDateString("en-GB")
                  : "-";

              // EXTRACT PRODUCT NAMES
              const productsString = Array.isArray(inv.items) && inv.items.length > 0
                ? inv.items.map(i => {
                    const pName = i.name || i.product?.name || i.productId?.name || "Product";
                    const qty = i.qty || i.quantity || 1;
                    return `${pName} (${qty}x)`;
                  }).join(", ")
                : "General Invoice";

              return (
                <tr key={inv._id || inv.id || index} className="border-b border-black text-center">
                  <td className="border border-black p-1.5 font-mono">{index + 1}</td>
                  <td className="border border-black p-1.5">{dateStr}</td>
                  <td className="border border-black p-1.5 font-semibold font-mono">
                    {inv.invoiceNo || inv.invoiceNumber || inv._id?.substring(0, 8) || `-`}
                  </td>
                  {/* NEW COLUMN DATA IN PRINT LEDGER */}
                  <td className="border border-black p-1.5 text-left text-[10px] pl-2 font-medium max-w-[200px] truncate">
                    {productsString}
                  </td>
                  <td className="border border-black p-1.5 text-right pr-3">
                    Rs. {invTotal.toLocaleString()}
                  </td>
                  <td className="border border-black p-1.5 text-right pr-3">
                    Rs. {invPaid.toLocaleString()}
                  </td>
                  <td className="border border-black p-1.5 text-right pr-3 font-semibold">
                    Rs. {invBalance.toLocaleString()}
                  </td>
                  <td className="border border-black p-1.5 uppercase font-bold text-[9px]">
                    {status}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Total Calculations */}
      <div className="flex justify-between items-start border border-black p-3 bg-gray-50 mb-6">
        <div className="space-y-1 text-xs">
          <p>
            <span className="font-bold">Total Record Count:</span> {salesList.length} Transactions
          </p>
          <p>
            <span className="font-bold">Printed On:</span> {currentDate} {currentTime}
          </p>
        </div>
        <div className="w-64 space-y-1 text-xs">
          <div className="flex justify-between py-0.5">
            <span className="font-bold">Total Purchases (Bill):</span>
            <span className="font-mono">Rs. {Number(totalBill).toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="font-bold">Total Paid:</span>
            <span className="font-mono">Rs. {Number(totalPaid).toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1 border-t border-black font-bold text-sm">
            <span>Net Remaining Balance:</span>
            <span className="font-mono">Rs. {Number(balance).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Urdu Terms & Signatures */}
      <div className="mt-8 border-t border-dashed border-gray-400 pt-4">
        <p className="text-right text-sm font-semibold mb-6 font-serif" dir="rtl">
          نوٹ: مال کی چیکنگ موقع پر کر لیں۔ بعد میں کوئی دعویٰ قابلِ قبول نہ ہوگا۔
        </p>

        <div className="flex justify-between items-end pt-8">
          <div className="text-center w-40 border-t border-black pt-1">
            <p className="font-bold text-xs">Shopkeeper Signature</p>
          </div>
          <div className="text-center w-40 border-t border-black pt-1">
            <p className="font-bold text-xs">Authorized Signature</p>
            <p className="text-[10px] text-gray-500">Abubakar Traders</p>
          </div>
        </div>
      </div>
    </div>
  );
});

LedgerReceipt.displayName = "LedgerReceipt";

// --- Main Shopkeeper Detail Page Component ---
export default function ShopkeeperDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [shopkeeper, setShopkeeper] = useState(null);
  const [salesHistory, setSalesHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const initializedRef = useRef(false);
  const ledgerPrintRef = useRef(null);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const fetchShopkeeperData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 1. Fetch shopkeeper profile
        const skRes = await api.get(`/shopkeepers/${id}`);
        const skData = skRes.data?.data || skRes.data || skRes;
        setShopkeeper(skData);

        // Check embedded sales
        let list = Array.isArray(skData?.sales)
          ? skData.sales
          : Array.isArray(skData?.history)
          ? skData.history
          : Array.isArray(skData?.transactions)
          ? skData.transactions
          : null;

        // 2. Fetch sales from /sales if not embedded
        if (!list) {
          try {
            const salesRes = await api.get(`/sales`, {
              params: { shopkeeper: id, customer: id, shopkeeperId: id },
            });
            const rawSales =
              salesRes.data?.sales || salesRes.data?.data || salesRes.data || [];

            if (Array.isArray(rawSales)) {
              const filtered = rawSales.filter((s) => {
                const sSkId =
                  s.shopkeeper?._id ||
                  s.shopkeeper ||
                  s.shopkeeperId ||
                  s.customer?._id ||
                  s.customer ||
                  s.customerId;
                if (sSkId && String(sSkId) === String(id)) return true;

                if (
                  skData?.name &&
                  (s.shopkeeperName === skData.name || s.customerName === skData.name)
                )
                  return true;
                if (
                  skData?.shopName &&
                  (s.shopkeeperName === skData.shopName || s.customerName === skData.shopName)
                )
                  return true;

                return false;
              });

              list = filtered.length > 0 ? filtered : rawSales;
            }
          } catch (salesErr) {
            console.warn("Could not fetch sales list:", salesErr);
            list = [];
          }
        }

        setSalesHistory(list || []);
      } catch (err) {
        console.error("Error fetching shopkeeper details:", err);
        setError("Error loading shopkeeper profile.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchShopkeeperData();
    }
  }, [id]);

  const handlePrintLedger = () => {
    window.print();
  };

  // --- Calculations ---
  const totalSales = salesHistory.length;

  // Total Purchases (Prefer shopkeeper.totalPurchases if defined)
  const grandTotalBill =
    shopkeeper?.totalPurchases !== undefined && shopkeeper?.totalPurchases !== null
      ? Number(shopkeeper.totalPurchases)
      : salesHistory.reduce(
          (acc, item) => acc + (Number(item.totalAmount) || Number(item.grandTotal) || 0),
          0
        );

  // Exact Remaining Balance (Directly reads totalCredit: 11450 from database)
  const currentRemainingBalance = (() => {
    if (!shopkeeper) return 0;

    const fields = [
      "totalCredit",
      "totalOutstanding",
      "outstandingBalance",
      "creditBalance",
      "remainingBalance",
      "currentBalance",
      "balance",
    ];

    for (const f of fields) {
      if (
        shopkeeper[f] !== undefined &&
        shopkeeper[f] !== null &&
        !isNaN(Number(shopkeeper[f]))
      ) {
        return Number(shopkeeper[f]);
      }
    }

    return 0;
  })();

  // Total Paid = Total Purchases - Remaining Balance (361,950 - 11,450 = 350,500)
  const totalPaid = Math.max(0, grandTotalBill - currentRemainingBalance);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 font-medium text-sm">Loading Shopkeeper Details...</p>
      </div>
    );
  }

  if (error || !shopkeeper) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center space-y-4">
        <div className="p-4 bg-red-50 text-red-700 rounded-lg inline-block border border-red-200">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
          <p className="font-semibold">{error || "Shopkeeper not found."}</p>
        </div>
        <div>
          <button
            onClick={() => router.push("/shopkeepers")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Shopkeepers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Printable Hidden Ledger Receipt */}
      <LedgerReceipt
        ref={ledgerPrintRef}
        shopkeeper={shopkeeper}
        history={salesHistory}
        totalBill={grandTotalBill}
        totalPaid={totalPaid}
        balance={currentRemainingBalance}
      />

      {/* Screen View Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/shopkeepers")}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Store className="w-6 h-6 text-blue-600" />
              {shopkeeper.name || shopkeeper.shopName || "Shopkeeper Details"}
            </h1>
            <p className="text-xs text-gray-500">
              Manage transactions, check current remaining balance, and print yearly statements.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={handlePrintLedger}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Print Yearly Ledger
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
        {/* Shop & Contact Card */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-medium uppercase tracking-wider">Shop Details</span>
            <Building className="w-4 h-4 text-blue-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">{shopkeeper.shopName || "N/A"}</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              {shopkeeper.phone || "No phone provided"}
            </p>
            <p className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              {shopkeeper.address || "Charsadda"}
            </p>
          </div>
        </div>

        {/* Total Invoices Card */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-medium uppercase tracking-wider">Total Sales</span>
            <Receipt className="w-4 h-4 text-purple-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{totalSales}</h3>
          <p className="text-xs text-gray-500">Invoices generated to date</p>
        </div>

        {/* Total Billing Card */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-medium uppercase tracking-wider">Total Purchases</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            Rs. {grandTotalBill.toLocaleString()}
          </h3>
          <p className="text-xs text-emerald-600 font-medium">
            Paid: Rs. {totalPaid.toLocaleString()}
          </p>
        </div>

        {/* Remaining Balance Card */}
        <div
          className={`bg-white p-5 rounded-xl border shadow-sm space-y-2 ${
            currentRemainingBalance > 0 ? "border-amber-300 bg-amber-50/30" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-medium uppercase tracking-wider">Remaining Balance</span>
            <CreditCard
              className={`w-4 h-4 ${
                currentRemainingBalance > 0 ? "text-amber-600" : "text-gray-400"
              }`}
            />
          </div>
          <h3
            className={`text-2xl font-bold ${
              currentRemainingBalance > 0 ? "text-amber-700" : "text-gray-900"
            }`}
          >
            Rs. {currentRemainingBalance.toLocaleString()}
          </h3>
          <p className="text-xs text-gray-500">
            {currentRemainingBalance > 0 ? "Remaining dues payable" : "All dues settled"}
          </p>
        </div>
      </div>

      {/* Recent Sales Section (Formatted as Table) */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden print:hidden">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Recent Sales & Transaction History
            </h2>
            <p className="text-xs text-gray-500">
              Detailed list of invoices and payment statuses for this shopkeeper.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-gray-200 text-gray-700 rounded-full">
            {salesHistory.length} Invoices
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-gray-100 text-gray-700 uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="px-4 py-3"># Invoice</th>
                <th className="px-4 py-3">Date & Time</th>
                {/* NEW COLUMN ON SCREEN */}
                <th className="px-4 py-3 text-left">Purchased Products</th>
                <th className="px-4 py-3 text-center">Items</th>
                <th className="px-4 py-3 text-right">Total Bill</th>
                <th className="px-4 py-3 text-right">Paid Amount</th>
                <th className="px-4 py-3 text-right">Remaining Balance</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {salesHistory.length === 0 ? (
                <tr>
                  {/* UPDATE COLSPAN FROM 8 TO 9 */}
                  <td colSpan="9" className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Receipt className="w-8 h-8 text-gray-300" />
                      <p className="text-sm font-medium">
                        No sales recorded yet for this shopkeeper.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                salesHistory.map((invoice, index) => {
                  const billTotal = Number(invoice.totalAmount || invoice.grandTotal || 0);
                  const billPaid = Number(invoice.paidAmount || invoice.paid || 0);

                  const isPaid =
                    invoice.status === "PAID" || invoice.isPaid || invoice.paymentStatus === "PAID";

                  const billDue = isPaid
                    ? 0
                    : invoice.dueAmount !== undefined && invoice.dueAmount !== null
                    ? Number(invoice.dueAmount)
                    : invoice.remainingAmount !== undefined && invoice.remainingAmount !== null
                    ? Number(invoice.remainingAmount)
                    : invoice.balance !== undefined && invoice.balance !== null
                    ? Number(invoice.balance)
                    : Math.max(0, billTotal - billPaid);

                  const isPartial = billPaid > 0 && billDue > 0;

                  const formattedDate =
                    invoice.createdAt || invoice.date
                      ? new Date(invoice.createdAt || invoice.date).toLocaleString("en-PK", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "-";

                  const itemCount = Array.isArray(invoice.items) ? invoice.items.length : 0;

                  // EXTRACT PRODUCT NAMES FOR SCREEN TABLE
                  const productsString = Array.isArray(invoice.items) && invoice.items.length > 0
                    ? invoice.items.map(i => {
                        const pName = i.name || i.product?.name || i.productId?.name || "Product";
                        const qty = i.qty || i.quantity || 1;
                        return `${pName} (${qty}x)`;
                      }).join(", ")
                    : "General Invoice";

                  return (
                    <tr
                      key={invoice._id || invoice.id || index}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 font-mono font-bold text-gray-900">
                        {invoice.invoiceNo ||
                          invoice.invoiceNumber ||
                          invoice._id?.substring(0, 8) ||
                          `#${index + 1}`}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {formattedDate}
                      </td>
                      {/* NEW COLUMN DATA ON SCREEN */}
                      <td className="px-4 py-3 text-gray-800 font-medium text-[11px] max-w-[200px] truncate" title={productsString}>
                        {productsString}
                      </td>
                      <td className="px-4 py-3 text-center font-medium">
                        <span className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[11px]">
                          {itemCount} {itemCount === 1 ? "Item" : "Items"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900 whitespace-nowrap">
                        Rs. {billTotal.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-emerald-600 font-semibold whitespace-nowrap">
                        Rs. {billPaid.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-amber-600 font-semibold whitespace-nowrap">
                        Rs. {billDue.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        {isPaid || billDue <= 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                            <CheckCircle className="w-3 h-3" /> Paid
                          </span>
                        ) : isPartial ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3" /> Partial
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-800">
                            <AlertCircle className="w-3 h-3" /> Unpaid
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <Link
                          href={`/sales/${invoice._id || invoice.id}`}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-xs hover:underline"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}