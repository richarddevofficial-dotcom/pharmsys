"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSettingsStore } from "@/store/settingsStore";
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
    selling_price: 500,
    quantity: 100,
    batch_number: "B001",
  },
  {
    id: 2,
    name: "Amoxicillin 250mg",
    generic_name: "Amoxicillin",
    selling_price: 1200,
    quantity: 50,
    batch_number: "B002",
  },
  {
    id: 3,
    name: "Ibuprofen 400mg",
    generic_name: "Ibuprofen",
    selling_price: 800,
    quantity: 75,
    batch_number: "B003",
  },
  {
    id: 4,
    name: "Omeprazole 20mg",
    generic_name: "Omeprazole",
    selling_price: 1500,
    quantity: 30,
    batch_number: "B004",
  },
  {
    id: 5,
    name: "Cetirizine 10mg",
    generic_name: "Cetirizine",
    selling_price: 700,
    quantity: 60,
    batch_number: "B005",
  },
  {
    id: 6,
    name: "Vitamin C 1000mg",
    generic_name: "Ascorbic Acid",
    selling_price: 1000,
    quantity: 90,
    batch_number: "B006",
  },
  {
    id: 7,
    name: "Metformin 500mg",
    generic_name: "Metformin",
    selling_price: 600,
    quantity: 45,
    batch_number: "B007",
  },
  {
    id: 8,
    name: "Aspirin 300mg",
    generic_name: "Aspirin",
    selling_price: 400,
    quantity: 120,
    batch_number: "B008",
  },
];

