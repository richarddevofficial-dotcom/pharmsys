"use client";

import { useState } from "react";
import { useRoleAccess } from "@/hooks/useRoleAccess";
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
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Download,
  Upload,
  AlertTriangle,
  Package,
} from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import { exportToCSV, exportToExcel } from "@/utils/exportUtils";
import Link from "next/link";
import toast from "react-hot-toast";

const initialMedicines = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    generic_name: "Paracetamol",
    brand: "Panadol",
    category_name: "Pain Killers",
    supplier_name: "MedSupply Co.",
    batch_number: "BATCH-001",
    cost_price: 3.5,
    selling_price: 5.99,
    quantity: 150,
    minimum_stock: 20,
    expiry_date: "2025-12-31",
    is_low_stock: false,
    is_expired: false,
  },
  {
    id: 2,
    name: "Amoxicillin 250mg",
    generic_name: "Amoxicillin",
    brand: "Amoxil",
    category_name: "Antibiotics",
    supplier_name: "PharmaDist Ltd.",
    batch_number: "BATCH-002",
    cost_price: 8.0,
    selling_price: 12.5,
    quantity: 8,
    minimum_stock: 15,
    expiry_date: "2024-08-15",
    is_low_stock: true,
    is_expired: false,
  },
  {
    id: 3,
    name: "Ibuprofen 400mg",
    generic_name: "Ibuprofen",
    brand: "Brufen",
    category_name: "Pain Killers",
    supplier_name: "MedSupply Co.",
    batch_number: "BATCH-003",
    cost_price: 5.0,
    selling_price: 8.99,
    quantity: 75,
    minimum_stock: 25,
    expiry_date: "2025-06-20",
    is_low_stock: false,
    is_expired: false,
  },
  {
    id: 4,
    name: "Omeprazole 20mg",
    generic_name: "Omeprazole",
    brand: "Losec",
    category_name: "Gastrointestinal",
    supplier_name: "HealthCare Supplies",
    batch_number: "BATCH-004",
    cost_price: 10.0,
    selling_price: 15.0,
    quantity: 5,
    minimum_stock: 30,
    expiry_date: "2024-03-01",
    is_low_stock: true,
    is_expired: true,
  },
  {
    id: 5,
    name: "Vitamin C 1000mg",
    generic_name: "Ascorbic Acid",
    brand: "C-Rose",
    category_name: "Vitamins",
    supplier_name: "NutriVita Inc.",
    batch_number: "BATCH-005",
    cost_price: 6.0,
    selling_price: 10.99,
    quantity: 90,
    minimum_stock: 20,
    expiry_date: "2026-01-15",
    is_low_stock: false,
    is_expired: false,
  },
];

