"use client";

import { useState } from "react";
import { Printer, X } from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export function ReceiptModal({ sale, onClose }) {
  if (!sale) return null;

  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=400,height=600");

    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body { font-family: 'Courier New', monospace; font-size: 10px; width: 80mm; margin: 0 auto; padding: 5mm; }
            .center { text-align: center; }
            .dashed { border-top: 1px dashed #000; padding: 5px 0; margin: 5px 0; }
            .row { display: flex; justify-content: space-between; margin: 2px 0; }
            .bold { font-weight: bold; }
            h3 { font-size: 12px; margin: 0 0 4px 0; }
            @media print { body { width: 80mm; } }
          </style>
        </head>
        <body>
          <div class="center"><h3>PHARMASYS PHARMACY</h3><p>123 Health Street</p></div>
          <div class="dashed"></div>
          <div class="row"><span>Invoice:</span><span class="bold">#${String(sale.id).slice(-8)}</span></div>
          <div class="row"><span>Date:</span><span>${formatDateTime(sale.date || new Date().toISOString())}</span></div>
          <div class="row"><span>Payment:</span><span>${sale.paymentMethod || "Cash"}</span></div>
          <div class="dashed"></div>
          ${(sale.items || [])
            .map(
              (item) => `
            <div class="row"><span>${item.name}</span><span>${item.quantity} x ${formatCurrency(item.selling_price)} = ${formatCurrency(item.selling_price * item.quantity)}</span></div>
          `,
            )
            .join("")}
          <div class="dashed"></div>
          <div class="row bold" style="font-size:12px"><span>TOTAL:</span><span>${formatCurrency(sale.total || 0)}</span></div>
          <div class="dashed"></div>
          <div class="center"><p class="bold">Thank You!</p></div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 1000);
            };
            // After print, notify parent window
            window.onafterprint = function() {
              if (window.opener && !window.opener.closed) {
                window.opener.postMessage('receiptPrinted', '*');
              }
              window.close();
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();

    // Close receipt after a short delay
    setTimeout(() => {
      if (onClose) onClose();
    }, 1500);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
      }}
      onClick={(e) => {
        // Close when clicking the dark background
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          maxWidth: "400px",
          width: "90%",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px",
            borderBottom: "1px solid #e5e5e5",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "bold" }}>
            Receipt Preview
          </h2>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handlePrint}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "6px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                backgroundColor: "white",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              <Printer size={16} /> Print
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "6px",
                border: "none",
                borderRadius: "6px",
                backgroundColor: "transparent",
                cursor: "pointer",
                fontSize: "18px",
                color: "#6b7280",
              }}
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Receipt Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
          <div
            style={{
              textAlign: "center",
              borderBottom: "1px dashed #ddd",
              paddingBottom: "12px",
              marginBottom: "12px",
            }}
          >
            <h3
              style={{
                fontWeight: "bold",
                fontSize: "16px",
                margin: "0 0 4px 0",
              }}
            >
              PHARMASYS PHARMACY
            </h3>
            <p style={{ fontSize: "12px", color: "#666", margin: "2px 0" }}>
              123 Health Street, Medical District
            </p>
            <p style={{ fontSize: "12px", color: "#666", margin: "2px 0" }}>
              Tel: +1 234-567-8900
            </p>
          </div>

          <div style={{ fontSize: "12px", marginBottom: "12px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "2px 0",
              }}
            >
              <span style={{ color: "#666" }}>Invoice:</span>
              <span style={{ fontWeight: "bold" }}>
                #{String(sale.id).slice(-8)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "2px 0",
              }}
            >
              <span style={{ color: "#666" }}>Date:</span>
              <span>
                {formatDateTime(sale.date || new Date().toISOString())}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "2px 0",
              }}
            >
              <span style={{ color: "#666" }}>Cashier:</span>
              <span>{sale.cashier || "Staff"}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "2px 0",
              }}
            >
              <span style={{ color: "#666" }}>Payment:</span>
              <span style={{ textTransform: "capitalize" }}>
                {sale.paymentMethod || "Cash"}
              </span>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px dashed #ddd",
              borderBottom: "1px dashed #ddd",
              padding: "8px 0",
              marginBottom: "12px",
            }}
          >
            {(sale.items || []).map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  margin: "2px 0",
                }}
              >
                <span style={{ flex: 1 }}>{item.name}</span>
                <span style={{ width: "60px", textAlign: "center" }}>
                  x{item.quantity}
                </span>
                <span style={{ width: "70px", textAlign: "right" }}>
                  {formatCurrency(item.selling_price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div style={{ fontSize: "12px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "2px 0",
              }}
            >
              <span style={{ color: "#666" }}>Subtotal:</span>
              <span>{formatCurrency(sale.subtotal || 0)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "2px 0",
              }}
            >
              <span style={{ color: "#666" }}>Tax (5%):</span>
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
                <span style={{ color: "#666" }}>Discount:</span>
                <span style={{ color: "#ef4444" }}>
                  -{formatCurrency(sale.discount)}
                </span>
              </div>
            )}
          </div>

          <div
            style={{
              borderTop: "1px dashed #ddd",
              paddingTop: "8px",
              marginTop: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              <span>TOTAL:</span>
              <span>{formatCurrency(sale.total || 0)}</span>
            </div>
          </div>

          <div
            style={{
              textAlign: "center",
              borderTop: "1px dashed #ddd",
              paddingTop: "12px",
              marginTop: "12px",
            }}
          >
            <p
              style={{ fontWeight: "bold", fontSize: "12px", margin: "2px 0" }}
            >
              Thank You!
            </p>
            <p style={{ color: "#666", fontSize: "11px", margin: "2px 0" }}>
              Visit us again
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
