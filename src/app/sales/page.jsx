"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  Search,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Package,
} from "lucide-react";

const mockSales = [
  {
    id: 1001,
    customer_name: "Walk-in Customer",
    total_amount: 25.5,
    payment_method: "Cash",
    items_count: 3,
    created_at: "2024-01-15T14:30:00",
  },
  {
    id: 1002,
    customer_name: "John Doe",
    total_amount: 45.0,
    payment_method: "Card",
    items_count: 2,
    created_at: "2024-01-15T13:15:00",
  },
  {
    id: 1003,
    customer_name: "Jane Smith",
    total_amount: 18.99,
    payment_method: "Mobile Money",
    items_count: 1,
    created_at: "2024-01-15T12:00:00",
  },
  {
    id: 1004,
    customer_name: "Walk-in Customer",
    total_amount: 67.5,
    payment_method: "Cash",
    items_count: 5,
    created_at: "2024-01-15T10:45:00",
  },
  {
    id: 1005,
    customer_name: "Bob Wilson",
    total_amount: 32.25,
    payment_method: "Bank Transfer",
    items_count: 2,
    created_at: "2024-01-15T09:30:00",
  },
  {
    id: 1006,
    customer_name: "Alice Brown",
    total_amount: 89.99,
    payment_method: "Card",
    items_count: 4,
    created_at: "2024-01-14T16:20:00",
  },
  {
    id: 1007,
    customer_name: "Charlie Davis",
    total_amount: 12.5,
    payment_method: "Cash",
    items_count: 1,
    created_at: "2024-01-14T15:00:00",
  },
];

export default function SalesPage() {
  const { isLoading: authLoading } = useAuth(true);
  const [sales] = useState(mockSales);
  const [search, setSearch] = useState("");

  const filteredSales = sales.filter(
    (sale) =>
      sale.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      sale.payment_method.toLowerCase().includes(search.toLowerCase()) ||
      String(sale.id).includes(search),
  );

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total_amount, 0);
  const avgSale = totalRevenue / sales.length;

  if (authLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Sales History" }]} />
      <PageHeader
        title="Sales History"
        description="View all sales transactions"
        backUrl="/dashboard"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-500">Total Sales</p>
                <p className="text-xl md:text-2xl font-bold">{sales.length}</p>
              </div>
              <ShoppingCart className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-500">Revenue</p>
                <p className="text-xl md:text-2xl font-bold text-green-600">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
              <DollarSign className="h-6 w-6 md:h-8 md:w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-500">Avg Sale</p>
                <p className="text-xl md:text-2xl font-bold">
                  {formatCurrency(avgSale)}
                </p>
              </div>
              <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-500">Items Sold</p>
                <p className="text-xl md:text-2xl font-bold">
                  {sales.reduce((sum, sale) => sum + sale.items_count, 0)}
                </p>
              </div>
              <Package className="h-6 w-6 md:h-8 md:w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle>Recent Transactions</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search sales..."
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
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-gray-400"
                      >
                        <Search className="h-12 w-12 mx-auto mb-2" />
                        <p>No sales found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium text-sm">
                          #{sale.id}
                        </TableCell>
                        <TableCell className="text-sm">
                          {sale.customer_name}
                        </TableCell>
                        <TableCell className="text-sm">
                          {sale.items_count} items
                        </TableCell>
                        <TableCell className="font-bold text-sm">
                          {formatCurrency(sale.total_amount)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="whitespace-nowrap"
                          >
                            {sale.payment_method}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500 whitespace-nowrap">
                          {formatDateTime(sale.created_at)}
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
  );
}
