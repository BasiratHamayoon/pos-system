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
  Factory,
  FileText,
  Truck
} from "lucide-react";
import api from "@/lib/api";

// --- Printable Supplier Ledger Receipt Component ---
const SupplierLedgerReceipt = React.forwardRef(({ supplier, history, totalBill, totalPaid, balance }, ref) => {
  const purchaseList = Array.isArray(history) ? history : [];

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
            Wholesale & Retail Merchant | Supplier Ledger Statement
          </p>
          <p className="text-[11px] text-gray-600">
            Nowshera Road Near Tabeleghi Markaz Charsadda
          </p>
          <p className="text-[11px] font-bold text-black">
            PH: 03189172417, 03429277709, 03139618834
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold uppercase tracking-wider text-black">SUPPLIER LEDGER</p>
          <p className="text-xs">
            <span className="font-semibold">Date:</span> {currentDate}
          </p>
          <p className="text-xs">
            <span className="font-semibold">Time:</span> {currentTime}
          </p>
        </div>
      </div>

      {/* Supplier Info Box */}
      <div className="border border-black p-3 mb-4 rounded-none bg-gray-50/50">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p>
              <strong className="font-bold">Supplier / Company:</strong>{" "}
              {supplier?.companyName || "N/A"}
            </p>
            <p>
              <strong className="font-bold">Representative:</strong> {supplier?.name || "N/A"}
            </p>
            <p>
              <strong className="font-bold">Address:</strong> {supplier?.address || "N/A"}
            </p>
          </div>
          <div className="text-right">
            <p>
              <strong className="font-bold">Contact #:</strong> {supplier?.phone || "N/A"}
            </p>
            <p>
              <strong className="font-bold">Ledger Period:</strong> All Time Statement
            </p>
            <p>
              <strong className="font-bold">Total Purchases:</strong> {purchaseList.length}
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
            <th className="border border-black p-2 w-24">PO #</th>
            <th className="border border-black p-2 text-left pl-2">Purchased Products</th>
            <th className="border border-black p-2">Total Amount</th>
            <th className="border border-black p-2">Paid Amount</th>
            <th className="border border-black p-2">Payable / Due</th>
            <th className="border border-black p-2 w-20">Status</th>
          </tr>
        </thead>
        <tbody>
          {purchaseList.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center p-4 border border-black text-gray-500 italic">
                No purchases recorded from this supplier.
              </td>
            </tr>
          ) : (
            purchaseList.map((po, index) => {
              const poTotal = Number(po.totalAmount || 0);
              const poPaid = Number(po.paidAmount || 0);
              const poDue = Number(po.dueAmount || Math.max(0, poTotal - poPaid));

              const status = poDue <= 0 ? "PAID" : poPaid > 0 ? "PARTIAL" : "UNPAID";
              const dateStr = po.createdAt
                ? new Date(po.createdAt).toLocaleDateString("en-GB")
                : "-";

              // EXTRACT PRODUCT NAMES
              const productsString = Array.isArray(po.items) && po.items.length > 0
                ? po.items.map(i => `${i.name} (${i.qty}x)`).join(", ")
                : "General Purchase";

              return (
                <tr key={po._id || index} className="border-b border-black text-center">
                  <td className="border border-black p-1.5 font-mono">{index + 1}</td>
                  <td className="border border-black p-1.5">{dateStr}</td>
                  <td className="border border-black p-1.5 font-semibold font-mono">
                    {po.poNumber || po._id?.substring(0, 8) || `-`}
                  </td>
                  <td className="border border-black p-1.5 text-left text-[10px] pl-2 font-medium max-w-[200px] truncate">
                    {productsString}
                  </td>
                  <td className="border border-black p-1.5 text-right pr-3">
                    Rs. {poTotal.toLocaleString()}
                  </td>
                  <td className="border border-black p-1.5 text-right pr-3">
                    Rs. {poPaid.toLocaleString()}
                  </td>
                  <td className="border border-black p-1.5 text-right pr-3 font-semibold">
                    Rs. {poDue.toLocaleString()}
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
            <span className="font-bold">Total Record Count:</span> {purchaseList.length} POs
          </p>
          <p>
            <span className="font-bold">Printed On:</span> {currentDate} {currentTime}
          </p>
        </div>
        <div className="w-64 space-y-1 text-xs">
          <div className="flex justify-between py-0.5">
            <span className="font-bold">Total Stock Bought:</span>
            <span className="font-mono">Rs. {Number(totalBill).toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="font-bold">Total Paid to Supplier:</span>
            <span className="font-mono">Rs. {Number(totalPaid).toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1 border-t border-black font-bold text-sm">
            <span>Net Payable Balance:</span>
            <span className="font-mono">Rs. {Number(balance).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Signatures */}
      <div className="mt-8 border-t border-dashed border-gray-400 pt-4">
        <div className="flex justify-between items-end pt-8">
          <div className="text-center w-40 border-t border-black pt-1">
            <p className="font-bold text-xs">Supplier Signature</p>
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

SupplierLedgerReceipt.displayName = "SupplierLedgerReceipt";

// --- Main Supplier Detail Page Component ---
export default function SupplierDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [supplier, setSupplier] = useState(null);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const initializedRef = useRef(false);
  const ledgerPrintRef = useRef(null);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const fetchSupplierData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 1. Fetch supplier profile
        const supRes = await api.get(`/suppliers/${id}`);
        const supData = supRes.data?.data || supRes.data || supRes;
        setSupplier(supData);

        // 2. Fetch all purchases and filter by this supplier
        try {
          const purRes = await api.get(`/purchases`);
          const rawPurchases = purRes.data?.purchases || purRes.data?.data || purRes.data || [];

          if (Array.isArray(rawPurchases)) {
            const filtered = rawPurchases.filter((p) => {
              const pSupId = p.supplier?._id || p.supplier || p.supplierId;
              return String(pSupId) === String(id);
            });
            setPurchaseHistory(filtered);
          }
        } catch (purErr) {
          console.warn("Could not fetch purchases list:", purErr);
          setPurchaseHistory([]);
        }
      } catch (err) {
        console.error("Error fetching supplier details:", err);
        setError("Error loading supplier profile.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchSupplierData();
    }
  }, [id]);

  const handlePrintLedger = () => {
    window.print();
  };

  // --- Calculations ---
  const totalPOs = purchaseHistory.length;

  // Total Purchased (Prefer supplier.totalPurchased if defined)
  const grandTotalPurchased =
    supplier?.totalPurchased !== undefined && supplier?.totalPurchased !== null
      ? Number(supplier.totalPurchased)
      : purchaseHistory.reduce((acc, item) => acc + (Number(item.totalAmount) || 0), 0);

  // Exact Payable Balance (Directly reads totalPayable from database)
  const currentPayableBalance =
    supplier?.totalPayable !== undefined && supplier?.totalPayable !== null
      ? Number(supplier.totalPayable)
      : purchaseHistory.reduce((acc, item) => acc + (Number(item.dueAmount) || 0), 0);

  // Total Paid = Total Purchased - Payable Balance
  const totalPaid = Math.max(0, grandTotalPurchased - currentPayableBalance);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 font-medium text-sm">Loading Supplier Details...</p>
      </div>
    );
  }

  if (error || !supplier) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center space-y-4">
        <div className="p-4 bg-red-50 text-red-700 rounded-lg inline-block border border-red-200">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
          <p className="font-semibold">{error || "Supplier not found."}</p>
        </div>
        <div>
          <button
            onClick={() => router.push("/suppliers")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Suppliers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Printable Hidden Ledger Receipt */}
      <SupplierLedgerReceipt
        ref={ledgerPrintRef}
        supplier={supplier}
        history={purchaseHistory}
        totalBill={grandTotalPurchased}
        totalPaid={totalPaid}
        balance={currentPayableBalance}
      />

      {/* Screen View Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/suppliers")}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Factory className="w-6 h-6 text-blue-600" />
              {supplier.companyName || "Supplier Details"}
            </h1>
            <p className="text-xs text-gray-500">
              Manage purchase orders, check payable balances, and print supplier statements.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={handlePrintLedger}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Print Supplier Ledger
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
        {/* Supplier & Contact Card */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-medium uppercase tracking-wider">Supplier Details</span>
            <Building className="w-4 h-4 text-blue-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 truncate">{supplier.name || "N/A"}</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              {supplier.phone || "No phone provided"}
            </p>
            <p className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              {supplier.address || "No address"}
            </p>
          </div>
        </div>

        {/* Total POs Card */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-medium uppercase tracking-wider">Total POs</span>
            <Receipt className="w-4 h-4 text-purple-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{totalPOs}</h3>
          <p className="text-xs text-gray-500">Purchase Orders to date</p>
        </div>

        {/* Total Purchased Card */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-medium uppercase tracking-wider">Total Stock Bought</span>
            <Truck className="w-4 h-4 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            Rs. {grandTotalPurchased.toLocaleString()}
          </h3>
          <p className="text-xs text-emerald-600 font-medium">
            Paid: Rs. {totalPaid.toLocaleString()}
          </p>
        </div>

        {/* Payable Balance Card */}
        <div
          className={`bg-white p-5 rounded-xl border shadow-sm space-y-2 ${
            currentPayableBalance > 0 ? "border-red-300 bg-red-50/30" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-medium uppercase tracking-wider">Payable Balance</span>
            <CreditCard
              className={`w-4 h-4 ${
                currentPayableBalance > 0 ? "text-red-600" : "text-gray-400"
              }`}
            />
          </div>
          <h3
            className={`text-2xl font-bold ${
              currentPayableBalance > 0 ? "text-red-700" : "text-gray-900"
            }`}
          >
            Rs. {currentPayableBalance.toLocaleString()}
          </h3>
          <p className="text-xs text-gray-500">
            {currentPayableBalance > 0 ? "Amount owed to supplier" : "All dues settled"}
          </p>
        </div>
      </div>

      {/* Recent Purchases Section (Formatted as Table) */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden print:hidden">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Purchase History & Stock Details
            </h2>
            <p className="text-xs text-gray-500">
              Detailed list of purchase orders and payment statuses for this supplier.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-gray-200 text-gray-700 rounded-full">
            {purchaseHistory.length} POs
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-gray-100 text-gray-700 uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">PO Number</th>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3 text-left">Purchased Products</th>
                <th className="px-4 py-3 text-center">Items</th>
                <th className="px-4 py-3 text-right">Total Bill</th>
                <th className="px-4 py-3 text-right">Paid Amount</th>
                <th className="px-4 py-3 text-right">Payable Balance</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {purchaseHistory.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Receipt className="w-8 h-8 text-gray-300" />
                      <p className="text-sm font-medium">
                        No purchases recorded yet from this supplier.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                purchaseHistory.map((po, index) => {
                  const poTotal = Number(po.totalAmount || 0);
                  const poPaid = Number(po.paidAmount || 0);
                  const poDue = Number(po.dueAmount || Math.max(0, poTotal - poPaid));

                  const isPartial = poPaid > 0 && poDue > 0;

                  const formattedDate = po.createdAt
                    ? new Date(po.createdAt).toLocaleString("en-PK", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "-";

                  const itemCount = Array.isArray(po.items) ? po.items.length : 0;

                  // EXTRACT PRODUCT NAMES FOR SCREEN TABLE
                  const productsString = Array.isArray(po.items) && po.items.length > 0
                    ? po.items.map(i => `${i.name} (${i.qty}x)`).join(", ")
                    : "General Purchase";

                  return (
                    <tr
                      key={po._id || index}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 font-mono font-bold text-gray-900">
                        {po.poNumber || po._id?.substring(0, 8) || `#PO-${index + 1}`}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {formattedDate}
                      </td>
                      <td className="px-4 py-3 text-gray-800 font-medium text-[11px] max-w-[200px] truncate" title={productsString}>
                        {productsString}
                      </td>
                      <td className="px-4 py-3 text-center font-medium">
                        <span className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[11px]">
                          {itemCount} {itemCount === 1 ? "Item" : "Items"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900 whitespace-nowrap">
                        Rs. {poTotal.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-emerald-600 font-semibold whitespace-nowrap">
                        Rs. {poPaid.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-red-600 font-semibold whitespace-nowrap">
                        Rs. {poDue.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        {poDue <= 0 ? (
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
                          href={`/purchases/${po._id}`}
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