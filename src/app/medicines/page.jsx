"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { medicineService } from "@/services/medicineService";
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
import { exportToCSV } from "@/utils/exportUtils";
import Link from "next/link";
import toast from "react-hot-toast";

export default function MedicinesPage() {
  const { isLoading: authLoading } = useAuth(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const queryClient = useQueryClient();

  // Debounce search - waits 300ms before searching
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch medicines from API with page_size=1000 to get all
  const { data: apiResponse, isLoading: medicinesLoading } = useQuery({
    queryKey: ["medicines", search],
    queryFn: () => medicineService.getAll({ search }),
    keepPreviousData: true,
  });

  const medicines =
    apiResponse?.data?.results ||
    apiResponse?.results ||
    apiResponse?.data ||
    [];
  const filteredMedicines = Array.isArray(medicines) ? medicines : [];

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => medicineService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["medicines"]);
      toast.success("Medicine deleted!");
      setDeleteId(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || "Failed to delete");
      setDeleteId(null);
    },
  });

  const handleDelete = () => {
    if (deleteId) deleteMutation.mutate(deleteId);
  };

  // DOWNLOAD TEMPLATE
  const handleDownloadTemplate = () => {
    const template = [
      "Name,Generic Name,Brand,Batch Number,Manufacturer,Cost Price,Selling Price,Quantity,Min Stock,Expiry Date",
      "Paracetamol 500mg,Paracetamol,Panadol,BATCH-001,GSK,100,500,100,20,2025-12-31",
      "Amoxicillin 250mg,Amoxicillin,Amoxil,BATCH-002,Pfizer,200,1200,50,15,2025-06-30",
      "Ibuprofen 400mg,Ibuprofen,Brufen,BATCH-003,GSK,150,800,75,25,2025-08-15",
    ].join("\n");
    const blob = new Blob([template], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "medicine_import_template.csv";
    link.click();
    toast.success("Template downloaded!");
  };

  // IMPORT WITH INVENTORY LOGS
  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      toast.loading("Importing medicines...");
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const text = event.target.result;
          const lines = text.split("\n");
          const headers = lines[0]
            .split(",")
            .map((h) => h.trim().replace(/"/g, ""));
          let imported = 0;
          let errors = 0;

          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const values = lines[i]
              .split(",")
              .map((v) => v.trim().replace(/"/g, ""));
            const row = {};
            headers.forEach((header, index) => {
              row[header] = values[index];
            });

            try {
              const medData = {
                name: row["Name"] || row["name"] || "",
                generic_name: row["Generic Name"] || row["generic_name"] || "",
                brand: row["Brand"] || row["brand"] || "",
                batch_number:
                  row["Batch Number"] ||
                  row["batch_number"] ||
                  `BATCH-${Date.now()}-${i}`,
                manufacturer: row["Manufacturer"] || row["manufacturer"] || "",
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
              };

              // Save medicine to database
              await medicineService.create(medData);

              // Create inventory log automatically
              try {
                await api.post("/inventory/", {
                  medicine_name: medData.name,
                  action: "STOCK_IN",
                  quantity: medData.quantity,
                  notes: `Imported from CSV - Batch: ${medData.batch_number}`,
                });
              } catch (invErr) {
                console.log("Inventory log skipped:", invErr);
              }

              imported++;
            } catch (err) {
              errors++;
              console.error("Import error:", err);
            }
          }

          if (imported > 0) {
            toast.success(
              `✅ Imported ${imported} medicines with inventory logs!`,
            );
            queryClient.invalidateQueries(["medicines"]);
            queryClient.invalidateQueries(["inventory"]);
          } else {
            toast.error("No valid data found. Check file format.");
          }
          if (errors > 0) {
            toast.error(`${errors} rows failed to import`);
          }
        } catch (error) {
          toast.error("Error reading file. Make sure it's a valid CSV.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // EXPORT
  const handleExportCSV = () => {
    if (filteredMedicines.length === 0) {
      toast.error("No data to export!");
      return;
    }
    const exportData = filteredMedicines.map((m) => ({
      Name: m.name,
      "Generic Name": m.generic_name,
      Brand: m.brand,
      "Batch Number": m.batch_number,
      Manufacturer: m.manufacturer,
      "Cost Price": m.cost_price,
      "Selling Price": m.selling_price,
      Quantity: m.quantity,
      "Min Stock": m.minimum_stock,
      "Expiry Date": m.expiry_date,
      Status:
        new Date(m.expiry_date) < new Date()
          ? "Expired"
          : parseInt(m.quantity) <= parseInt(m.minimum_stock)
            ? "Low Stock"
            : "In Stock",
    }));
    exportToCSV(
      exportData,
      `medicines-${new Date().toISOString().split("T")[0]}`,
    );
    toast.success("Exported successfully!");
  };

  // Stats calculations
  const totalValue = filteredMedicines.reduce(
    (sum, m) =>
      sum + parseFloat(m.selling_price || 0) * parseInt(m.quantity || 0),
    0,
  );
  const lowStockCount = filteredMedicines.filter(
    (m) => parseInt(m.quantity || 0) <= parseInt(m.minimum_stock || 10),
  ).length;
  const expiredCount = filteredMedicines.filter(
    (m) => new Date(m.expiry_date) < new Date(),
  ).length;

  const getStatusBadge = (medicine) => {
    if (new Date(medicine.expiry_date) < new Date())
      return <Badge variant="destructive">Expired</Badge>;
    if (
      parseInt(medicine.quantity || 0) <= parseInt(medicine.minimum_stock || 10)
    )
      return <Badge variant="warning">Low Stock</Badge>;
    return <Badge variant="success">In Stock</Badge>;
  };

  if (authLoading || medicinesLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Medicines" }]} />
      <PageHeader
        title="Medicines"
        description={`${filteredMedicines.length} medicines in inventory`}
        backUrl="/dashboard"
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadTemplate}
            >
              <Download className="h-4 w-4 mr-2" />
              Template
            </Button>
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
                <p className="text-2xl font-bold">{filteredMedicines.length}</p>
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
                  {lowStockCount}
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
                  {expiredCount}
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
                  {formatCurrency(totalValue)}
                </p>
              </div>
              <Package className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Medicine Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle>Medicine List ({filteredMedicines.length})</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search medicines..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
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
                        colSpan={7}
                        className="text-center py-8 text-gray-400"
                      >
                        <Search className="h-12 w-12 mx-auto mb-2" />
                        <p>No medicines found</p>
                        <p className="text-sm">
                          Try adjusting your search or import medicines
                        </p>
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
                        <TableCell>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {medicine.batch_number}
                          </code>
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              parseInt(medicine.quantity) <=
                              parseInt(medicine.minimum_stock)
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
