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
  Plus,
  Search,
  Edit,
  Trash2,
  Download,
  Upload,
  AlertTriangle,
  Package,
} from "lucide-react";
import { formatDate, formatCurrency, getStatusColor } from "@/lib/utils";
import Link from "next/link";

// Mock data
const mockMedicines = [
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
  const [search, setSearch] = useState("");
  const [medicines] = useState(mockMedicines);

  const filteredMedicines = medicines.filter(
    (med) =>
      med.name.toLowerCase().includes(search.toLowerCase()) ||
      med.generic_name.toLowerCase().includes(search.toLowerCase()) ||
      med.batch_number.toLowerCase().includes(search.toLowerCase()),
  );

  const getStatusBadge = (medicine) => {
    if (medicine.is_expired) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    if (medicine.is_low_stock) {
      return <Badge variant="warning">Low Stock</Badge>;
    }
    return <Badge variant="success">In Stock</Badge>;
  };

  if (authLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Medicines</h1>
          <p className="text-gray-500 mt-1">Manage your medicine inventory</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Link href="/medicines/add">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Medicine
            </Button>
          </Link>
        </div>
      </div>

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

      {/* Search and Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Medicine List</CardTitle>
            <div className="relative w-64">
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medicine</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMedicines.map((medicine) => (
                <TableRow key={medicine.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{medicine.name}</p>
                      <p className="text-sm text-gray-500">
                        {medicine.generic_name}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{medicine.category_name}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {medicine.batch_number}
                    </code>
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        medicine.is_low_stock ? "text-red-600 font-bold" : ""
                      }
                    >
                      {medicine.quantity}
                    </span>
                    {medicine.is_low_stock && (
                      <p className="text-xs text-red-500">
                        Min: {medicine.minimum_stock}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {formatCurrency(medicine.selling_price)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Cost: {formatCurrency(medicine.cost_price)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(medicine.expiry_date)}</TableCell>
                  <TableCell>{getStatusBadge(medicine)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
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