export default function MedicinesPage() {
  const { isLoading: authLoading } = useAuth(true);
  useRoleAccess();
  const [search, setSearch] = useState("");
  const [medicines, setMedicines] = useState(initialMedicines);
  const [deleteId, setDeleteId] = useState(null);

  const filteredMedicines = medicines.filter(
    (med) =>
      med.name.toLowerCase().includes(search.toLowerCase()) ||
      med.generic_name.toLowerCase().includes(search.toLowerCase()) ||
      med.batch_number.toLowerCase().includes(search.toLowerCase()) ||
      med.category_name?.toLowerCase().includes(search.toLowerCase()),
  );

  const getStatusBadge = (medicine) => {
    if (medicine.is_expired)
      return <Badge variant="destructive">Expired</Badge>;
    if (medicine.is_low_stock)
      return <Badge variant="warning">Low Stock</Badge>;
    return <Badge variant="success">In Stock</Badge>;
  };

  // DELETE medicine
  const handleDelete = () => {
    setMedicines(medicines.filter((m) => m.id !== deleteId));
    toast.success("Medicine deleted successfully!");
    setDeleteId(null);
  };

  // EXPORT to CSV
  const handleExportCSV = () => {
    if (filteredMedicines.length === 0) {
      toast.error("No data to export!");
      return;
    }
    const exportData = filteredMedicines.map((m) => ({
      Name: m.name,
      "Generic Name": m.generic_name,
      Brand: m.brand,
      Category: m.category_name,
      Supplier: m.supplier_name,
      "Batch Number": m.batch_number,
      "Cost Price": m.cost_price,
      "Selling Price": m.selling_price,
      Quantity: m.quantity,
      "Min Stock": m.minimum_stock,
      "Expiry Date": m.expiry_date,
      Status: m.is_expired
        ? "Expired"
        : m.is_low_stock
          ? "Low Stock"
          : "In Stock",
    }));
    exportToCSV(
      exportData,
      `medicines-export-${new Date().toISOString().split("T")[0]}`,
    );
    toast.success("Exported to CSV successfully!");
  };

  // EXPORT to Excel
  const handleExportExcel = () => {
    if (filteredMedicines.length === 0) {
      toast.error("No data to export!");
      return;
    }
    const exportData = filteredMedicines.map((m) => ({
      Name: m.name,
      "Generic Name": m.generic_name,
      Brand: m.brand,
      Category: m.category_name,
      Supplier: m.supplier_name,
      "Batch Number": m.batch_number,
      "Cost Price": m.cost_price,
      "Selling Price": m.selling_price,
      Quantity: m.quantity,
      "Min Stock": m.minimum_stock,
      "Expiry Date": m.expiry_date,
      Status: m.is_expired
        ? "Expired"
        : m.is_low_stock
          ? "Low Stock"
          : "In Stock",
    }));
    exportToExcel(
      exportData,
      `medicines-export-${new Date().toISOString().split("T")[0]}`,
    );
    toast.success("Exported to Excel successfully!");
  };

  // IMPORT from CSV
  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target.result;
          const lines = text.split("\n");
          const headers = lines[0]
            .split(",")
            .map((h) => h.trim().replace(/"/g, ""));

          const newMedicines = [];
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const values = lines[i]
              .split(",")
              .map((v) => v.trim().replace(/"/g, ""));
            const row = {};
            headers.forEach((header, index) => {
              row[header] = values[index];
            });

            newMedicines.push({
              id: Date.now() + i,
              name: row["Name"] || row["name"] || "",
              generic_name: row["Generic Name"] || row["generic_name"] || "",
              brand: row["Brand"] || row["brand"] || "",
              category_name: row["Category"] || row["category_name"] || "",
              supplier_name: row["Supplier"] || row["supplier_name"] || "",
              batch_number:
                row["Batch Number"] ||
                row["batch_number"] ||
                `BATCH-${Date.now()}`,
              cost_price: parseFloat(
                row["Cost Price"] || row["cost_price"] || 0,
              ),
              selling_price: parseFloat(
                row["Selling Price"] || row["selling_price"] || 0,
              ),
              quantity: parseInt(row["Quantity"] || row["quantity"] || 0),
              minimum_stock: parseInt(
                row["Min Stock"] || row["minimum_stock"] || 10,
              ),
              expiry_date:
                row["Expiry Date"] || row["expiry_date"] || "2025-12-31",
              is_low_stock: false,
              is_expired: false,
            });
          }

          if (newMedicines.length > 0) {
            setMedicines([...medicines, ...newMedicines]);
            toast.success(`Imported ${newMedicines.length} medicines!`);
          } else {
            toast.error("No valid data found in file");
          }
        } catch (error) {
          toast.error("Error reading file. Please check the format.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  if (authLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Medicines" }]} />

      <PageHeader
        title="Medicines"
        description="Manage your medicine inventory"
        backUrl="/dashboard"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={handleImport}>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Link href="/medicines/add">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Medicine
              </Button>
            </Link>
          </>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Medicines</p>
                <p className="text-2xl font-bold">{medicines.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {medicines.filter((m) => m.is_low_stock).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Expired</p>
                <p className="text-2xl font-bold text-red-600">
                  {medicines.filter((m) => m.is_expired).length}
                </p>
              </div>
              <Trash2 className="h-8 w-8 text-red-500" />
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
                    medicines.reduce(
                      (sum, m) => sum + m.selling_price * m.quantity,
                      0,
                    ),
                  )}
                </p>
              </div>
              <Package className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Medicine List Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle>Medicine List</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search medicines..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="min-w-[800px] md:min-w-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medicine</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMedicines.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-gray-400"
                      >
                        <Search className="h-12 w-12 mx-auto mb-2" />
                        <p>No medicines found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMedicines.map((medicine) => (
                      <TableRow key={medicine.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">
                              {medicine.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {medicine.generic_name}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {medicine.category_name}
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {medicine.batch_number}
                          </code>
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              medicine.is_low_stock
                                ? "text-red-600 font-bold text-sm"
                                : "text-sm"
                            }
                          >
                            {medicine.quantity}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">
                              {formatCurrency(medicine.selling_price)}
                            </p>
                            <p className="text-xs text-gray-500">
                              Cost: {formatCurrency(medicine.cost_price)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm whitespace-nowrap">
                          {formatDate(medicine.expiry_date)}
                        </TableCell>
                        <TableCell>{getStatusBadge(medicine)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Link href={`/medicines/${medicine.id}/edit`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteId(medicine.id)}
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

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Medicine"
        message="Are you sure you want to delete this medicine?"
      />
    </div>
  );
}
