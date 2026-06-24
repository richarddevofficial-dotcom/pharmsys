"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ReceiptModal } from "@/components/sales/ReceiptModal";
import { BarcodeScanner } from "@/components/pos/BarcodeScanner";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  CreditCard,
  Banknote,
  Smartphone,
  Printer,
  X,
  Scan,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";

const mockMedicines = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    generic_name: "Paracetamol",
    selling_price: 5.99,
    quantity: 100,
    batch_number: "B001",
  },
  {
    id: 2,
    name: "Amoxicillin 250mg",
    generic_name: "Amoxicillin",
    selling_price: 12.5,
    quantity: 50,
    batch_number: "B002",
  },
  {
    id: 3,
    name: "Ibuprofen 400mg",
    generic_name: "Ibuprofen",
    selling_price: 8.99,
    quantity: 75,
    batch_number: "B003",
  },
  {
    id: 4,
    name: "Omeprazole 20mg",
    generic_name: "Omeprazole",
    selling_price: 15.0,
    quantity: 30,
    batch_number: "B004",
  },
  {
    id: 5,
    name: "Cetirizine 10mg",
    generic_name: "Cetirizine",
    selling_price: 7.5,
    quantity: 60,
    batch_number: "B005",
  },
  {
    id: 6,
    name: "Vitamin C 1000mg",
    generic_name: "Ascorbic Acid",
    selling_price: 10.99,
    quantity: 90,
    batch_number: "B006",
  },
  {
    id: 7,
    name: "Metformin 500mg",
    generic_name: "Metformin",
    selling_price: 6.5,
    quantity: 45,
    batch_number: "B007",
  },
  {
    id: 8,
    name: "Aspirin 300mg",
    generic_name: "Aspirin",
    selling_price: 4.99,
    quantity: 120,
    batch_number: "B008",
  },
];

