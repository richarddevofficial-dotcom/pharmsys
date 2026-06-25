"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Save, Trash2, Search } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AddPurchasePage() {
  const router = useRouter();
  const { isLoading: authLoading } = useAuth(true);
  const [searchMedicine, setSearchMedicine] = useState("");

  const [formData, setFormData] = useState({
    supplier: "",
    invoice_number: "",
    purchase_date: new Date().toISOString().split("T")[0],
    items: [],
    notes: "",
  });

  // Fetch real suppliers
  const { data: suppliersData } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const response = await api.get("/suppliers/");
      return response.data;
    },
  });
  const suppliers = suppliersData?.results || [];

  // Fetch real medicines
  const { data: medicinesData } = useQuery({
    queryKey: ["medicines-for-purchase"],
    queryFn: async () => {
      const response = await api.get("/medicines/");
      return response.data;
    },
  });
  const medicines = medicinesData?.results || [];

  // Create purchase mutation
  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/purchases/", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Purchase order created!");
      router.push("/purchases");
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || "Failed to create order");
    },
  });

  const filteredMedicines = medicines.filter((med) =>
    med.name?.toLowerCase().includes(searchMedicine.toLowerCase()),
  );

  const addItem = (medicine) => {
    const existing = formData.items.find(
      (item) => item.medicine_id === medicine.id,
    );
    if (existing) {
      setFormData({
        ...formData,
        items: formData.items.map((item) =>
          item.medicine_id === medicine.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total_price: (item.quantity + 1) * parseFloat(item.cost_price),
              }
            : item,
        ),
      });
    } else {
      setFormData({
        ...formData,
        items: [
          ...formData.items,
          {
            medicine_id: medicine.id,
            medicine_name: medicine.name,
            cost_price: parseFloat(
              medicine.cost_price || medicine.selling_price || 0,
            ),
            quantity: 1,
            total_price: parseFloat(
              medicine.cost_price || medicine.selling_price || 0,
            ),
          },
        ],
      });
    }
    toast.success(`${medicine.name} added`);
  };

  const updateItemQuantity = (medicineId, quantity) => {
    if (quantity < 1) return;
    setFormData({
      ...formData,
      items: formData.items.map((item) =>
        item.medicine_id === medicineId
          ? { ...item, quantity, total_price: quantity * item.cost_price }
          : item,
      ),
    });
  };

  const removeItem = (medicineId) => {
    setFormData({
      ...formData,
      items: formData.items.filter((item) => item.medicine_id !== medicineId),
    });
  };

  const subtotal = formData.items.reduce(
    (sum, item) => sum + (item.total_price || 0),
    0,
  );
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.supplier) {
      toast.error("Please select a supplier");
      return;
    }
    if (formData.items.length === 0) {
      toast.error("Please add at least one medicine");
      return;
    }
    if (!formData.invoice_number) {
      toast.error("Please enter invoice number");
      return;
    }

    createMutation.mutate({
      supplier: formData.supplier,
      invoice_number: formData.invoice_number,
      purchase_date: formData.purchase_date,
      total_amount: total,
      status: "PENDING",
      notes: formData.notes,
      items: formData.items,
    });
  };

  if (authLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Purchases", href: "/purchases" },
          { label: "New Purchase Order" },
        ]}
      />
      <PageHeader
        title="New Purchase Order"
        description="Create a new purchase order from supplier"
        backUrl="/purchases"
      />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Purchase Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Supplier *</Label>
                    <select
                      value={formData.supplier}
                      onChange={(e) =>
                        setFormData({ ...formData, supplier: e.target.value })
                      }
                      className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm"
                      required
                    >
                      <option value="">Select supplier</option>
                      {suppliers.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Invoice Number *</Label>
                    <Input
                      value={formData.invoice_number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          invoice_number: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Purchase Date *</Label>
                    <Input
                      type="date"
                      value={formData.purchase_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          purchase_date: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={2}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add Medicines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search medicines..."
                    value={searchMedicine}
                    onChange={(e) => setSearchMedicine(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                  {filteredMedicines.map((med) => (
                    <button
                      key={med.id}
                      type="button"
                      onClick={() => addItem(med)}
                      className="p-3 text-left border rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all text-sm"
                    >
                      <p className="font-medium truncate">{med.name}</p>
                      <p className="text-xs text-gray-500">
                        Cost:{" "}
                        {formatCurrency(med.cost_price || med.selling_price)}
                      </p>
                    </button>
                  ))}
                </div>

                {formData.items.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-sm mb-3">
                      Selected Items ({formData.items.length})
                    </h4>
                    <div className="space-y-2">
                      {formData.items.map((item) => (
                        <div
                          key={item.medicine_id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {item.medicine_name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatCurrency(item.cost_price)} / unit
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                updateItemQuantity(
                                  item.medicine_id,
                                  item.quantity - 1,
                                )
                              }
                            >
                              -
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                updateItemQuantity(
                                  item.medicine_id,
                                  parseInt(e.target.value) || 1,
                                )
                              }
                              className="w-16 h-8 text-center text-sm"
                              min="1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                updateItemQuantity(
                                  item.medicine_id,
                                  item.quantity + 1,
                                )
                              }
                            >
                              +
                            </Button>
                            <span className="w-20 text-right text-sm font-medium">
                              {formatCurrency(item.total_price)}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-500"
                              onClick={() => removeItem(item.medicine_id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Items</span>
                  <span>{formData.items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax (5%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span className="text-orange-600">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={createMutation.isLoading}
              >
                {createMutation.isLoading ? (
                  "Creating..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Purchase Order
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
