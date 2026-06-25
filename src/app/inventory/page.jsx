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
import { Label } from "@/components/ui/label";
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
  Search,
  X,
  Save,
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import toast from "react-hot-toast";

export default function InventoryPage() {
  const { isLoading: authLoading } = useAuth(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formAction, setFormAction] = useState("STOCK_IN");
  const [formData, setFormData] = useState({
    medicine_name: "",
    quantity: "",
    notes: "",
  });
  const queryClient = useQueryClient();

  const {
    data: apiResponse,
    isLoading: logsLoading,
    refetch,
  } = useQuery({
    queryKey: ["inventory"],
    queryFn: async () => {
      const response = await api.get("/inventory/");
      return response.data;
    },
  });

  // CORRECTED: Extract results from the paginated response
  const logs = apiResponse?.results || [];

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/inventory/", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["inventory"]);
      toast.success(`${formAction.replace("_", " ")} recorded!`);
      setShowForm(false);
      setFormData({ medicine_name: "", quantity: "", notes: "" });
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || "Failed to record");
    },
  });

  const openForm = (action) => {
    setFormAction(action);
    setFormData({ medicine_name: "", quantity: "", notes: "" });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.medicine_name || !formData.quantity) {
      toast.error("Please fill all required fields");
      return;
    }
    createMutation.mutate({
      medicine_name: formData.medicine_name,
      action: formAction,
      quantity:
        formAction === "STOCK_OUT"
          ? -Math.abs(parseInt(formData.quantity))
          : parseInt(formData.quantity),
      notes: formData.notes,
    });
  };

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

  if (authLoading || logsLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Inventory" }]} />
      <PageHeader
        title="Inventory Management"
        description="Track stock movements and adjustments"
        backUrl="/dashboard"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-green-500"
          onClick={() => openForm("STOCK_IN")}
        >
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
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-red-500"
          onClick={() => openForm("STOCK_OUT")}
        >
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
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-yellow-500"
          onClick={() => openForm("ADJUSTMENT")}
        >
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

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                {formAction === "STOCK_IN"
                  ? "Stock In"
                  : formAction === "STOCK_OUT"
                    ? "Stock Out"
                    : "Adjust Stock"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Medicine Name *</Label>
                <Input
                  value={formData.medicine_name}
                  onChange={(e) =>
                    setFormData({ ...formData, medicine_name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Quantity *</Label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={2}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={createMutation.isLoading}
                >
                  {createMutation.isLoading ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle>Inventory Logs ({logs.length})</CardTitle>
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
                    <TableHead>Action</TableHead>
                    <TableHead>Medicine</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-gray-400"
                      >
                        <Package className="h-12 w-12 mx-auto mb-2" />
                        <p>No inventory logs yet</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getActionIcon(log.action)}
                            {getActionBadge(log.action)}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-sm">
                          {log.medicine_name}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`text-sm font-medium ${log.quantity > 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {log.quantity > 0 ? "+" : ""}
                            {log.quantity}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm whitespace-nowrap">
                          <Clock className="h-3 w-3 inline mr-1 text-gray-400" />
                          {formatDateTime(log.created_at)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {log.notes || "-"}
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
