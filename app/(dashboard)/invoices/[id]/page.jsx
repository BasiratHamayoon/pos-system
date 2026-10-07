"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { fetchInvoiceById } from "@/store/actions/invoiceActions";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function InvoiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useSelector((state) => state.auth);

  const [invoice, setInvoice] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        const data = await fetchInvoiceById(params.id);
        setInvoice(data);
      } catch (err) {
        console.error(err);
      } finally {
        setFetchLoading(false);
      }
    };
    loadInvoice();
  }, [params.id]);

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-full py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 py-16">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
          <AlertCircle className="h-7 w-7 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold">Invoice Not Found</h2>
        <p className="text-xs text-muted-foreground">This invoice record does not exist.</p>
        <Button variant="outline" onClick={() => router.push("/invoices")} className="mt-2 rounded-xl">
          Return to Invoices
        </Button>
      </div>
    );
  }

  const dateObj = new Date(invoice.date || invoice.createdAt);
  const formattedDate = `${dateObj.getDate().toString().padStart(2, "0")}/${(dateObj.getMonth() + 1).toString().padStart(2, "0")}/${dateObj.getFullYear()}`;
  const formattedTime = `${dateObj.getHours().toString().padStart(2, "0")}:${dateObj.getMinutes().toString().padStart(2, "0")}:${dateObj.getSeconds().toString().padStart(2, "0")}`;

  return (
    <div className="flex flex-col h-full min-h-0">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 mb-4 print:hidden">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => router.push("/invoices")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Invoice #{invoice.invoiceNo}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">View and print invoice details</p>
          </div>
        </div>
        <Button onClick={() => window.print()} className="gap-2 h-10 px-6 rounded-xl shadow-lg shadow-primary/20 font-bold">
          <Printer className="h-4 w-4" /> Print Invoice
        </Button>
      </motion.div>

      <div className="flex-1 overflow-y-auto sidebar-scroll pb-10 flex justify-center print:p-0 print:overflow-visible print:block">
        <div
          className="bg-white w-full max-w-[850px] shadow-sm rounded-xl text-black flex flex-col p-6 sm:p-10 border print:border-none print:shadow-none print:w-full print:max-w-none print:m-0 print:p-0"
          style={{ fontFamily: '"Courier New", Courier, monospace', fontSize: "12px" }}
        >
          <div className="mb-6">
            <h1 className="text-[18px] sm:text-[20px] font-bold tracking-tight mb-1">
              {user?.storeName || user?.name || "StorePOS"}
            </h1>
            <p className="font-bold">{user?.storeAddress || ""}</p>
            <p className="font-bold">PH- {user?.storePhone || ""}</p>
          </div>

          <div className="flex justify-center mb-4">
            <div className="border-2 border-black px-6 py-1 font-bold tracking-[0.3em] text-base">INVOICE</div>
          </div>

          <div className="flex justify-end text-[11px] sm:text-[12px] mb-2 font-bold">
            <span>Page. No : <span className="ml-8">1</span></span>
          </div>

          <div className="flex flex-col sm:flex-row gap-0 mb-4 w-full border-2 border-black rounded-sm">
            <div className="w-full sm:w-[60%] border-b-2 sm:border-b-0 sm:border-r-2 border-black flex flex-col">
              {[
                { label: "INVOICE NO", value: invoice.invoiceNo },
                { label: "PARTY CODE", value: invoice.shopkeeper ? String(invoice.shopkeeper).slice(-4) : "CASH" },
                { label: "PARTY NAME", value: invoice.shopName || invoice.shopkeeperName },
                { label: "ADDRESS", value: invoice.address || "Walk-in" },
                { label: "CONTACT #", value: invoice.phone || "" },
                { label: "CNIC #", value: "" },
                { label: "NTN/STRN #", value: "", noBorder: true },
              ].map((row, i) => (
                <div key={i} className={cn("flex w-full px-2 py-1.5 text-[11px]", !row.noBorder && "border-b border-black")}>
                  <div className="w-28 font-bold shrink-0">{row.label}</div>
                  <div className="w-full truncate pl-2">{row.value}</div>
                </div>
              ))}
            </div>

            <div className="w-full sm:w-[40%] flex flex-col">
              {[
                { label: "DATE", value: formattedDate },
                { label: "S/MAN.CODE", value: "1" },
                { label: "NAME", value: "Admin" },
                { label: "TIME", value: formattedTime, noBorder: true },
              ].map((row, i) => (
                <div key={i} className={cn("flex w-full px-2 py-1.5 text-[11px]", !row.noBorder && "border-b border-black")}>
                  <div className="w-24 font-bold shrink-0">{row.label}</div>
                  <div className="w-full truncate pl-2">{row.value}</div>
                </div>
              ))}
            </div>
          </div>

          <table className="w-full border-collapse border-2 border-black text-center mb-2 text-[11px]">
            <thead>
              <tr className="border-b-2 border-black bg-white">
                <th className="border-r border-black font-bold p-2 w-14">CODE</th>
                <th className="border-r border-black font-bold p-2 text-left pl-2">PARTICULAR</th>
                <th className="border-r border-black font-bold p-2 w-16">BATCH</th>
                <th className="border-r border-black font-bold p-2 w-24">RATE</th>
                <th className="border-r border-black font-bold p-2 w-14">QTY</th>
                <th className="border-r border-black font-bold p-2 w-14">BONUS</th>
                <th className="border-r border-black font-bold p-2 w-14">DISC</th>
                <th className="border-r border-black font-bold p-2 w-24 leading-tight">Trade Offer</th>
                <th className="font-bold p-2 w-28 text-right pr-3">NET TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items && invoice.items.length > 0 ? invoice.items.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-300 last:border-b-0">
                  <td className="border-r border-black p-2">{item.code || String(item.productId || "").slice(-3) || `31${idx}`}</td>
                  <td className="border-r border-black p-2 text-left pl-2 font-bold whitespace-nowrap overflow-hidden text-ellipsis max-w-[250px]">
                    {item.name}
                    {item.unit && item.unit !== 'pcs' && ` (${item.unitValue}${item.unit})`}
                  </td>
                  <td className="border-r border-black p-2">***.***</td>
                  <td className="border-r border-black p-2 text-right pr-2">{Number(item.price).toFixed(3)}</td>
                  <td className="border-r border-black p-2 font-bold">{item.qty}</td>
                  <td className="border-r border-black p-2"></td>
                  <td className="border-r border-black p-2"></td>
                  <td className="border-r border-black p-2"></td>
                  <td className="p-2 text-right pr-3 font-bold">{(Number(item.qty) * Number(item.price)).toFixed(2)}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={9} className="p-8 font-bold">No itemized details available.</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex border-2 border-black mb-4 divide-x-2 divide-black bg-white text-[11px]">
            <div className="flex w-[22%]">
              <div className="font-bold p-2 w-full flex items-center pl-2">GRAND TOTAL</div>
            </div>
            <div className="flex w-[15%]">
              <div className="p-2 w-full flex items-center justify-end font-bold pr-2 text-sm">
                {Number(invoice.subtotal).toFixed(2)}
              </div>
            </div>
            <div className="flex w-[18%]">
              <div className="font-bold p-2 w-full flex items-center justify-center tracking-wider">DISCOUNT</div>
            </div>
            <div className="flex w-[12%]">
              <div className="p-2 w-full flex items-center justify-end font-bold pr-2">
                {Number(invoice.discount || 0).toFixed(2)}
              </div>
            </div>
            <div className="flex w-[16%]">
              <div className="p-2 w-full flex items-center justify-between px-2">
                <span className="font-bold text-[10px]">SALE TAX</span>
                <span className="font-bold">0.00</span>
              </div>
            </div>
            <div className="flex w-[17%]">
              <div className="p-2 w-full flex items-center justify-between bg-gray-50 border-b-2 border-black px-2">
                <span className="font-bold text-[10px]">NET TOTAL</span>
                <span className="font-bold text-sm">{Number(invoice.totalAmount).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-start mt-2 text-[11px]">
            <div className="border-2 border-black rounded-full px-6 py-1.5 flex gap-16 items-center bg-white">
              <span className="font-bold">Total Item.</span>
              <span className="font-bold">{invoice.items?.length || 0}</span>
            </div>
            <div className="flex flex-col items-end border-b-2 border-black pb-1.5 min-w-[250px]">
              <div className="flex justify-between w-full font-bold px-3">
                <span className="text-sm">Net Amount</span>
                <span className="text-sm">{Number(invoice.totalAmount).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-start mt-4">
             <div className="border border-black p-2 min-w-[200px] text-[11px]">
                <div className="flex justify-between font-bold mb-1">
                  <span>Paid:</span>
                  <span className="text-emerald-700">{Number(invoice.paidAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Credit/Khata:</span>
                  <span className="text-orange-700">{Number(invoice.creditAmount).toFixed(2)}</span>
                </div>
             </div>
          </div>

          <div className="mt-8 text-right pr-2">
            <span className="font-bold text-sm" dir="rtl" style={{ fontFamily: "Arial, sans-serif" }}>
              نوٹ: ایکسپائری کی اطلاع 4 ماہ قبل بل یا بل نمبر کیساتھ دیں
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}