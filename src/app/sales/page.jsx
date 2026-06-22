"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { ShoppingCart, TrendingUp, DollarSign, Package } from "lucide-react"; // ← ADD THIS

// ... rest of the code

// Mock sales data
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
];

export default function SalesPage() {
  const { isLoading: authLoading } = useAuth(true);
  const [sales] = useState(mockSales);

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total_amount, 0);

  if (authLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sales History</h1>
        <p className="text-gray-500 mt-1">View all sales transactions</p>
      </div>

      {/* Summary Cards */}
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Today's Sales</p>
                <p className="text-2xl font-bold">{sales.length}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-500" />
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
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Average Sale</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalRevenue / sales.length)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Items Sold</p>
                <p className="text-2xl font-bold">
                  {sales.reduce((sum, sale) => sum + sale.items_count, 0)}
                </p>
              </div>
              <Package className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Date & Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">#{sale.id}</TableCell>
                  <TableCell>{sale.customer_name}</TableCell>
                  <TableCell>{sale.items_count} items</TableCell>
                  <TableCell className="font-bold">
                    {formatCurrency(sale.total_amount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{sale.payment_method}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {formatDateTime(sale.created_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
