"use client";

import { useState } from "react";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { useAuth } from "@/hooks/useAuth";
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
import { useReactTable } from "@tanstack/react-table";

const weeklyData = [
  { day: "Mon", sales: 1200 },
  { day: "Tue", sales: 1800 },
  { day: "Wed", sales: 1400 },
  { day: "Thu", sales: 2200 },
  { day: "Fri", sales: 2800 },
  { day: "Sat", sales: 3200 },
  { day: "Sun", sales: 1900 },
];

const monthlyData = [
  { day: "Week 1", sales: 8500 },
  { day: "Week 2", sales: 9200 },
  { day: "Week 3", sales: 7800 },
  { day: "Week 4", sales: 10500 },
];

const yearlyData = [
  { day: "Jan", sales: 28000 },
  { day: "Feb", sales: 25000 },
  { day: "Mar", sales: 32000 },
  { day: "Apr", sales: 30000 },
  { day: "May", sales: 35000 },
  { day: "Jun", sales: 38000 },
  { day: "Jul", sales: 34000 },
  { day: "Aug", sales: 36000 },
  { day: "Sep", sales: 33000 },
  { day: "Oct", sales: 37000 },
  { day: "Nov", sales: 40000 },
  { day: "Dec", sales: 42000 },
];

const topMedicines = [
  { name: "Paracetamol", revenue: 868.55 },
  { name: "Amoxicillin", revenue: 1112.5 },
  { name: "Vitamin C", revenue: 835.24 },
  { name: "Ibuprofen", revenue: 584.35 },
  { name: "Omeprazole", revenue: 675.0 },
];

const COLORS = ["#f97316", "#ea580c", "#fdba74", "#c2410c", "#9a3412"];