export default function POSPage() {
  const { user, isLoading: authLoading } = useAuth(true);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [discount, setDiscount] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSale, setLastSale] = useState(null);
  const [lastReceipt, setLastReceipt] = useState(null);
  const [showScanner, setShowScanner] = useState(false);

  const filteredMedicines = mockMedicines.filter(
    (med) =>
      med.name.toLowerCase().includes(search.toLowerCase()) ||
      med.generic_name.toLowerCase().includes(search.toLowerCase()),
  );

  const addToCart = (medicine) => {
    const existing = cart.find((item) => item.id === medicine.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCart([...cart, { ...medicine, quantity: 1 }]);
    }
    toast.success(`${medicine.name} added to cart`);
  };

  const handleBarcodeScan = (barcode) => {
    const medicine = mockMedicines.find((m) => m.batch_number === barcode);
    if (medicine) {
      addToCart(medicine);
      toast.success(`${medicine.name} found!`);
    } else {
      toast.error("Medicine not found");
    }
  };

  const updateQuantity = (id, change) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === id) {
            const q = item.quantity + change;
            return q > 0 ? { ...item, quantity: q } : item;
          }
          return item;
        })
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };
  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setShowPayment(false);
  };

  const subtotal = cart.reduce((s, i) => s + i.selling_price * i.quantity, 0);
  const tax = subtotal * 0.05;
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal + tax - discountAmount;

  const completeSale = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty!");
      return;
    }

    const invoice = {
      id: Date.now(),
      items: cart,
      subtotal,
      tax,
      discount: discountAmount,
      discountPercent: discount,
      total,
      paymentMethod,
      date: new Date().toISOString(),
      cashier: user?.first_name || "User",
    };

    setLastSale(invoice);
    setLastReceipt(invoice);
    setShowReceipt(true);

    // Show success toast FIRST
    toast.success(`✅ Sale completed! Total: ${formatCurrency(total)}`, {
      duration: 4000,
      position: "top-center",
    });

    // Then clear cart
    setCart([]);
    setDiscount(0);
    setShowPayment(false);
  };

  if (authLoading) return <LoadingSpinner />;

  return (
    <div className="h-full flex flex-col space-y-4">
      <Breadcrumb items={[{ label: "Point of Sale" }]} />
      <PageHeader
        title="Point of Sale"
        description="Process sales transactions"
        backUrl="/dashboard"
        actions={
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex"
            onClick={() => {
              if (lastReceipt) {
                setLastSale(lastReceipt);
                setShowReceipt(true);
              } else {
                toast.error("No previous receipt found");
              }
            }}
          >
            <Printer className="h-4 w-4 mr-2" />
            Last Receipt
          </Button>
        }
      />

      <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-6 min-h-0">
        {/* Products */}
        <div className="flex-1 space-y-4 min-w-0">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search medicines..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowScanner(true)}
            >
              <Scan className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-3 overflow-y-auto max-h-[calc(100vh-380px)] lg:max-h-[calc(100vh-300px)]">
            {filteredMedicines.map((med) => (
              <button
                key={med.id}
                onClick={() => addToCart(med)}
                className="p-3 md:p-4 text-left border rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all active:scale-95"
              >
                <h3 className="font-medium text-xs md:text-sm line-clamp-2">
                  {med.name}
                </h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm md:text-lg font-bold text-orange-600">
                    ${med.selling_price.toFixed(2)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Cart */}
        <div className="w-full lg:w-96 flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShoppingCart className="h-5 w-5" />
                  Cart ({cart.length})
                </CardTitle>
                {cart.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCart}
                    className="text-red-500"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <div className="flex-1 space-y-1 overflow-y-auto px-6 max-h-[calc(100vh-500px)]">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        ${item.selling_price.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {cart.length > 0 && (
                <div className="border-t px-6 py-4 space-y-2 bg-white">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax (5%)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Discount (%)</span>
                    <Input
                      type="number"
                      value={discount}
                      onChange={(e) =>
                        setDiscount(
                          Math.min(100, Math.max(0, Number(e.target.value))),
                        )
                      }
                      className="w-20 h-8 text-sm"
                    />
                    <span className="text-sm text-red-500">
                      -{formatCurrency(discountAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span className="text-orange-600">
                      {formatCurrency(total)}
                    </span>
                  </div>
                  {!showPayment ? (
                    <Button
                      className="w-full mt-2 bg-orange-500 hover:bg-orange-600"
                      size="lg"
                      onClick={() => setShowPayment(true)}
                    >
                      <CreditCard className="h-5 w-5 mr-2" />
                      Proceed to Payment
                    </Button>
                  ) : (
                    <div className="space-y-3 mt-2">
                      <p className="font-medium text-sm">Payment Method:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { method: "cash", icon: Banknote, label: "Cash" },
                          { method: "card", icon: CreditCard, label: "Card" },
                          {
                            method: "mobile",
                            icon: Smartphone,
                            label: "Mobile",
                          },
                          {
                            method: "transfer",
                            icon: Banknote,
                            label: "Transfer",
                          },
                        ].map(({ method, icon: Icon, label }) => (
                          <Button
                            key={method}
                            variant={
                              paymentMethod === method ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setPaymentMethod(method)}
                            className={
                              paymentMethod === method
                                ? "bg-orange-500 hover:bg-orange-600"
                                : ""
                            }
                          >
                            <Icon className="h-4 w-4 mr-2" />
                            {label}
                          </Button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          className="flex-1 bg-orange-500 hover:bg-orange-600"
                          onClick={completeSale}
                        >
                          Complete - {formatCurrency(total)}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setShowPayment(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <BarcodeScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScan={handleBarcodeScan}
      />

      {showReceipt && lastSale && (
        <ReceiptModal
          sale={lastSale}
          onClose={() => {
            setShowReceipt(false);
            setLastSale(null);
          }}
        />
      )}
    </div>
  );
}
