"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customerService } from "@/services/customerService";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Plus,
  Search,
  Phone,
  Mail,
  Star,
  Edit,
  Trash2,
  Users,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CustomersPage() {
  const { isLoading: authLoading } = useAuth(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const queryClient = useQueryClient();

  const { data: apiResponse, isLoading: customersLoading } = useQuery({
    queryKey: ["customers", search],
    queryFn: () => customerService.getAll({ search }),
  });

  const customers = apiResponse?.data?.results || apiResponse?.data || [];
  const totalRevenue = customers.reduce(
    (s, c) => s + parseFloat(c.total_spent || 0),
    0,
  );
  const totalPurchases = customers.reduce(
    (s, c) => s + parseInt(c.total_purchases || 0),
    0,
  );

  const deleteMutation = useMutation({
    mutationFn: (id) => customerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["customers"]);
      toast.success("Customer deleted!");
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Failed to delete");
      setDeleteId(null);
    },
  });

  const handleDelete = () => {
    if (deleteId) deleteMutation.mutate(deleteId);
  };

  if (authLoading || customersLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Customers" }]} />
      <PageHeader
        title="Customers"
        description="Manage your customer database"
        backUrl="/dashboard"
        actions={
          <Link href="/customers/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </Link>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Customers</p>
                <p className="text-2xl font-bold">{customers.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Purchases</p>
                <p className="text-2xl font-bold">{totalPurchases}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg per Customer</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    customers.length > 0 ? totalRevenue / customers.length : 0,
                  )}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle>Customer List</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="min-w-[700px] md:min-w-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Purchases</TableHead>
                    <TableHead>Spent</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-gray-400"
                      >
                        <Search className="h-12 w-12 mx-auto mb-2" />
                        <p>No customers found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    customers.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="font-bold text-blue-600 text-xs">
                                {c.first_name?.[0]}
                                {c.last_name?.[0]}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-sm">
                                {c.first_name} {c.last_name}
                              </p>
                              <p className="text-xs text-gray-500">
                                ID: #{c.id}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span className="text-xs">{c.phone || "-"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="text-xs">{c.email || "-"}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-sm">
                            {c.total_purchases || 0}
                          </span>
                        </TableCell>
                        <TableCell className="font-bold text-sm text-green-600">
                          {formatCurrency(c.total_spent || 0)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm">
                              {c.loyalty_points || 0}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Link href={`/customers/${c.id}/edit`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteId(c.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Customer"
        message="Are you sure?"
      />
    </div>
  );
}
