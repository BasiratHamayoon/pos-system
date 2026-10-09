"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchInvoiceById } from "@/store/actions/invoiceActions";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function InvoiceDetailPage() {
  const router = useRouter();
  const params = useParams();

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
    <div className="flex flex-col h-full min-h-0 print:block print:h-auto print:bg-white">
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
        <Button onClick={() => window.print()} className="gap-2 h-10 px-6 rounded-xl shadow-md shadow-primary/20 font-bold">
          <Printer className="h-4 w-4" /> Print Invoice
        </Button>
      </motion.div>

      <div className="flex-1 overflow-y-auto sidebar-scroll pb-10 flex justify-center print:p-0 print:overflow-hidden print:block bg-transparent print:bg-white">
        
        {/* THE PRINTABLE CONTAINER - FIXED PAPER LAYOUT */}
        <div 
          className="printable-invoice-container bg-white w-full max-w-[740px] shadow-sm text-black flex flex-col p-4 border border-black/10 print:border-0" 
          style={{ fontFamily: "Arial, sans-serif", fontSize: "10px", lineHeight: "1.2" }}
        >
          {/* Header Top Row */}
          <div className="flex flex-row justify-between items-start mb-2 w-full">
            <div className="w-[50%]">
              <h1 className="text-[15px] font-bold tracking-tight mb-0.5 text-black">
                Three Star Traders Charsadda
              </h1>
              <p className="font-bold text-black text-[10px]">Peshawar Road Serdaryab Stop</p>
              <p className="font-bold text-black text-[10px]">PH- 0313-9296448, 0300-5003923</p>
            </div>
            <div className="w-[20%] text-center pt-1">
              <div className="border border-black px-3 py-0.5 font-bold tracking-[0.2em] text-[12px] text-black">
                INVOICE
              </div>
            </div>
            <div className="w-[30%] text-right text-[10px] font-bold text-black pt-4">
              <span>Page. No : <span className="ml-4">1</span></span>
            </div>
          </div>

          {/* Top Info Box - STRICT FLEX-ROW (58% Left / 42% Right) */}
          <div className="flex flex-row w-full border border-black rounded-sm mb-1.5 text-[9.5px]">
            
            {/* Left Customer Box */}
            <div className="w-[58%] border-r border-black flex flex-col">
              <div className="flex flex-row w-full px-1.5 py-[2px] border-b border-black">
                <div className="w-24 font-bold shrink-0 text-black">INVOICE NO</div>
                <div className="w-full text-black font-semibold">{invoice.invoiceNo}</div>
              </div>
              <div className="flex flex-row w-full px-1.5 py-[2px] border-b border-black">
                <div className="w-24 font-bold shrink-0 text-black">PARTY CODE</div>
                <div className="w-full text-black">{invoice.shopkeeper ? String(invoice.shopkeeper).slice(-4) : "CASH"}</div>
              </div>
              <div className="flex flex-row w-full px-1.5 py-[2px] border-b border-black">
                <div className="w-24 font-bold shrink-0 text-black">PARTY NAME</div>
                <div className="w-full truncate text-black font-semibold">{invoice.shopName || invoice.shopkeeperName}</div>
              </div>
              <div className="flex flex-row w-full px-1.5 py-[2px] border-b border-black">
                <div className="w-24 font-bold shrink-0 text-black">ADDRESS</div>
                <div className="w-full truncate text-black">{invoice.address || "Nowshehra Road"}</div>
              </div>
              <div className="flex flex-row w-full px-1.5 py-[2px] border-b border-black">
                <div className="w-24 font-bold shrink-0 text-black">CONTACT #</div>
                <div className="w-full text-black">{invoice.phone || ""}</div>
              </div>
              <div className="flex flex-row w-full px-1.5 py-[2px] border-b border-black">
                <div className="w-24 font-bold shrink-0 text-black">CNIC #</div>
                <div className="w-full text-black"></div>
              </div>
              <div className="flex flex-row w-full px-1.5 py-[2px]">
                <div className="w-24 font-bold shrink-0 text-black">NTN/STRN #</div>
                <div className="w-full text-black"></div>
              </div>
            </div>

            {/* Right Date & Time Box */}
            <div className="w-[42%] flex flex-col">
              <div className="flex flex-row w-full px-1.5 py-[2px] border-b border-black">
                <div className="w-20 font-bold shrink-0 text-black">DATE</div>
                <div className="w-full text-black font-semibold">{formattedDate}</div>
              </div>
              <div className="flex flex-row w-full px-1.5 py-[2px] border-b border-black">
                <div className="w-20 font-bold shrink-0 text-black">S/MAN.CODE</div>
                <div className="w-full text-black">2</div>
              </div>
              <div className="flex flex-row w-full px-1.5 py-[2px] border-b border-black">
                <div className="w-20 font-bold shrink-0 text-black">NAME</div>
                <div className="w-full truncate text-black font-semibold">Shahzeb</div>
              </div>
              <div className="flex flex-row w-full px-1.5 py-[2px]">
                <div className="w-20 font-bold shrink-0 text-black">TIME</div>
                <div className="w-full text-black">{formattedTime}</div>
              </div>
            </div>

          </div>

          {/* Items Table */}
          <table className="w-full border-collapse border border-black text-center mb-1 text-[9.5px]">
            <thead>
              <tr className="border-b border-black bg-white">
                <th className="border-r border-black font-bold p-1 w-10 text-black">CODE</th>
                <th className="border-r border-black font-bold p-1 text-left pl-1.5 text-black">PARTICULAR</th>
                <th className="border-r border-black font-bold p-1 w-12 text-black">BATCH</th>
                <th className="border-r border-black font-bold p-1 w-14 text-black">RATE</th>
                <th className="border-r border-black font-bold p-1 w-8 text-black">QTY</th>
                <th className="border-r border-black font-bold p-1 w-8 text-black">BONUS</th>
                <th className="border-r border-black font-bold p-1 w-8 text-black">DISC</th>
                <th className="border-r border-black font-bold p-1 w-14 leading-tight text-black text-[7.5px]">Trade Offer</th>
                <th className="font-bold p-1 w-16 text-right pr-1.5 text-black">NET TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items?.map((item, idx) => (
                <tr key={idx} className="border-b border-black/20 last:border-b-0">
                  <td className="border-r border-black p-0.5 text-black">{item.code || String(item.productId || "").slice(-3) || `31${idx}`}</td>
                  <td className="border-r border-black p-0.5 text-left pl-1.5 font-bold whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px] text-black">
                    {item.name} {item.variantLabel || ""}
                  </td>
                  <td className="border-r border-black p-0.5 text-black">***.***</td>
                  <td className="border-r border-black p-0.5 text-right pr-1 text-black">{Number(item.price).toFixed(3)}</td>
                  <td className="border-r border-black p-0.5 font-bold text-black">{item.qty}</td>
                  <td className="border-r border-black p-0.5 text-black"></td>
                  <td className="border-r border-black p-0.5 text-black"></td>
                  <td className="border-r border-black p-0.5 text-black"></td>
                  <td className="p-0.5 text-right pr-1.5 font-bold text-black">{(Number(item.qty) * Number(item.price)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Summary Row */}
          <div className="flex flex-row border border-black mb-1 divide-x divide-black bg-white text-[9.5px]">
            <div className="flex w-[20%]"><div className="font-bold p-0.5 w-full flex items-center pl-1.5 text-black">GRAND TOTAL</div></div>
            <div className="flex w-[15%]"><div className="p-0.5 w-full flex items-center justify-end font-bold pr-1 text-[10px] text-black">{Number(invoice.subtotal).toFixed(2)}</div></div>
            <div className="flex w-[15%]"><div className="font-bold p-0.5 w-full flex items-center justify-center tracking-wider text-black">DISCOUNT</div></div>
            <div className="flex w-[15%]"><div className="p-0.5 w-full flex items-center justify-end font-bold pr-1 text-black">{Number(invoice.discount || 0).toFixed(2)}</div></div>
            <div className="flex w-[15%]"><div className="p-0.5 w-full flex items-center justify-between px-1 text-black"><span className="font-bold text-[8.5px]">SALE TAX</span><span className="font-bold">0.00</span></div></div>
            <div className="flex w-[20%]"><div className="p-0.5 w-full flex items-center justify-between px-1 text-black"><span className="font-bold text-[8.5px]">NET TOTAL</span><span className="font-bold text-[10px]">{Number(invoice.totalAmount).toFixed(2)}</span></div></div>
          </div>

          {/* Net Amount & Total Items Row */}
          <div className="flex flex-row justify-between items-start mt-0.5 text-[9.5px]">
            <div className="border border-black rounded-full px-2.5 py-0.5 flex gap-6 items-center bg-white">
              <span className="font-bold text-black">Total Item.</span>
              <span className="font-bold text-black">{invoice.items?.length || 0}</span>
            </div>
            <div className="flex flex-col items-end border-b border-black pb-0.5 min-w-[160px]">
              <div className="flex justify-between w-full font-bold px-1 text-black">
                <span className="text-[10px]">Net Amount</span>
                <span className="text-[10px]">{Number(invoice.totalAmount).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Urdu Note */}
          <div className="mt-2 text-right pr-1">
            <span className="font-bold text-[10px] text-black" dir="rtl" style={{ fontFamily: "Arial, sans-serif" }}>
              نوٹ: ایکسپائری کی اطلاع 4 ماہ قبل بل یا بل نمبر کیساتھ دیں
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}