export default function POSPage() {
  const { user, isLoading: authLoading } = useAuth(true);
  // READ ALL SETTINGS FROM STORE - including taxRate
  const { currency, showBothCurrencies, usdToSspRate, taxRate } =
    useSettingsStore();

  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [discount, setDiscount] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSale, setLastSale] = useState(null);
  const [lastReceipt, setLastReceipt] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(currency || "SSP");

  // Use settings from store
  const exchangeRate = usdToSspRate || 1500;
  const currentTaxRate = taxRate || 5;

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
    toast.success(`${medicine.name} added`, { duration: 1000 });
  };

  const handleBarcodeScan = (barcode) => {
    const medicine = mockMedicines.find((m) => m.batch_number === barcode);
    if (medicine) {
      addToCart(medicine);
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
  // Use tax rate from settings
  const tax = subtotal * (currentTaxRate / 100);
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal + tax - discountAmount;

  const displaySubtotal =
    selectedCurrency === "USD" ? subtotal / exchangeRate : subtotal;
  const displayTax = selectedCurrency === "USD" ? tax / exchangeRate : tax;
  const displayDiscount =
    selectedCurrency === "USD" ? discountAmount / exchangeRate : discountAmount;
  const displayTotal =
    selectedCurrency === "USD" ? total / exchangeRate : total;

  const completeSale = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty!");
      return;
    }
    const invoice = {
      id: Date.now(),
      items: cart,
      subtotal: displaySubtotal,
      taxRate: currentTaxRate,
      tax: displayTax,
      discount: displayDiscount,
      discountPercent: discount,
      total: displayTotal,
      currency: selectedCurrency,
      exchangeRate: exchangeRate,
      paymentMethod,
      date: new Date().toISOString(),
      cashier: user?.first_name || "User",
    };
    setLastSale(invoice);
    setLastReceipt(invoice);
    setShowReceipt(true);
    toast.success(
      `✅ Sale completed! Total: ${formatCurrency(displayTotal, selectedCurrency)}`,
      { duration: 4000 },
    );
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
                toast.error("No previous receipt");
              }
            }}
          >
            <Printer className="h-4 w-4 mr-2" />
            Last Receipt
          </Button>
        }
      />

      <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-6 min-h-0">
        {/* Left Side - Products */}
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
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-3 overflow-y-auto max-h-[calc(100vh-250px)]">
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
                    {formatCurrency(
                      selectedCurrency === "USD"
                        ? med.selling_price / exchangeRate
                        : med.selling_price,
                      selectedCurrency,
                    )}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side - Cart */}
        <div
          className="w-full lg:w-96 flex flex-col"
          style={{ maxHeight: "calc(100vh - 180px)" }}
        >
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="pb-2 flex-shrink-0 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShoppingCart className="h-5 w-5 text-orange-500" />
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

            <div className="flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <ShoppingCart className="h-16 w-16 mx-auto mb-3 text-gray-300" />
                  <p className="text-base font-medium">Cart is empty</p>
                  <p className="text-sm mt-1">Tap on medicines to add them</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {/* Totals Section */}
                  <div className="px-4 py-3 space-y-2 border-b bg-white">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Currency
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setSelectedCurrency("SSP")}
                          className={`px-4 py-1.5 text-xs rounded-md font-medium ${selectedCurrency === "SSP" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"}`}
                        >
                          SSP
                        </button>
                        <button
                          onClick={() => setSelectedCurrency("USD")}
                          className={`px-4 py-1.5 text-xs rounded-md font-medium ${selectedCurrency === "USD" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"}`}
                        >
                          USD
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="font-medium">
                          {formatCurrency(displaySubtotal, selectedCurrency)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          Tax ({currentTaxRate}%)
                        </span>
                        <span>
                          {formatCurrency(displayTax, selectedCurrency)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm text-gray-500">
                          Discount %
                        </span>
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            value={discount}
                            onChange={(e) =>
                              setDiscount(
                                Math.min(
                                  100,
                                  Math.max(0, Number(e.target.value)),
                                ),
                              )
                            }
                            className="w-14 h-7 text-sm text-center"
                          />
                          <span className="text-xs text-red-500">
                            -{formatCurrency(displayDiscount, selectedCurrency)}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between font-bold text-base border-t pt-2">
                        <span>TOTAL</span>
                        <span className="text-orange-600">
                          {formatCurrency(displayTotal, selectedCurrency)}
                        </span>
                      </div>
                      {showBothCurrencies && (
                        <div className="text-xs text-gray-400 text-center bg-white rounded p-1">
                          {selectedCurrency === "SSP"
                            ? `≈ ${formatCurrency(displayTotal / exchangeRate, "USD")} USD`
                            : `≈ ${formatCurrency(displayTotal * exchangeRate, "SSP")} SSP`}
                        </div>
                      )}
                    </div>

                    {!showPayment ? (
                      <Button
                        className="w-full bg-orange-500 hover:bg-orange-600 font-bold py-5 text-base"
                        onClick={() => setShowPayment(true)}
                      >
                        <CreditCard className="h-5 w-5 mr-2" />
                        Pay {formatCurrency(displayTotal, selectedCurrency)}
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-700">
                          Payment Method:
                        </p>
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
                            <button
                              key={method}
                              onClick={() => setPaymentMethod(method)}
                              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${paymentMethod === method ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"}`}
                            >
                              <Icon className="h-4 w-4" />
                              {label}
                            </button>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            className="flex-1 bg-green-600 hover:bg-green-700 font-bold py-5 text-base"
                            onClick={completeSale}
                          >
                            Complete Sale
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-auto"
                            onClick={() => setShowPayment(false)}
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Items List */}
                  <div className="px-3 py-3">
                    <p className="text-xs text-gray-500 font-medium px-1 mb-2">
                      Selected Items ({cart.length}):
                    </p>
                    <div className="space-y-2">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="bg-gray-50 rounded-lg p-3 border border-gray-100"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatCurrency(
                                  selectedCurrency === "USD"
                                    ? item.selling_price / exchangeRate
                                    : item.selling_price,
                                  selectedCurrency,
                                )}{" "}
                                / unit
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-500 flex-shrink-0 ml-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-9 h-9 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-red-50 hover:border-red-300 text-lg font-bold text-gray-600"
                            >
                              −
                            </button>
                            <span className="w-10 text-center text-lg font-bold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-9 h-9 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-green-50 hover:border-green-300 text-lg font-bold text-gray-600"
                            >
                              +
                            </button>
                            <span className="w-24 text-right text-sm font-bold text-orange-600">
                              {formatCurrency(
                                (selectedCurrency === "USD"
                                  ? item.selling_price / exchangeRate
                                  : item.selling_price) * item.quantity,
                                selectedCurrency,
                              )}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
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
