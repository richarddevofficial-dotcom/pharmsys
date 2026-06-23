"use client";

import { useEffect } from "react";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export function PrintableReceipt({ sale }) {
  useEffect(() => {
    if (sale) {
      // Auto-trigger print after a short delay
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [sale]);

  if (!sale) return null;

  return (
    <div
      className="p-4"
      style={{
        width: "80mm",
        fontFamily: "Courier New, monospace",
        fontSize: "10px",
      }}
    >
      {/* Store Header */}
      <div
        style={{
          textAlign: "center",
          borderBottom: "1px dashed #000",
          paddingBottom: "8px",
          marginBottom: "8px",
        }}
      >
        <h3
          style={{ fontSize: "12px", fontWeight: "bold", margin: "0 0 4px 0" }}
        >
          PHARMASYS PHARMACY
        </h3>
        <p style={{ margin: "2px 0", fontSize: "10px" }}>
          123 Health Street, Medical District
        </p>
        <p style={{ margin: "2px 0", fontSize: "10px" }}>
          Tel: +1 234-567-8900
        </p>
      </div>

      {/* Sale Info */}
      <div style={{ marginBottom: "8px", fontSize: "10px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "2px 0",
          }}
        >
          <span>Invoice: #{String(sale.id).slice(-8)}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "2px 0",
          }}
        >
          <span>
            Date: {formatDateTime(sale.date || new Date().toISOString())}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "2px 0",
          }}
        >
          <span>Cashier: {sale.cashier || "Staff"}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "2px 0",
          }}
        >
          <span>Payment: {sale.paymentMethod || "Cash"}</span>
        </div>
      </div>

      {/* Items */}
      <div
        style={{
          borderTop: "1px dashed #000",
          borderBottom: "1px dashed #000",
          padding: "8px 0",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
            fontSize: "10px",
            marginBottom: "4px",
          }}
        >
          <span style={{ width: "50%" }}>Item</span>
          <span style={{ width: "16%", textAlign: "center" }}>Qty</span>
          <span style={{ width: "16%", textAlign: "right" }}>Price</span>
          <span style={{ width: "16%", textAlign: "right" }}>Total</span>
        </div>
        {sale.items?.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "10px",
              margin: "2px 0",
            }}
          >
            <span
              style={{
                width: "50%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {item.name}
            </span>
            <span style={{ width: "16%", textAlign: "center" }}>
              {item.quantity}
            </span>
            <span style={{ width: "16%", textAlign: "right" }}>
              {formatCurrency(item.selling_price)}
            </span>
            <span style={{ width: "16%", textAlign: "right" }}>
              {formatCurrency(item.selling_price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div style={{ fontSize: "10px", marginBottom: "8px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "2px 0",
          }}
        >
          <span>Subtotal:</span>
          <span>{formatCurrency(sale.subtotal || 0)}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "2px 0",
          }}
        >
          <span>Tax (5%):</span>
          <span>{formatCurrency(sale.tax || 0)}</span>
        </div>
        {sale.discount > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "2px 0",
            }}
          >
            <span>Discount:</span>
            <span>-{formatCurrency(sale.discount)}</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div
        style={{
          borderTop: "1px dashed #000",
          paddingTop: "8px",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
            fontSize: "12px",
          }}
        >
          <span>TOTAL:</span>
          <span>{formatCurrency(sale.total || 0)}</span>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          borderTop: "1px dashed #000",
          paddingTop: "8px",
        }}
      >
        <p style={{ fontWeight: "bold", margin: "2px 0", fontSize: "10px" }}>
          Thank You!
        </p>
        <p style={{ margin: "2px 0", fontSize: "9px", color: "#666" }}>
          Visit us again
        </p>
        <p style={{ margin: "2px 0", fontSize: "9px", color: "#666" }}>
          Keep medicines away from children
        </p>
      </div>
    </div>
  );
}
