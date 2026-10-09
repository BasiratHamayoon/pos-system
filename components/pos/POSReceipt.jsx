"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Printer, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function POSReceipt({ open, onOpenChange, invoice, storeInfo, onPrint, onNewSale }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || !invoice) return null;

  const dateObj = new Date(invoice.createdAt || invoice.date || Date.now());
  const formattedDate = `${dateObj.getDate().toString().padStart(2, "0")}/${(dateObj.getMonth() + 1).toString().padStart(2, "0")}/${dateObj.getFullYear()}`;
  const formattedTime = `${dateObj.getHours().toString().padStart(2, "0")}:${dateObj.getMinutes().toString().padStart(2, "0")}:${dateObj.getSeconds().toString().padStart(2, "0")}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-[780px] p-0 rounded-xl bg-[#e8e8e8] overflow-hidden flex flex-col border-0 shadow-2xl print:border-0 print:shadow-none print:bg-white">
        <div className="flex items-center justify-between p-2.5 bg-background border-b shrink-0 print:hidden z-10 shadow-sm">
          <h2 className="text-sm font-bold">Invoice Preview</h2>
          <button onClick={() => onOpenChange(false)} className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 flex justify-center bg-muted/30 print:p-0 print:bg-white print:overflow-visible print:block">
          
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

        {/* Modal Footer Controls */}
        <div className="p-3 bg-background border-t flex gap-3 shrink-0 print:hidden z-20">
          <Button onClick={onPrint} className="flex-1 h-10 text-xs font-bold rounded-xl gap-2 shadow-md shadow-primary/20">
            <Printer className="h-4 w-4" /> Print Receipt
          </Button>
          <Button variant="outline" onClick={onNewSale} className="flex-1 h-10 text-xs font-bold rounded-xl gap-2">
            <Plus className="h-4 w-4" /> New Transaction
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}