export default function ReportsPage() {
  const { isLoading: authLoading } = useAuth(true);
  useRoleAccess();
  const [dateRange, setDateRange] = useState("week");
  const [generatedReport, setGeneratedReport] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filterType, setFilterType] = useState("all");

  // Get data based on date range
  const getSalesData = () => {
    switch (dateRange) {
      case "week":
        return weeklyData;
      case "month":
        return monthlyData;
      case "year":
        return yearlyData;
      default:
        return weeklyData;
    }
  };

  const currentData = getSalesData();
  const totalRevenue = currentData.reduce((s, d) => s + d.sales, 0);
  const totalOrders =
    dateRange === "week" ? 263 : dateRange === "month" ? 1050 : 12600;
  const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Cycle through date ranges
  const cycleDateRange = () => {
    if (dateRange === "week") setDateRange("month");
    else if (dateRange === "month") setDateRange("year");
    else setDateRange("week");
    toast.success(
      `Showing ${dateRange === "week" ? "Monthly" : dateRange === "month" ? "Yearly" : "Weekly"} data`,
    );
  };

  // Handle filter
  const handleFilter = (type) => {
    setFilterType(type);
    setShowFilter(false);
    toast.success(`Filtered by: ${type}`);
  };

  // Export dashboard data
  const handleExport = () => {
    const exportData = currentData.map((d) => ({
      Period: d.day,
      Sales: d.sales,
      Revenue: formatCurrency(d.sales),
    }));
    exportToCSV(
      exportData,
      `sales-report-${dateRange}-${new Date().toISOString().split("T")[0]}`,
    );
    toast.success("Report exported to CSV!");
  };

  // Report generators
  const generateSalesReport = () => {
    setGeneratedReport({
      title: "Sales Report",
      headers: ["Period", "Orders", "Revenue", "Avg Order"],
      data: [
        ["Today", "25", "$1,200", "$48.00"],
        ["Yesterday", "32", "$1,500", "$46.88"],
        ["This Week", "180", "$8,400", "$46.67"],
        ["This Month", "720", "$34,000", "$47.22"],
        ["Last Month", "650", "$30,000", "$46.15"],
      ],
      summary: {
        "Total Orders": "720",
        "Total Revenue": "$34,000",
        "Avg Order Value": "$47.22",
        Growth: "+13.3%",
      },
    });
    toast.success("Sales report generated!");
  };

  const generateInventoryReport = () => {
    setGeneratedReport({
      title: "Inventory Report",
      headers: ["Medicine", "Quantity", "Min Stock", "Status", "Value"],
      data: [
        ["Paracetamol 500mg", "150", "20", "In Stock", "$898.50"],
        ["Amoxicillin 250mg", "8", "15", "Low Stock", "$100.00"],
        ["Ibuprofen 400mg", "75", "25", "In Stock", "$674.25"],
        ["Omeprazole 20mg", "5", "30", "Low Stock", "$75.00"],
        ["Vitamin C 1000mg", "90", "20", "In Stock", "$989.10"],
      ],
      summary: {
        "Total Items": "328",
        "Low Stock Items": "2",
        "Total Value": "$2,736.85",
        Categories: "5",
      },
    });
    toast.success("Inventory report generated!");
  };

  const generateFinancialReport = () => {
    setGeneratedReport({
      title: "Financial Report",
      headers: ["Metric", "This Month", "Last Month", "Change"],
      data: [
        ["Revenue", "$34,000", "$30,000", "+13.3%"],
        ["Cost of Goods", "$18,000", "$16,000", "+12.5%"],
        ["Gross Profit", "$16,000", "$14,000", "+14.3%"],
        ["Expenses", "$5,000", "$4,800", "+4.2%"],
        ["Net Profit", "$11,000", "$9,200", "+19.6%"],
      ],
      summary: {
        Revenue: "$34,000",
        "Gross Profit": "$16,000",
        "Net Profit": "$11,000",
        Margin: "32.4%",
      },
    });
    toast.success("Financial report generated!");
  };

  const generateExpiryReport = () => {
    setGeneratedReport({
      title: "Expiry Report",
      headers: ["Medicine", "Batch", "Expiry Date", "Quantity", "Status"],
      data: [
        ["Omeprazole 20mg", "BATCH-004", "2024-03-01", "5", "Expired"],
        ["Aspirin 300mg", "BATCH-008", "2024-06-15", "120", "Expiring Soon"],
        ["Cetirizine 10mg", "BATCH-005", "2024-08-20", "60", "Expiring Soon"],
        ["Amoxicillin 250mg", "BATCH-002", "2024-08-15", "8", "Expiring Soon"],
        ["Ibuprofen 400mg", "BATCH-003", "2025-06-20", "75", "Valid"],
      ],
      summary: {
        Expired: "1",
        "Expiring Soon (30d)": "3",
        Valid: "1",
        "Total Value at Risk": "$127.50",
      },
    });
    toast.success("Expiry report generated!");
  };

  const handleExportCSV = () => {
    if (!generatedReport) return;
    const exportData = generatedReport.data.map((row) => {
      const obj = {};
      generatedReport.headers.forEach((header, i) => {
        obj[header] = row[i];
      });
      return obj;
    });
    exportToCSV(
      exportData,
      `${generatedReport.title.toLowerCase().replace(/\s/g, "-")}`,
    );
    toast.success("Report exported!");
  };

  const dateRangeLabels = {
    week: "This Week",
    month: "This Month",
    year: "This Year",
  };

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
            {/* Date Range Toggle */}
            <Button variant="outline" size="sm" onClick={cycleDateRange}>
              <Calendar className="h-4 w-4 mr-2" />
              {dateRangeLabels[dateRange]}
            </Button>

            {/* Filter Dropdown */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilter(!showFilter)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              {showFilter && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                  <div className="py-1">
                    {["all", "sales", "inventory", "financial", "expiry"].map(
                      (type) => (
                        <button
                          key={type}
                          onClick={() => handleFilter(type)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 capitalize ${filterType === type ? "bg-orange-50 text-orange-600 font-medium" : "text-gray-700"}`}
                        >
                          {type === "all" ? "All Reports" : `${type} Reports`}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Export Button */}
            <Button size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
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
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold">
                  {totalOrders.toLocaleString()}
                </p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Order</p>
                <p className="text-2xl font-bold">{formatCurrency(avgOrder)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Growth</p>
                <p className="text-2xl font-bold text-green-600">+15.2%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{dateRangeLabels[dateRange]} Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Medicines</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topMedicines}
                  dataKey="revenue"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {topMedicines.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Generate Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Generate New Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={generateSalesReport}
              className="p-6 border-2 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all cursor-pointer"
            >
              <TrendingUp className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="font-medium">Sales Report</p>
              <p className="text-xs text-gray-500 mt-1">Click to generate</p>
            </button>
            <button
              onClick={generateInventoryReport}
              className="p-6 border-2 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all cursor-pointer"
            >
              <Package className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="font-medium">Inventory Report</p>
              <p className="text-xs text-gray-500 mt-1">Click to generate</p>
            </button>
            <button
              onClick={generateFinancialReport}
              className="p-6 border-2 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all cursor-pointer"
            >
              <DollarSign className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="font-medium">Financial Report</p>
              <p className="text-xs text-gray-500 mt-1">Click to generate</p>
            </button>
            <button
              onClick={generateExpiryReport}
              className="p-6 border-2 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all cursor-pointer"
            >
              <BarChart3 className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="font-medium">Expiry Report</p>
              <p className="text-xs text-gray-500 mt-1">Click to generate</p>
            </button>
          </div>

          {/* Generated Report */}
          {generatedReport && (
            <div className="mt-6 border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">{generatedReport.title}</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleExportCSV}>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
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
                    {Object.entries(generatedReport.summary).map(
                      ([key, value]) => (
                        <div key={key}>
                          <p className="text-xs text-gray-500">{key}</p>
                          <p className="text-lg font-bold">{value}</p>
                        </div>
                      ),
                    )}
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
