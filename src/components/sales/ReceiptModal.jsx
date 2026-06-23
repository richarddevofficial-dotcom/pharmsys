"use client";

import { Button } from "@/components/ui/button";
import { Printer, X } from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export function ReceiptModal({ sale, onClose }) {
  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 no-print">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header - Hidden when printing */}
        <div className="p-4 border-b flex items-center justify-between no-print">
          <h2 className="text-lg font-bold">Receipt Preview</h2>
          <div className="flex gap-2 no-print">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="no-print"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="no-print"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Receipt Content - This gets printed */}
        <div className="p-4 receipt-content">
          {/* Store Header */}
          <div className="text-center border-b border-dashed pb-3 mb-3">
            <h3 className="font-bold text-base">PHARMASYS PHARMACY</h3>
            <p className="text-xs">123 Health Street, Medical District</p>
            <p className="text-xs">Tel: +1 234-567-8900</p>
            <p className="text-xs">Email: info@pharmasys.com</p>
          </div>

          {/* Sale Info */}
          <div className="text-xs space-y-1 mb-3">
            <div className="flex justify-between">
              <span>Invoice:</span>
              <span className="font-medium">#{String(sale.id).slice(-8)}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>
                {formatDateTime(sale.date || new Date().toISOString())}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Cashier:</span>
              <span>{sale.cashier || "Staff"}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment:</span>
              <span className="capitalize">{sale.paymentMethod || "Cash"}</span>
            </div>
          </div>

          {/* Items */}
          <div className="border-t border-b border-dashed py-2 mb-3">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="w-1/2">Item</span>
              <span className="w-1/6 text-center">Qty</span>
              <span className="w-1/6 text-right">Price</span>
              <span className="w-1/6 text-right">Total</span>
            </div>
            {sale.items?.map((item, index) => (
              <div key={index} className="flex justify-between text-xs py-1">
                <span className="w-1/2 truncate">{item.name}</span>
                <span className="w-1/6 text-center">{item.quantity}</span>
                <span className="w-1/6 text-right">
                  {formatCurrency(item.selling_price)}
                </span>
                <span className="w-1/6 text-right">
                  {formatCurrency(item.selling_price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="text-xs space-y-1 mb-3">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(sale.subtotal || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (5%):</span>
              <span>{formatCurrency(sale.tax || 0)}</span>
            </div>
            {sale.discount > 0 && (
              <div className="flex justify-between">
                <span>Discount ({sale.discountPercent || 0}%):</span>
                <span>-{formatCurrency(sale.discount)}</span>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="border-t border-dashed pt-2 mb-3">
            <div className="flex justify-between font-bold text-sm">
              <span>TOTAL:</span>
              <span>{formatCurrency(sale.total || 0)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs border-t border-dashed pt-3">
            <p className="font-medium">Thank You!</p>
            <p className="text-gray-500 mt-1">Visit us again</p>
            <p className="text-gray-400 mt-1">
              Keep medicines away from children
            </p>
            <p className="text-gray-300 mt-2">---</p>
          </div>
        </div>
      </div>
    </div>
  );
}
