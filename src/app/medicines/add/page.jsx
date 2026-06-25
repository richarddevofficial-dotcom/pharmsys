"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { medicineService, categoryService } from "@/services/medicineService";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Save } from "lucide-react";
import toast from "react-hot-toast";

export default function AddMedicinePage() {
  const router = useRouter();
  const { isLoading: authLoading } = useAuth(true);
  const [formData, setFormData] = useState({
    name: "",
    generic_name: "",
    brand: "",
    category: "",
    batch_number: "",
    manufacturer: "",
    cost_price: "",
    selling_price: "",
    quantity: "",
    minimum_stock: "10",
    expiry_date: "",
    barcode: "",
    description: "",
  });

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getAll(),
  });
  const categories =
    categoriesData?.data?.results || categoriesData?.data || [];

  // Create medicine mutation
  const createMutation = useMutation({
    mutationFn: (data) => medicineService.create(data),
    onSuccess: () => {
      toast.success("Medicine added successfully!");
      router.push("/medicines");
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || "Failed to add medicine");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.batch_number || !formData.expiry_date) {
      toast.error("Please fill required fields");
      return;
    }
    createMutation.mutate({
      ...formData,
      cost_price: parseFloat(formData.cost_price) || 0,
      selling_price: parseFloat(formData.selling_price) || 0,
      quantity: parseInt(formData.quantity) || 0,
      minimum_stock: parseInt(formData.minimum_stock) || 10,
      category: formData.category || null,
    });
  };

  if (authLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Medicines", href: "/medicines" },
          { label: "Add Medicine" },
        ]}
      />
      <PageHeader
        title="Add New Medicine"
        description="Enter medicine details"
        backUrl="/medicines"
      />
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Medicine Name *</Label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Generic Name</Label>
                  <Input
                    name="generic_name"
                    value={formData.generic_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Brand</Label>
                  <Input
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Manufacturer</Label>
                  <Input
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm"
                  >
                    <option value="">Select</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Barcode</Label>
                  <Input
                    name="barcode"
                    value={formData.barcode}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Stock & Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Batch Number *</Label>
                <Input
                  name="batch_number"
                  value={formData.batch_number}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cost Price</Label>
                  <Input
                    name="cost_price"
                    type="number"
                    step="0.01"
                    value={formData.cost_price}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Selling Price</Label>
                  <Input
                    name="selling_price"
                    type="number"
                    step="0.01"
                    value={formData.selling_price}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quantity *</Label>
                  <Input
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Min Stock</Label>
                  <Input
                    name="minimum_stock"
                    type="number"
                    value={formData.minimum_stock}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Expiry Date *</Label>
                <Input
                  name="expiry_date"
                  type="date"
                  value={formData.expiry_date}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={createMutation.isLoading}
              >
                {createMutation.isLoading ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Medicine
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
