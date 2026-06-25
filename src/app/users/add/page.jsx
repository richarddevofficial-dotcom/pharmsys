"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { useMutation } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Save, User } from "lucide-react";
import toast from "react-hot-toast";

export default function AddUserPage() {
  const router = useRouter();
  const { isLoading: authLoading } = useAuth(true);
  useRoleAccess();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "CASHIER",
  });

  const createMutation = useMutation({
    mutationFn: (data) => userService.create(data),
    onSuccess: () => {
      toast.success("User created!");
      router.push("/users");
    },
    onError: (error) => toast.error(error.response?.data?.detail || "Failed"),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.username ||
      !formData.password
    ) {
      toast.error("Fill required fields");
      return;
    }
    createMutation.mutate(formData);
  };

  if (authLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[{ label: "Users", href: "/users" }, { label: "Add User" }]}
      />
      <PageHeader
        title="Add New User"
        description="Create a new system user"
        backUrl="/users"
      />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Username *</Label>
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Password *</Label>
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                <Label>Phone</Label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Role *</Label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm"
                required
              >
                <option value="CASHIER">Cashier</option>
                <option value="PHARMACIST">Pharmacist</option>
                <option value="STORE_MANAGER">Store Manager</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={createMutation.isLoading}>
                {createMutation.isLoading ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save User
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
