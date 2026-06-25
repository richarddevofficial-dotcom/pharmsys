"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Package,
  Download,
  Calendar,
  Filter,
  X,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { exportToCSV } from "@/utils/exportUtils";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#f97316", "#ea580c", "#fdba74", "#c2410c", "#9a3412"];

export default function ReportsPage() {
  const { isLoading: authLoading } = useAuth(true);
  const [dateRange, setDateRange] = useState("week");
  const [generatedReport, setGeneratedReport] = useState(null);

  // Fetch dashboard stats
  const { data: dashboardData } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await api.get("/reports/dashboard/");
      return res.data;
    },
  });

  // Fetch medicines for reports
  const { data: medsData } = useQuery({
    queryKey: ["medicines-report"],
    queryFn: async () => {
      const res = await api.get("/medicines/");
      return res.data;
    },
  });

  // Fetch sales for reports
  const { data: salesData } = useQuery({
    queryKey: ["sales-report"],
    queryFn: async () => {
      const res = await api.get("/sales/");
      return res.data;
    },
  });

  const stats = dashboardData || {};
  const medicines = medsData?.results || [];
  const sales = salesData?.results || [];

  const weeklySales = stats.weekly_sales || [
    { day: "Mon", sales: 0 },
    { day: "Tue", sales: 0 },
    { day: "Wed", sales: 0 },
    { day: "Thu", sales: 0 },
    { day: "Fri", sales: 0 },
    { day: "Sat", sales: 0 },
    { day: "Sun", sales: 0 },
  ];
  const topMedicines = stats.top_medicines || [];
  const totalRevenue = sales.reduce(
    (s, sale) => s + parseFloat(sale.total_amount || 0),
    0,
  );

  const generateSalesReport = () => {
    const reportData = sales
      .slice(0, 10)
      .map((s) => [
        `#${s.id}`,
        s.customer_name || "Walk-in",
        `${s.items?.length || 0} items`,
        formatCurrency(s.total_amount),
        s.payment_method,
        s.currency || "SSP",
        new Date(s.created_at).toLocaleDateString(),
      ]);
    setGeneratedReport({
      title: "Sales Report",
      headers: [
        "Invoice",
        "Customer",
        "Items",
        "Total",
        "Payment",
        "Currency",
        "Date",
      ],
      data: reportData,
      summary: {
        "Total Sales": sales.length,
        "Total Revenue": formatCurrency(totalRevenue),
        "Avg Sale": formatCurrency(
          sales.length > 0 ? totalRevenue / sales.length : 0,
        ),
      },
    });
    toast.success("Sales report generated!");
  };

  const generateInventoryReport = () => {
    const reportData = medicines.map((m) => [
      m.name,
      m.batch_number,
      m.quantity,
      m.minimum_stock,
      new Date(m.expiry_date) < new Date()
        ? "Expired"
        : m.quantity <= m.minimum_stock
          ? "Low Stock"
          : "In Stock",
      formatCurrency(m.selling_price * m.quantity),
    ]);
    setGeneratedReport({
      title: "Inventory Report",
      headers: [
        "Medicine",
        "Batch",
        "Quantity",
        "Min Stock",
        "Status",
        "Value",
      ],
      data: reportData,
      summary: {
        "Total Items": medicines.length,
        "Low Stock": medicines.filter((m) => m.quantity <= m.minimum_stock)
          .length,
        Expired: medicines.filter((m) => new Date(m.expiry_date) < new Date())
          .length,
        "Total Value": formatCurrency(
          medicines.reduce((s, m) => s + m.selling_price * m.quantity, 0),
        ),
      },
    });
    toast.success("Inventory report generated!");
  };

  const generateFinancialReport = () => {
    const revenue = totalRevenue;
    const cost = revenue * 0.6;
    const profit = revenue - cost;
    setGeneratedReport({
      title: "Financial Report",
      headers: ["Metric", "Amount"],
      data: [
        ["Revenue", formatCurrency(revenue)],
        ["Cost of Goods (est.)", formatCurrency(cost)],
        ["Gross Profit", formatCurrency(profit)],
        ["Total Sales", sales.length.toString()],
        [
          "Avg per Sale",
          formatCurrency(sales.length > 0 ? revenue / sales.length : 0),
        ],
      ],
      summary: {
        Revenue: formatCurrency(revenue),
        Profit: formatCurrency(profit),
        "Sales Count": sales.length,
        Margin:
          revenue > 0 ? ((profit / revenue) * 100).toFixed(1) + "%" : "0%",
      },
    });
    toast.success("Financial report generated!");
  };

  const generateExpiryReport = () => {
    const expiring = medicines.filter(
      (m) =>
        new Date(m.expiry_date) <
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    );
    const reportData = expiring.map((m) => [
      m.name,
      m.batch_number,
      formatDate(m.expiry_date),
      m.quantity,
      new Date(m.expiry_date) < new Date() ? "Expired" : "Expiring Soon",
    ]);
    setGeneratedReport({
      title: "Expiry Report",
      headers: ["Medicine", "Batch", "Expiry Date", "Quantity", "Status"],
      data: reportData,
      summary: {
        Expired: medicines.filter((m) => new Date(m.expiry_date) < new Date())
          .length,
        "Expiring Soon": medicines.filter(
          (m) =>
            new Date(m.expiry_date) > new Date() &&
            new Date(m.expiry_date) <
              new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        ).length,
        "Total at Risk": expiring.length,
      },
    });
    toast.success("Expiry report generated!");
  };

  const handleExportCSV = () => {
    if (!generatedReport) return;
    const exportData = generatedReport.data.map((row) => {
      const obj = {};
      generatedReport.headers.forEach((h, i) => (obj[h] = row[i]));
      return obj;
    });
    exportToCSV(
      exportData,
      generatedReport.title.toLowerCase().replace(/\s/g, "-"),
    );
    toast.success("Exported!");
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  if (authLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Reports & Analytics" }]} />
      <PageHeader
        title="Reports & Analytics"
        description="View your pharmacy performance"
        backUrl="/dashboard"
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setDateRange(
                  dateRange === "week"
                    ? "month"
                    : dateRange === "month"
                      ? "year"
                      : "week",
                )
              }
            >
              <Calendar className="h-4 w-4 mr-2" />
              {dateRange === "week"
                ? "This Week"
                : dateRange === "month"
                  ? "This Month"
                  : "This Year"}
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Sales</p>
                <p className="text-2xl font-bold">{sales.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Medicines</p>
                <p className="text-2xl font-bold">{medicines.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Low Stock</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.low_stock || 0}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Sales</CardTitle>
          </CardHeader>
          <CardContent>
            {weeklySales.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklySales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-400">
                No data
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Medicines</CardTitle>
          </CardHeader>
          <CardContent>
            {topMedicines.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={topMedicines}
                    dataKey="revenue"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                  >
                    {topMedicines.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-400">
                No data
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={generateSalesReport}
              className="p-6 border-2 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
            >
              <TrendingUp className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="font-medium">Sales Report</p>
            </button>
            <button
              onClick={generateInventoryReport}
              className="p-6 border-2 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
            >
              <Package className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="font-medium">Inventory Report</p>
            </button>
            <button
              onClick={generateFinancialReport}
              className="p-6 border-2 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
            >
              <DollarSign className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="font-medium">Financial Report</p>
            </button>
            <button
              onClick={generateExpiryReport}
              className="p-6 border-2 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
            >
              <BarChart3 className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="font-medium">Expiry Report</p>
            </button>
          </div>

          {generatedReport && (
            <div className="mt-6 border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">{generatedReport.title}</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleExportCSV}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setGeneratedReport(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {generatedReport.headers.map((h, i) => (
                        <TableHead key={i}>{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {generatedReport.data.map((row, i) => (
                      <TableRow key={i}>
                        {row.map((cell, j) => (
                          <TableCell key={j} className="text-sm">
                            {cell}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {generatedReport.summary && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Summary</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(generatedReport.summary).map(([k, v]) => (
                      <div key={k}>
                        <p className="text-xs text-gray-500">{k}</p>
                        <p className="text-lg font-bold">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
