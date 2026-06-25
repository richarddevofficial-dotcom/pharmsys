"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { customerService } from "@/services/customerService";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Save, User } from "lucide-react";
import toast from "react-hot-toast";

export default function AddCustomerPage() {
  const router = useRouter();
  const { isLoading: authLoading } = useAuth(true);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    address: "",
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      console.log("Sending customer data:", data);
      const response = await customerService.create(data);
      console.log("Customer response:", response.data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Customer created:", data);
      toast.success("Customer added successfully!");
      setTimeout(() => router.push("/customers"), 500);
    },
    onError: (error) => {
      console.error("Customer error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.detail ||
          JSON.stringify(error.response?.data) ||
          "Failed to add customer",
      );
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.first_name || !formData.last_name) {
      toast.error("Please fill required fields: First Name, Last Name");
      return;
    }
    createMutation.mutate(formData);
  };

  if (authLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Customers", href: "/customers" },
          { label: "Add Customer" },
        ]}
      />
      <PageHeader
        title="Add New Customer"
        description="Enter customer details"
        backUrl="/customers"
      />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name *</Label>
                <Input
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name *</Label>
                <Input
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
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
                    Save Customer
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
