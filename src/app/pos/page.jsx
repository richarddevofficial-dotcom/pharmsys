"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
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
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Mock medicines data for demo
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

  // Filter medicines based on search
  const filteredMedicines = mockMedicines.filter(
    (med) =>
      med.name.toLowerCase().includes(search.toLowerCase()) ||
      med.generic_name.toLowerCase().includes(search.toLowerCase()),
  );

  // Add to cart
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
  };

  // Update quantity
  const updateQuantity = (id, change) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + change;
            return newQty > 0 ? { ...item, quantity: newQty } : item;
          }
          return item;
        })
        .filter((item) => item.quantity > 0),
    );
  };

  // Remove from cart
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Calculate totals
  const subtotal = cart.reduce(
    (sum, item) => sum + item.selling_price * item.quantity,
    0,
  );
  const tax = subtotal * 0.05; // 5% tax
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal + tax - discountAmount;

  // Complete sale
  const completeSale = () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    // Generate invoice
    const invoice = {
      id: Date.now(),
      items: cart,
      subtotal,
      tax,
      discount: discountAmount,
      total,
      paymentMethod,
      date: new Date().toISOString(),
      cashier: user?.first_name || "User",
    };

    console.log("Sale completed:", invoice);
    alert(`Sale completed! Total: ${formatCurrency(total)}`);

    // Clear cart
    setCart([]);
    setDiscount(0);
    setShowPayment(false);
  };

  if (authLoading) return <LoadingSpinner />;

  return (
    <div className="h-full flex gap-6">
      {/* Left Side - Products */}
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Point of Sale</h1>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Last Receipt
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search medicines by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Medicine Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[calc(100vh-250px)] overflow-y-auto">
          {filteredMedicines.map((medicine) => (
            <button
              key={medicine.id}
              onClick={() => addToCart(medicine)}
              className="p-4 text-left border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
            >
              <h3 className="font-medium text-sm">{medicine.name}</h3>
              <p className="text-xs text-gray-500">{medicine.generic_name}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-lg font-bold text-blue-600">
                  ${medicine.selling_price.toFixed(2)}
                </span>
                <Badge variant="secondary" className="text-xs">
                  Stock: {medicine.quantity}
                </Badge>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Side - Cart */}
      <div className="w-96 flex flex-col">
        <Card className="flex-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Cart ({cart.length} items)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {/* Cart Items */}
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[calc(100vh-450px)]">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-2" />
                  <p>Cart is empty</p>
                  <p className="text-sm">Click on medicines to add</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
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
                      <span className="w-8 text-center text-sm">
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
                ))
              )}
            </div>

            {/* Totals */}
            {cart.length > 0 && (
              <div className="border-t pt-4 mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (5%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Discount (%)</span>
                  <Input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-20 h-8 text-sm"
                    min="0"
                    max="100"
                  />
                  <span className="text-sm text-red-500">
                    -{formatCurrency(discountAmount)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span className="text-blue-600">{formatCurrency(total)}</span>
                </div>

                {/* Payment Button */}
                {!showPayment ? (
                  <Button
                    className="w-full mt-4"
                    size="lg"
                    onClick={() => setShowPayment(true)}
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    Proceed to Payment
                  </Button>
                ) : (
                  <div className="space-y-3 mt-4">
                    <p className="font-medium text-sm">
                      Select Payment Method:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={
                          paymentMethod === "cash" ? "default" : "outline"
                        }
                        onClick={() => setPaymentMethod("cash")}
                      >
                        <Banknote className="h-4 w-4 mr-2" />
                        Cash
                      </Button>
                      <Button
                        variant={
                          paymentMethod === "card" ? "default" : "outline"
                        }
                        onClick={() => setPaymentMethod("card")}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Card
                      </Button>
                      <Button
                        variant={
                          paymentMethod === "mobile" ? "default" : "outline"
                        }
                        onClick={() => setPaymentMethod("mobile")}
                      >
                        <Smartphone className="h-4 w-4 mr-2" />
                        Mobile
                      </Button>
                      <Button
                        variant={
                          paymentMethod === "transfer" ? "default" : "outline"
                        }
                        onClick={() => setPaymentMethod("transfer")}
                      >
                        <Banknote className="h-4 w-4 mr-2" />
                        Transfer
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1" onClick={completeSale}>
                        Complete Sale - {formatCurrency(total)}
                      </Button>
                      <Button
                        variant="outline"
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
  );
}
