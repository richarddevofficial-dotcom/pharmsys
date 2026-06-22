"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
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
  Package,
  ArrowUpCircle,
  ArrowDownCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { formatDate, formatDateTime } from "@/lib/utils";

// Mock inventory logs
const mockLogs = [
  {
    id: 1,
    medicine_name: "Paracetamol 500mg",
    action: "STOCK_IN",
    quantity: 100,
    user_name: "John Admin",
    created_at: "2024-01-15T10:30:00",
    notes: "New shipment received",
  },
  {
    id: 2,
    medicine_name: "Amoxicillin 250mg",
    action: "STOCK_OUT",
    quantity: 5,
    user_name: "Jane Smith",
    created_at: "2024-01-15T11:00:00",
    notes: "Sale #1001",
  },
  {
    id: 3,
    medicine_name: "Ibuprofen 400mg",
    action: "STOCK_IN",
    quantity: 50,
    user_name: "John Admin",
    created_at: "2024-01-14T09:00:00",
    notes: "Purchase order #PO-001",
  },
  {
    id: 4,
    medicine_name: "Omeprazole 20mg",
    action: "STOCK_OUT",
    quantity: 2,
    user_name: "Bob Johnson",
    created_at: "2024-01-14T14:30:00",
    notes: "Sale #1002",
  },
  {
    id: 5,
    medicine_name: "Vitamin C 1000mg",
    action: "ADJUSTMENT",
    quantity: -3,
    user_name: "Alice Williams",
    created_at: "2024-01-14T16:00:00",
    notes: "Expired stock removed",
  },
];

export default function InventoryPage() {
  const { isLoading: authLoading } = useAuth(true);
  const [logs] = useState(mockLogs);

  const getActionIcon = (action) => {
    switch (action) {
      case "STOCK_IN":
        return <ArrowUpCircle className="h-5 w-5 text-green-500" />;
      case "STOCK_OUT":
        return <ArrowDownCircle className="h-5 w-5 text-red-500" />;
      case "ADJUSTMENT":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const getActionBadge = (action) => {
    switch (action) {
      case "STOCK_IN":
        return <Badge variant="success">Stock In</Badge>;
      case "STOCK_OUT":
        return <Badge variant="destructive">Stock Out</Badge>;
      case "ADJUSTMENT":
        return <Badge variant="warning">Adjustment</Badge>;
      default:
        return <Badge>{action}</Badge>;
    }
  };

  if (authLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <p className="text-gray-500 mt-1">
          Track stock movements and adjustments
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <ArrowUpCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Stock In</p>
                <p className="text-sm text-gray-500">Add new stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <ArrowDownCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="font-medium">Stock Out</p>
                <p className="text-sm text-gray-500">Remove stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium">Adjust Stock</p>
                <p className="text-sm text-gray-500">Manual adjustment</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Logs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Inventory Logs</CardTitle>
            <Button variant="outline" size="sm">
              View All Logs
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Medicine</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getActionIcon(log.action)}
                      {getActionBadge(log.action)}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {log.medicine_name}
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        log.quantity > 0 ? "text-green-600" : "text-red-600"
                      }
                    >
                      {log.quantity > 0 ? "+" : ""}
                      {log.quantity}
                    </span>
                  </TableCell>
                  <TableCell>{log.user_name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      {formatDateTime(log.created_at)}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500">{log.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
