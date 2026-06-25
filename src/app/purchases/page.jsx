"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  ArrowDownCircle,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import toast from "react-hot-toast";

export default function PurchasesPage() {
  const { isLoading: authLoading } = useAuth(true);
  const [search, setSearch] = useState("");
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const queryClient = useQueryClient();

  const { data: apiResponse, isLoading: purchasesLoading } = useQuery({
    queryKey: ["purchases", search],
    queryFn: async () => {
      const response = await api.get("/purchases/");
      return response.data;
    },
  });

  const purchases = apiResponse?.results || [];

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await api.patch(`/purchases/${id}/`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["purchases"]);
      toast.success("Status updated!");
    },
    onError: (error) => {
      toast.error("Failed to update status");
    },
  });

  const handleReceiveStock = (purchase) => {
    if (confirm(`Mark ${purchase.invoice_number} as received?`)) {
      updateStatusMutation.mutate({ id: purchase.id, status: "RECEIVED" });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "RECEIVED":
        return (
          <Badge variant="success">
            <CheckCircle className="h-3 w-3 mr-1" />
            Received
          </Badge>
        );
      case "PENDING":
        return (
          <Badge variant="warning">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const totalValue = purchases.reduce(
    (s, p) => s + parseFloat(p.total_amount || 0),
    0,
  );
  const pendingCount = purchases.filter((p) => p.status === "PENDING").length;

  if (authLoading || purchasesLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Purchase Orders" }]} />
      <PageHeader
        title="Purchase Orders"
        description="Manage purchase orders from suppliers"
        backUrl="/dashboard"
        actions={
          <Link href="/purchases/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Purchase Order
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold">{purchases.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Value</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalValue)}
                </p>
              </div>
              <Truck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {pendingCount}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <CardTitle>Purchase Orders</CardTitle>
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
                <div className="min-w-[600px] md:min-w-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchases.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-8 text-gray-400"
                          >
                            <Search className="h-12 w-12 mx-auto mb-2" />
                            <p>No purchase orders</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        purchases.map((p) => (
                          <TableRow key={p.id}>
                            <TableCell className="font-medium text-sm">
                              #{p.id}
                            </TableCell>
                            <TableCell className="text-sm">
                              {p.supplier_name || "N/A"}
                            </TableCell>
                            <TableCell className="text-sm">
                              {p.invoice_number}
                            </TableCell>
                            <TableCell className="font-bold text-sm">
                              {formatCurrency(p.total_amount)}
                            </TableCell>
                            <TableCell>{getStatusBadge(p.status)}</TableCell>
                            <TableCell className="text-sm whitespace-nowrap">
                              {formatDate(p.purchase_date)}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedPurchase(p)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {p.status === "PENDING" && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleReceiveStock(p)}
                                    title="Receive Stock"
                                  >
                                    <ArrowDownCircle className="h-4 w-4 text-green-500" />
                                  </Button>
                                )}
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
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPurchase ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-medium">#{selectedPurchase.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Supplier</p>
                  <p className="font-medium">
                    {selectedPurchase.supplier_name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Invoice</p>
                  <p className="font-medium">
                    {selectedPurchase.invoice_number}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  {getStatusBadge(selectedPurchase.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">
                    {formatDate(selectedPurchase.purchase_date)}
                  </p>
                </div>
                {selectedPurchase.items?.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">Items</p>
                    <div className="mt-2 space-y-2">
                      {selectedPurchase.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span>{item.medicine_name}</span>
                          <span className="text-gray-500">
                            x{item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(selectedPurchase.total_amount)}</span>
                  </div>
                </div>

                {selectedPurchase.status === "PENDING" && (
                  <Button
                    className="w-full"
                    onClick={() => handleReceiveStock(selectedPurchase)}
                    disabled={updateStatusMutation.isLoading}
                  >
                    <ArrowDownCircle className="h-4 w-4 mr-2" />
                    {updateStatusMutation.isLoading
                      ? "Updating..."
                      : "Receive Stock"}
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Eye className="h-12 w-12 mx-auto mb-2" />
                <p>Select an order</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
