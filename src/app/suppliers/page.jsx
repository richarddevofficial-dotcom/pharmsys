"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  Truck,
  Edit,
  Trash2,
  Package, // ← ADD THIS LINE
  Clock, // ← ADD THIS LINE
} from "lucide-react";

// ... rest of the code stays the same

// Mock suppliers data
const mockSuppliers = [
  {
    id: 1,
    name: "MedSupply Co.",
    contact_person: "Robert Brown",
    phone: "+1 234-567-8901",
    email: "robert@medsupply.com",
    address: "123 Healthcare Ave, Medical District, NY 10001",
    total_orders: 45,
    active_since: "2020-03-15",
  },
  {
    id: 2,
    name: "PharmaDist Ltd.",
    contact_person: "Sarah Johnson",
    phone: "+1 234-567-8902",
    email: "sarah@pharmadist.com",
    address: "456 Industry Blvd, Business Park, CA 90210",
    total_orders: 32,
    active_since: "2019-06-20",
  },
  {
    id: 3,
    name: "HealthCare Supplies",
    contact_person: "Michael Lee",
    phone: "+1 234-567-8903",
    email: "michael@healthcaresupplies.com",
    address: "789 Medical Dr, Health City, TX 75001",
    total_orders: 28,
    active_since: "2021-01-10",
  },
];

export default function SuppliersPage() {
  const { isLoading: authLoading } = useAuth(true);
  const [search, setSearch] = useState("");
  const [suppliers] = useState(mockSuppliers);

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(search.toLowerCase()) ||
      supplier.contact_person.toLowerCase().includes(search.toLowerCase()) ||
      supplier.email.toLowerCase().includes(search.toLowerCase()),
  );

  if (authLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Suppliers</h1>
          <p className="text-gray-500 mt-1">
            Manage your suppliers and vendors
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Suppliers</p>
                <p className="text-2xl font-bold">{suppliers.length}</p>
              </div>
              <Truck className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold">
                  {suppliers.reduce((sum, s) => sum + s.total_orders, 0)}
                </p>
              </div>
              <Package className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Since</p>
                <p className="text-2xl font-bold">2019</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Suppliers Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Supplier List</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search suppliers..."
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
                <TableHead>Supplier</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Total Orders</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{supplier.name}</p>
                      <p className="text-xs text-gray-500">
                        Since {supplier.active_since}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {supplier.contact_person}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3 text-gray-400" />
                        {supplier.phone}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3 text-gray-400" />
                        {supplier.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-1 text-sm">
                      <MapPin className="h-3 w-3 text-gray-400 mt-1 flex-shrink-0" />
                      <span>{supplier.address}</span>
                    </div>
                  </TableCell>
                  <TableCell>{supplier.total_orders}</TableCell>
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
