"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { supplierService } from "@/services/supplierService";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Save, Building2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AddSupplierPage() {
  const router = useRouter();
  const { isLoading: authLoading } = useAuth(true);
  const [formData, setFormData] = useState({
    name: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      console.log("Sending supplier data:", data);
      const response = await supplierService.create(data);
      console.log("Supplier response:", response.data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Supplier created:", data);
      toast.success("Supplier added successfully!");
      setTimeout(() => router.push("/suppliers"), 500);
    },
    onError: (error) => {
      console.error("Supplier error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.detail ||
          JSON.stringify(error.response?.data) ||
          "Failed to add supplier",
      );
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.contact_person || !formData.phone) {
      toast.error("Please fill required fields: Name, Contact Person, Phone");
      return;
    }
    createMutation.mutate(formData);
  };

  if (authLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Suppliers", href: "/suppliers" },
          { label: "Add Supplier" },
        ]}
      />
      <PageHeader
        title="Add New Supplier"
        description="Enter supplier details"
        backUrl="/suppliers"
      />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Supplier Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Company Name *</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Contact Person *</Label>
                <Input
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Phone *</Label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={createMutation.isLoading}>
                {createMutation.isLoading ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Supplier
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
