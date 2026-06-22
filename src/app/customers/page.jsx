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
  Phone,
  Mail,
  MapPin,
  Star,
  Edit,
  Trash2,
  Users,
  ShoppingCart,
  TrendingUp,
  Clock,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

// Mock customers
const mockCustomers = [
  {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    phone: "+1 234-567-8901",
    email: "john.doe@email.com",
    address: "123 Main St, City, State",
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
    email: "jane.smith@email.com",
    address: "456 Oak Ave, Town, State",
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
    email: "bob.wilson@email.com",
    address: "789 Pine Rd, Village, State",
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
    email: "alice.brown@email.com",
    address: "321 Elm St, City, State",
    total_purchases: 5,
    total_spent: 120.0,
    loyalty_points: 120,
    last_purchase: "2024-01-10",
  },
];

export default function CustomersPage() {
  const { isLoading: authLoading } = useAuth(true);
  const [search, setSearch] = useState("");
  const [customers] = useState(mockCustomers);

  const filteredCustomers = customers.filter(
    (customer) =>
      `${customer.first_name} ${customer.last_name}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      customer.phone.includes(search) ||
      customer.email.toLowerCase().includes(search.toLowerCase()),
  );

  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.total_spent, 0);
  const totalPurchases = customers.reduce(
    (sum, c) => sum + c.total_purchases,
    0,
  );

  if (authLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-gray-500 mt-1">Manage your customer database</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Customers</p>
                <p className="text-2xl font-bold">{totalCustomers}</p>
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
                <p className="text-sm text-gray-500">Avg. per Customer</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalRevenue / totalCustomers)}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Customer List</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search customers..."
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
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Purchases</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Loyalty Points</TableHead>
                <TableHead>Last Purchase</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-blue-600">
                          {customer.first_name[0]}
                          {customer.last_name[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">
                          {customer.first_name} {customer.last_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          ID: #{customer.id}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span className="text-xs">{customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span className="text-xs">{customer.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {customer.total_purchases}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">orders</span>
                  </TableCell>
                  <TableCell className="font-bold text-green-600">
                    {formatCurrency(customer.total_spent)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">
                        {customer.loyalty_points}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-3 w-3" />
                      {formatDate(customer.last_purchase)}
                    </div>
                  </TableCell>
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
