"use client";

import { useState } from "react";
import { useRoleAccess } from "@/hooks/useRoleAccess";
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
  Star,
  Edit,
  Trash2,
  Users,
  ShoppingCart,
  TrendingUp,
  Clock,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import toast from "react-hot-toast";

const initialCustomers = [
  {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    phone: "+1 234-567-8901",
    email: "john@email.com",
    address: "123 Main St",
    total_purchases: 15,
    total_spent: 450.75,
    loyalty_points: 450,
    last_purchase: "2024-01-15",
  },
  {
    id: 2,
    first_name: "Jane",
    last_name: "Smith",
    phone: "+1 234-567-8902",
    email: "jane@email.com",
    address: "456 Oak Ave",
    total_purchases: 8,
    total_spent: 235.5,
    loyalty_points: 235,
    last_purchase: "2024-01-14",
  },
  {
    id: 3,
    first_name: "Bob",
    last_name: "Wilson",
    phone: "+1 234-567-8903",
    email: "bob@email.com",
    address: "789 Pine Rd",
    total_purchases: 22,
    total_spent: 890.25,
    loyalty_points: 890,
    last_purchase: "2024-01-15",
  },
  {
    id: 4,
    first_name: "Alice",
    last_name: "Brown",
    phone: "+1 234-567-8904",
    email: "alice@email.com",
    address: "321 Elm St",
    total_purchases: 5,
    total_spent: 120.0,
    loyalty_points: 120,
    last_purchase: "2024-01-10",
  },
];

export default function CustomersPage() {
  const { isLoading: authLoading } = useAuth(true);
  useRoleAccess();
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState(initialCustomers);
  const [deleteId, setDeleteId] = useState(null);

  const filteredCustomers = customers.filter(
    (c) =>
      `${c.first_name} ${c.last_name}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase()),
  );

  const totalRevenue = customers.reduce((s, c) => s + c.total_spent, 0);
  const totalPurchases = customers.reduce((s, c) => s + c.total_purchases, 0);

  const handleDelete = () => {
    setCustomers(customers.filter((c) => c.id !== deleteId));
    toast.success("Customer deleted successfully!");
    setDeleteId(null);
  };

  if (authLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Customers" }]} />
      <PageHeader
        title="Customers"
        description="Manage your customer database"
        backUrl="/dashboard"
        actions={
          <Link href="/customers/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </Link>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Customers</p>
                <p className="text-2xl font-bold">{customers.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
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
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Purchases</p>
                <p className="text-2xl font-bold">{totalPurchases}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg per Customer</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalRevenue / customers.length)}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle>Customer List</CardTitle>
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
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Purchases</TableHead>
                    <TableHead>Spent</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Last Purchase</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-gray-400"
                      >
                        <Search className="h-12 w-12 mx-auto mb-2" />
                        <p>No customers found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCustomers.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="font-bold text-blue-600 text-xs">
                                {c.first_name[0]}
                                {c.last_name[0]}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-sm">
                                {c.first_name} {c.last_name}
                              </p>
                              <p className="text-xs text-gray-500">
                                ID: #{c.id}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span className="text-xs">{c.phone}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="text-xs">{c.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-sm">
                            {c.total_purchases}
                          </span>
                        </TableCell>
                        <TableCell className="font-bold text-sm text-green-600">
                          {formatCurrency(c.total_spent)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm">{c.loyalty_points}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500 whitespace-nowrap">
                          {formatDate(c.last_purchase)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {/* Edit Button */}
                            <Link href={`/customers/${c.id}/edit`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            {/* Delete Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteId(c.id)}
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
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This action cannot be undone."
      />
    </div>
  );
}
