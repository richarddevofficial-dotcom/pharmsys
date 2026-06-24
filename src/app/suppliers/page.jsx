"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
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
  Package,
  Building2,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const initialSuppliers = [
  {
    id: 1,
    name: "MedSupply Co.",
    contact_person: "Robert Brown",
    phone: "+1 234-567-8901",
    email: "robert@medsupply.com",
    address: "123 Healthcare Ave, NY",
    total_orders: 45,
    active_since: "2020-03-15",
  },
  {
    id: 2,
    name: "PharmaDist Ltd.",
    contact_person: "Sarah Johnson",
    phone: "+1 234-567-8902",
    email: "sarah@pharmadist.com",
    address: "456 Industry Blvd, CA",
    total_orders: 32,
    active_since: "2019-06-20",
  },
  {
    id: 3,
    name: "HealthCare Supplies",
    contact_person: "Michael Lee",
    phone: "+1 234-567-8903",
    email: "michael@healthcaresupplies.com",
    address: "789 Medical Dr, TX",
    total_orders: 28,
    active_since: "2021-01-10",
  },
  {
    id: 4,
    name: "Global Pharma Inc.",
    contact_person: "Emily Davis",
    phone: "+1 234-567-8904",
    email: "emily@globalpharma.com",
    address: "321 Commerce St, FL",
    total_orders: 15,
    active_since: "2022-08-05",
  },
];

export default function SuppliersPage() {
  const { isLoading: authLoading } = useAuth(true);
  const [search, setSearch] = useState("");
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [deleteId, setDeleteId] = useState(null);

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.contact_person.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search),
  );

  const handleDelete = () => {
    setSuppliers(suppliers.filter((s) => s.id !== deleteId));
    toast.success("Supplier deleted successfully!");
    setDeleteId(null);
  };

  if (authLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Suppliers" }]} />
      <PageHeader
        title="Suppliers"
        description="Manage your suppliers and vendors"
        backUrl="/dashboard"
        actions={
          <Link href="/suppliers/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          </Link>
        }
      />
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
                  {suppliers.reduce((s, i) => s + i.total_orders, 0)}
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
                <p className="text-sm text-gray-500">Active Suppliers</p>
                <p className="text-2xl font-bold">{suppliers.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle>Supplier List</CardTitle>
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
                    <TableHead>Supplier</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Info</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-gray-400"
                      >
                        <Search className="h-12 w-12 mx-auto mb-2" />
                        <p>No suppliers found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSuppliers.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-gray-400 hidden md:block" />
                            <div>
                              <p className="font-medium text-sm">{s.name}</p>
                              <p className="text-xs text-gray-500">
                                {s.contact_person}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span className="text-xs">{s.phone}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="text-xs">{s.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-start gap-1">
                            <MapPin className="h-3 w-3 text-gray-400 mt-1" />
                            <span className="text-xs">{s.address}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-sm">
                            {s.total_orders}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {/* Edit Button - Links to edit page */}
                            <Link href={`/suppliers/${s.id}/edit`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            {/* Delete Button - Opens confirmation */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteId(s.id)}
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Supplier"
        message="Are you sure you want to delete this supplier? This action cannot be undone."
      />
    </div>
  );
}
