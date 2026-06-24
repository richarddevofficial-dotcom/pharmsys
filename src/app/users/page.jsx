"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Users,
  Shield,
  UserCheck,
  UserX,
  Edit,
  Trash2,
  Mail,
  Phone,
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

const initialUsers = [
  {
    id: 1,
    first_name: "John",
    last_name: "Admin",
    username: "admin",
    email: "admin@pharmacy.com",
    phone: "+1 234-567-8900",
    role: "SUPER_ADMIN",
    is_active: true,
    last_login: "2024-01-15T14:30:00",
  },
  {
    id: 2,
    first_name: "Jane",
    last_name: "Smith",
    username: "pharmacist",
    email: "jane@pharmacy.com",
    phone: "+1 234-567-8901",
    role: "PHARMACIST",
    is_active: true,
    last_login: "2024-01-15T11:00:00",
  },
  {
    id: 3,
    first_name: "Bob",
    last_name: "Johnson",
    username: "cashier",
    email: "bob@pharmacy.com",
    phone: "+1 234-567-8902",
    role: "CASHIER",
    is_active: true,
    last_login: "2024-01-15T09:15:00",
  },
  {
    id: 4,
    first_name: "Alice",
    last_name: "Williams",
    username: "manager",
    email: "alice@pharmacy.com",
    phone: "+1 234-567-8903",
    role: "STORE_MANAGER",
    is_active: false,
    last_login: "2024-01-10T16:45:00",
  },
];

export default function UsersPage() {
  const { isLoading: authLoading } = useAuth(true);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState(initialUsers);
  const [deleteId, setDeleteId] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "",
  });

  const getRoleBadge = (role) => {
    const roles = {
      SUPER_ADMIN: {
        label: "Super Admin",
        color: "bg-purple-100 text-purple-800",
      },
      PHARMACIST: { label: "Pharmacist", color: "bg-blue-100 text-blue-800" },
      CASHIER: { label: "Cashier", color: "bg-green-100 text-green-800" },
      STORE_MANAGER: {
        label: "Store Manager",
        color: "bg-orange-100 text-orange-800",
      },
    };
    return roles[role] || { label: role, color: "bg-gray-100 text-gray-800" };
  };

  const toggleUserStatus = (id) => {
    setUsers(
      users.map((u) => (u.id === id ? { ...u, is_active: !u.is_active } : u)),
    );
    toast.success("Status updated!");
  };

  // Open edit modal
  const handleEditClick = (user) => {
    setEditingUser(user.id);
    setEditForm({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  };

  // Save edited user
  const handleSaveEdit = () => {
    setUsers(
      users.map((u) => (u.id === editingUser ? { ...u, ...editForm } : u)),
    );
    toast.success("User updated successfully!");
    setEditingUser(null);
  };

  // Delete user
  const handleDelete = () => {
    setUsers(users.filter((u) => u.id !== deleteId));
    toast.success("User deleted successfully!");
    setDeleteId(null);
  };

  const filteredUsers = users.filter(
    (u) =>
      `${u.first_name} ${u.last_name}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  if (authLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "User Management" }]} />
      <PageHeader
        title="User Management"
        description="Manage system users and their roles"
        backUrl="/dashboard"
        actions={
          <Link href="/users/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {users.filter((u) => u.is_active).length}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Inactive</p>
                <p className="text-2xl font-bold text-red-600">
                  {users.filter((u) => !u.is_active).length}
                </p>
              </div>
              <UserX className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Roles</p>
                <p className="text-2xl font-bold">4</p>
              </div>
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle>All Users</CardTitle>
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
            <div className="min-w-[600px] md:min-w-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-gray-400"
                      >
                        <Search className="h-12 w-12 mx-auto mb-2" />
                        <p>No users found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((u) => {
                      const rb = getRoleBadge(u.role);
                      return (
                        <TableRow key={u.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="font-bold text-blue-600 text-xs">
                                  {u.first_name[0]}
                                  {u.last_name[0]}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-sm">
                                  {u.first_name} {u.last_name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  @{u.username}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3 text-gray-400" />
                                <span className="text-xs">{u.email}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3 text-gray-400" />
                                <span className="text-xs">{u.phone}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`text-xs ${rb.color}`}>
                              {rb.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <button
                              onClick={() => toggleUserStatus(u.id)}
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${u.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                            >
                              {u.is_active ? "Active" : "Inactive"}
                            </button>
                          </TableCell>
                          <TableCell className="text-sm text-gray-500 whitespace-nowrap">
                            {new Date(u.last_login).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditClick(u)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteId(u.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">First Name</label>
                  <Input
                    value={editForm.first_name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, first_name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Last Name</label>
                  <Input
                    value={editForm.last_name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, last_name: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <select
                  value={editForm.role}
                  onChange={(e) =>
                    setEditForm({ ...editForm, role: e.target.value })
                  }
                  className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm"
                >
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="PHARMACIST">Pharmacist</option>
                  <option value="CASHIER">Cashier</option>
                  <option value="STORE_MANAGER">Store Manager</option>
                </select>
              </div>
              <div className="flex gap-3 pt-3">
                <Button onClick={handleSaveEdit} className="flex-1">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditingUser(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message="Are you sure you want to delete this user?"
      />
    </div>
  );
}
