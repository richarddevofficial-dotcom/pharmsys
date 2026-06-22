'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  Plus,
  Search,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

// Mock purchases
const mockPurchases = [
  {
    id: 'PO-001',
    supplier_name: 'MedSupply Co.',
    invoice_number: 'INV-2024-001',
    items: [
      { name: 'Paracetamol 500mg', quantity: 100, cost_price: 3.50 },
      { name: 'Amoxicillin 250mg', quantity: 50, cost_price: 8.00 },
    ],
    total_amount: 750.00,
    status: 'RECEIVED',
    purchase_date: '2024-01-15',
    received_date: '2024-01-16',
  },
  {
    id: 'PO-002',
    supplier_name: 'PharmaDist Ltd.',
    invoice_number: 'INV-2024-002',
    items: [
      { name: 'Vitamin C 1000mg', quantity: 200, cost_price: 6.00 },
    ],
    total_amount: 1200.00,
    status: 'PENDING',
    purchase_date: '2024-01-14',
    received_date: null,
  },
  {
    id: 'PO-003',
    supplier_name: 'HealthCare Supplies',
    invoice_number: 'INV-2024-003',
    items: [
      { name: 'Ibuprofen 400mg', quantity: 75, cost_price: 5.00 },
      { name: 'Omeprazole 20mg', quantity: 30, cost_price: 10.00 },
      { name: 'Cetirizine 10mg', quantity: 60, cost_price: 4.50 },
    ],
    total_amount: 975.00,
    status: 'CANCELLED',
    purchase_date: '2024-01-13',
    received_date: null,
  },
];

export default function PurchasesPage() {
  const { isLoading: authLoading } = useAuth(true);
  const [search, setSearch] = useState('');
  const [purchases] = useState(mockPurchases);
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'RECEIVED':
        return <Badge variant="success"><CheckCircle className="h-3 w-3 mr-1" />Received</Badge>;
      case 'PENDING':
        return <Badge variant="warning"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const totalPurchases = purchases.reduce((sum, p) => sum + p.total_amount, 0);
  const pendingOrders = purchases.filter(p => p.status === 'PENDING').length;

  if (authLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Purchase Orders</h1>
          <p className="text-gray-500 mt-1">Manage purchase orders from suppliers</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Purchase Order
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold">{purchases.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Value</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPurchases)}</p>
              </div>
              <Truck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Orders</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>