"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Scan, X } from "lucide-react";

export function BarcodeScanner({ onScan, isOpen, onClose }) {
  const [barcode, setBarcode] = useState("");
  const [mode, setMode] = useState("manual"); // 'manual' or 'camera'
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle manual barcode entry (keyboard or scanner gun)
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (barcode.trim()) {
        onScan(barcode.trim());
        setBarcode("");
      }
    }
  };

  const handleManualSubmit = () => {
    if (barcode.trim()) {
      onScan(barcode.trim());
      setBarcode("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 no-print">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Scan className="h-5 w-5 text-orange-500" />
            Barcode Scanner
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Mode Toggle */}
          <div className="flex gap-2">
            <Button
              variant={mode === "manual" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("manual")}
              className="flex-1"
            >
              Manual Entry
            </Button>
            <Button
              variant={mode === "camera" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("camera")}
              className="flex-1"
            >
              Camera Scan
            </Button>
          </div>

          {mode === "manual" ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                Scan barcode using scanner gun or type manually
              </p>
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Scan or type barcode..."
                  className="flex-1"
                  autoFocus
                />
                <Button onClick={handleManualSubmit}>
                  <Scan className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-400">
                Press Enter after scanning or typing barcode
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Scan className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  Camera barcode scanning requires HTTPS or localhost
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Use manual entry or scanner gun for now
                </p>
              </div>
            </div>
          )}

          {/* Quick Test Barcodes */}
          <div className="border-t pt-3">
            <p className="text-xs text-gray-500 mb-2">Test Barcodes:</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Paracetamol", code: "8901234567890" },
                { label: "Amoxicillin", code: "8901234567891" },
                { label: "Ibuprofen", code: "8901234567892" },
                { label: "Vitamin C", code: "8901234567893" },
              ].map((item) => (
                <button
                  key={item.code}
                  onClick={() => {
                    onScan(item.code);
                    setBarcode("");
                  }}
                  className="p-2 text-xs border rounded hover:border-orange-500 hover:bg-orange-50 transition-all text-left"
                >
                  <span className="font-medium">{item.label}</span>
                  <span className="text-gray-400 block">{item.code}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
