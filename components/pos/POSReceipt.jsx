"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Printer, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function POSReceipt({
  open,
  onOpenChange,
  invoice,
  storeInfo,
  onPrint,
  onNewSale,
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || !invoice) return null;

  const dateObj = new Date(invoice.date);
  const formattedDate = `${dateObj.getDate().toString().padStart(2, "0")}/${(
    dateObj.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${dateObj.getFullYear()}`;
  const formattedTime = `${dateObj.getHours().toString().padStart(2, "0")}:${dateObj
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${dateObj.getSeconds().toString().padStart(2, "0")}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-[850px] p-0 rounded-xl bg-[#e8e8e8] overflow-hidden flex flex-col border-0 print:m-0 print:p-0 print:h-auto print:w-full print:max-w-none">
        <div className="flex items-center justify-between p-3 bg-background border-b shrink-0 print:hidden z-10 shadow-sm">
          <h2 className="text-sm font-bold">Invoice Preview</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center print:p-0 print:bg-white print:overflow-visible">
          <div
            className="bg-white w-full max-w-[800px] shadow-2xl print:shadow-none text-black print:w-full print:max-w-none flex flex-col p-4 sm:p-6"
            style={{ fontFamily: '"Courier New", Courier, monospace', fontSize: "11px" }}
          >
            <div className="mb-4">
              <h1 className="text-[16px] sm:text-[18px] font-bold tracking-tight mb-1">
                {storeInfo?.name || "StorePOS"}
              </h1>
              <p className="font-bold">{storeInfo?.address || ""}</p>
              <p className="font-bold">PH- {storeInfo?.phone || ""}</p>
            </div>

            <div className="flex justify-center mb-3">
              <div className="border border-black px-6 py-1 font-bold tracking-[0.3em] text-sm">
                INVOICE
              </div>
            </div>

            <div className="flex justify-end text-[10px] sm:text-[11px] mb-1 font-bold">
              <span>
                Page. No : <span className="ml-8">1</span>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-0 mb-2 w-full border border-black rounded-sm">
              <div className="w-full sm:w-[60%] border-b sm:border-b-0 sm:border-r border-black flex flex-col">
                {[
                  { label: "INVOICE NO", value: invoice.invoiceNo },
                  { label: "PARTY CODE", value: invoice.partyCode },
                  { label: "PARTY NAME", value: invoice.shopName },
                  { label: "ADDRESS", value: invoice.address || "Walk-in" },
                  { label: "CONTACT #", value: invoice.phone },
                  { label: "CNIC #", value: "" },
                  { label: "NTN/STRN #", value: "", noBorder: true },
                ].map((row, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex w-full px-2 py-1",
                      !row.noBorder && "border-b border-black"
                    )}
                  >
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
                  <div
                    key={i}
                    className={cn(
                      "flex w-full px-2 py-1",
                      !row.noBorder && "border-b border-black"
                    )}
                  >
                    <div className="w-24 font-bold shrink-0">{row.label}</div>
                    <div className="w-full truncate pl-2">{row.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <table className="w-full border-collapse border border-black text-center mb-1">
              <thead>
                <tr className="border-b border-black bg-white">
                  <th className="border-r border-black font-bold p-1.5 w-14">CODE</th>
                  <th className="border-r border-black font-bold p-1.5 text-left pl-2">
                    PARTICULAR
                  </th>
                  <th className="border-r border-black font-bold p-1.5 w-16">BATCH</th>
                  <th className="border-r border-black font-bold p-1.5 w-20">RATE</th>
                  <th className="border-r border-black font-bold p-1.5 w-12">QTY</th>
                  <th className="border-r border-black font-bold p-1.5 w-12">BONUS</th>
                  <th className="border-r border-black font-bold p-1.5 w-12">DISC</th>
                  <th className="border-r border-black font-bold p-1.5 w-20 leading-tight">
                    Trade Offer
                  </th>
                  <th className="font-bold p-1.5 w-24 text-right pr-2">NET TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-300 last:border-b-0">
                    <td className="border-r border-black p-1.5">
                      {item.code || `31${idx}`}
                    </td>
                    <td className="border-r border-black p-1.5 text-left pl-2 font-bold whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                      {item.name}
                    </td>
                    <td className="border-r border-black p-1.5">***.***</td>
                    <td className="border-r border-black p-1.5 text-right pr-2">
                      {Number(item.price).toFixed(3)}
                    </td>
                    <td className="border-r border-black p-1.5 font-bold">{item.qty}</td>
                    <td className="border-r border-black p-1.5"></td>
                    <td className="border-r border-black p-1.5"></td>
                    <td className="border-r border-black p-1.5"></td>
                    <td className="p-1.5 text-right pr-2 font-bold">
                      {(Number(item.qty) * Number(item.price)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex border border-black mb-2 divide-x divide-black bg-white">
              <div className="flex w-[22%]">
                <div className="font-bold p-1.5 w-full flex items-center pl-2">
                  GRAND TOTAL
                </div>
              </div>
              <div className="flex w-[15%]">
                <div className="p-1.5 w-full flex items-center justify-end font-bold pr-2 text-sm">
                  {Number(invoice.subtotal).toFixed(2)}
                </div>
              </div>
              <div className="flex w-[18%]">
                <div className="font-bold p-1.5 w-full flex items-center justify-center tracking-wider">
                  DISCOUNT
                </div>
              </div>
              <div className="flex w-[12%]">
                <div className="p-1.5 w-full flex items-center justify-end font-bold pr-2">
                  {Number(invoice.discount || 0).toFixed(2)}
                </div>
              </div>
              <div className="flex w-[16%]">
                <div className="p-1.5 w-full flex items-center justify-between px-2">
                  <span className="font-bold text-[10px]">SALE TAX</span>
                  <span className="font-bold">0.00</span>
                </div>
              </div>
              <div className="flex w-[17%]">
                <div className="p-1.5 w-full flex items-center justify-between border-b-2 border-black px-2 bg-gray-50">
                  <span className="font-bold text-[10px]">NET TOTAL</span>
                  <span className="font-bold text-sm">
                    {Number(invoice.totalAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-start mt-2">
              <div className="border border-black rounded-full px-5 py-1 flex gap-16 items-center bg-white shadow-sm">
                <span className="font-bold text-[11px]">Total Item.</span>
                <span className="font-bold text-[11px]">{invoice.items.length}</span>
              </div>
              <div className="flex flex-col items-end border-b-2 border-black pb-1 min-w-[220px]">
                <div className="flex justify-between w-full font-bold px-2">
                  <span className="text-sm">Net Amount</span>
                  <span className="text-sm">{Number(invoice.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 text-right pr-2">
              <span
                className="font-bold text-sm"
                dir="rtl"
                style={{ fontFamily: "Arial, sans-serif" }}
              >
                نوٹ: ایکسپائری کی اطلاع 4 ماہ قبل بل یا بل نمبر کیساتھ دیں
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-background border-t flex gap-3 shrink-0 print:hidden z-20">
          <Button
            onClick={onPrint}
            className="flex-1 h-12 text-sm font-bold rounded-xl gap-2 shadow-lg shadow-primary/20"
          >
            <Printer className="h-4 w-4" />
            Print Landscape
          </Button>
          <Button
            variant="outline"
            onClick={onNewSale}
            className="flex-1 h-12 text-sm font-bold rounded-xl gap-2"
          >
            <Plus className="h-4 w-4" />
            New Transaction
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}