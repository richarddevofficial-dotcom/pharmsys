"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
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
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

const mockPurchases = [
  {
    id: "PO-001",
    supplier_name: "MedSupply Co.",
    invoice_number: "INV-2024-001",
    items: [
      { name: "Paracetamol 500mg", quantity: 100, cost_price: 3.5 },
      { name: "Amoxicillin 250mg", quantity: 50, cost_price: 8.0 },
    ],
    total_amount: 750.0,
    status: "RECEIVED",
    purchase_date: "2024-01-15",
    received_date: "2024-01-16",
  },
  {
    id: "PO-002",
    supplier_name: "PharmaDist Ltd.",
    invoice_number: "INV-2024-002",
    items: [{ name: "Vitamin C 1000mg", quantity: 200, cost_price: 6.0 }],
    total_amount: 1200.0,
    status: "PENDING",
    purchase_date: "2024-01-14",
    received_date: null,
  },
  {
    id: "PO-003",
    supplier_name: "HealthCare Supplies",
    invoice_number: "INV-2024-003",
    items: [
      { name: "Ibuprofen 400mg", quantity: 75, cost_price: 5.0 },
      { name: "Omeprazole 20mg", quantity: 30, cost_price: 10.0 },
    ],
    total_amount: 975.0,
    status: "CANCELLED",
    purchase_date: "2024-01-13",
    received_date: null,
  },
];

export default function PurchasesPage() {
  const { isLoading: authLoading } = useAuth(true);
  const [search, setSearch] = useState("");
  const [purchases] = useState(mockPurchases);
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  const filteredPurchases = purchases.filter(
    (p) =>
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.supplier_name.toLowerCase().includes(search.toLowerCase()) ||
      p.status.toLowerCase().includes(search.toLowerCase()),
  );

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

  if (authLoading) return <LoadingSpinner />;

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
                  {formatCurrency(
                    purchases.reduce((s, p) => s + p.total_amount, 0),
                  )}
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
                  {purchases.filter((p) => p.status === "PENDING").length}
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
                      {filteredPurchases.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-8 text-gray-400"
                          >
                            <Search className="h-12 w-12 mx-auto mb-2" />
                            <p>No purchase orders found</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredPurchases.map((p) => (
                          <TableRow key={p.id}>
                            <TableCell className="font-medium text-sm">
                              {p.id}
                            </TableCell>
                            <TableCell className="text-sm">
                              {p.supplier_name}
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
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedPurchase(p)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
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
                  <p className="font-medium">{selectedPurchase.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Supplier</p>
                  <p className="font-medium">
                    {selectedPurchase.supplier_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  {getStatusBadge(selectedPurchase.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Items</p>
                  <div className="mt-2 space-y-2">
                    {selectedPurchase.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span className="text-gray-500">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(selectedPurchase.total_amount)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Eye className="h-12 w-12 mx-auto mb-2" />
                <p>Select an order to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
