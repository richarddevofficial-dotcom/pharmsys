"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AddMedicinePage() {
  const router = useRouter();
  const { isLoading: authLoading } = useAuth(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    generic_name: "",
    brand: "",
    category: "",
    supplier: "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Medicine data:", formData);
      toast.success("Medicine added successfully!");
      setIsSubmitting(false);
      router.push("/medicines");
    }, 1000);
  };

  if (authLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/medicines">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add New Medicine</h1>
          <p className="text-gray-500 mt-1">Enter medicine details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Medicine Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Paracetamol 500mg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="generic_name">Generic Name *</Label>
                  <Input
                    id="generic_name"
                    name="generic_name"
                    value={formData.generic_name}
                    onChange={handleChange}
                    placeholder="e.g., Paracetamol"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand Name</Label>
                  <Input
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="e.g., Panadol"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input
                    id="manufacturer"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleChange}
                    placeholder="e.g., GSK"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm"
                  >
                    <option value="">Select category</option>
                    <option value="antibiotics">Antibiotics</option>
                    <option value="pain_killers">Pain Killers</option>
                    <option value="vitamins">Vitamins</option>
                    <option value="syrups">Syrups</option>
                    <option value="equipment">Medical Equipment</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <select
                    id="supplier"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleChange}
                    className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm"
                  >
                    <option value="">Select supplier</option>
                    <option value="1">MedSupply Co.</option>
                    <option value="2">PharmaDist Ltd.</option>
                    <option value="3">HealthCare Supplies</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Enter medicine description..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Stock & Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Stock & Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="batch_number">Batch Number *</Label>
                <Input
                  id="batch_number"
                  name="batch_number"
                  value={formData.batch_number}
                  onChange={handleChange}
                  placeholder="e.g., BATCH-001"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="barcode">Barcode</Label>
                <Input
                  id="barcode"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleChange}
                  placeholder="Scan or enter barcode"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cost_price">Cost Price ($)</Label>
                  <Input
                    id="cost_price"
                    name="cost_price"
                    type="number"
                    step="0.01"
                    value={formData.cost_price}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="selling_price">Selling Price ($)</Label>
                  <Input
                    id="selling_price"
                    name="selling_price"
                    type="number"
                    step="0.01"
                    value={formData.selling_price}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimum_stock">Min Stock Level</Label>
                  <Input
                    id="minimum_stock"
                    name="minimum_stock"
                    type="number"
                    value={formData.minimum_stock}
                    onChange={handleChange}
                    placeholder="10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiry_date">Expiry Date *</Label>
                <Input
                  id="expiry_date"
                  name="expiry_date"
                  type="date"
                  value={formData.expiry_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </div>
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
