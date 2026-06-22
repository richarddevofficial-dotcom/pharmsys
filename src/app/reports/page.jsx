"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Package,
  Download,
  Calendar,
  Filter,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Mock chart data
const salesData = [
  { day: "Mon", sales: 1200, orders: 25 },
  { day: "Tue", sales: 1800, orders: 32 },
  { day: "Wed", sales: 1400, orders: 28 },
  { day: "Thu", sales: 2200, orders: 40 },
  { day: "Fri", sales: 2800, orders: 48 },
  { day: "Sat", sales: 3200, orders: 55 },
  { day: "Sun", sales: 1900, orders: 35 },
];

const topMedicines = [
  { name: "Paracetamol 500mg", quantity: 145, revenue: 868.55 },
  { name: "Amoxicillin 250mg", quantity: 89, revenue: 1112.5 },
  { name: "Vitamin C 1000mg", quantity: 76, revenue: 835.24 },
  { name: "Ibuprofen 400mg", quantity: 65, revenue: 584.35 },
  { name: "Omeprazole 20mg", quantity: 45, revenue: 675.0 },
];

const recentReports = [
  {
    id: 1,
    name: "Daily Sales Report - Jan 15",
    type: "Sales",
    date: "2024-01-15",
    size: "245 KB",
  },
  {
    id: 2,
    name: "Inventory Status Report",
    type: "Inventory",
    date: "2024-01-14",
    size: "512 KB",
  },
  {
    id: 3,
    name: "Monthly Revenue Report",
    type: "Financial",
    date: "2024-01-01",
    size: "1.2 MB",
  },
  {
    id: 4,
    name: "Expired Products Report",
    type: "Inventory",
    date: "2024-01-13",
    size: "156 KB",
  },
];

export default function ReportsPage() {
  const { isLoading: authLoading } = useAuth(true);
  const [reportType, setReportType] = useState("sales");
  const [dateRange, setDateRange] = useState("week");

  if (authLoading) return <LoadingSpinner />;

  const totalRevenue = salesData.reduce((sum, day) => sum + day.sales, 0);
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);
  const maxSales = Math.max(...salesData.map((d) => d.sales));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1">View your pharmacy performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
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
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
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
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg. Order Value</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalRevenue / totalOrders)}
                </p>
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

      {/* Bar Chart - Sales Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Custom Bar Chart */}
            <div className="flex items-end justify-between h-64 gap-2 px-4">
              {salesData.map((day, index) => {
                const heightPercent = (day.sales / maxSales) * 100;
                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <div className="w-full flex flex-col items-center">
                      <span className="text-xs font-medium text-gray-600 mb-1">
                        ${day.sales}
                      </span>
                      <div
                        className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-all cursor-pointer"
                        style={{ height: `${heightPercent}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{day.day}</span>
                  </div>
                );
              })}
            </div>
            {/* Legend */}
            <div className="flex items-center justify-center gap-6 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-600">Sales ($)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-600">Orders</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Medicines */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Medicines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topMedicines.map((medicine, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">
                        #{index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{medicine.name}</p>
                      <p className="text-xs text-gray-500">
                        {medicine.quantity} units sold
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency(medicine.revenue)}
                    </p>
                    <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(medicine.revenue / topMedicines[0].revenue) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{report.name}</p>
                      <p className="text-xs text-gray-500">
                        {report.type} • {report.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{report.size}</span>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Types */}
      <Card>
        <CardHeader>
          <CardTitle>Generate New Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { name: "Sales Report", icon: TrendingUp, color: "blue" },
              { name: "Inventory Report", icon: Package, color: "green" },
              { name: "Financial Report", icon: DollarSign, color: "purple" },
              { name: "Expiry Report", icon: BarChart3, color: "red" },
            ].map((report, index) => (
              <button
                key={index}
                className={`p-6 border-2 rounded-lg hover:border-${report.color}-500 hover:bg-${report.color}-50 transition-all text-center`}
              >
                <report.icon
                  className={`h-8 w-8 text-${report.color}-500 mx-auto mb-2`}
                />
                <p className="font-medium">{report.name}</p>
                <p className="text-xs text-gray-500 mt-1">Click to generate</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
