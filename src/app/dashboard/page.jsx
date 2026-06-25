"use client";

import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pill,
  AlertTriangle,
  ShoppingCart,
  TrendingUp,
  Package,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Users,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
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

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth(true);

  const { data: dashboardData, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      try {
        const response = await api.get("/reports/dashboard/");
        return response.data;
      } catch (error) {
        console.error("Dashboard API Error:", error);
        return null;
      }
    },
  });

  const stats = dashboardData || {};

  const displayStats = [
    {
      title: "Total Medicines",
      value: stats.total_medicines || 0,
      change: "+12%",
      trend: "up",
      icon: Pill,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Low Stock Items",
      value: stats.low_stock || 0,
      change: "+5%",
      trend: "up",
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Today's Sales",
      value: formatCurrency(stats.today_sales || 0),
      change: "+18%",
      trend: "up",
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(stats.monthly_sales || 0),
      change: "+8%",
      trend: "up",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Expired Products",
      value: stats.expired_medicines || 0,
      change: "-3%",
      trend: "down",
      icon: Package,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Pending Orders",
      value: stats.pending_orders || 0,
      change: "+2%",
      trend: "up",
      icon: DollarSign,
      color: "text-gray-700",
      bgColor: "bg-gray-100",
    },
  ];

  const weeklySales = stats.weekly_sales || [];
  const topMedicines = stats.top_medicines || [];
  const lowStockAlerts = stats.low_stock_alerts || [];

  if (authLoading || statsLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back, {user?.first_name || "User"}!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayStats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center mt-2 text-sm">
                  <TrendIcon
                    className={`h-4 w-4 mr-1 ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}
                  />
                  <span
                    className={
                      stat.trend === "up" ? "text-green-500" : "text-red-500"
                    }
                  >
                    {stat.change}
                  </span>
                  <span className="text-gray-400 ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {weeklySales.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklySales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-400">
                No sales data yet
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
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-400">
                No medicines yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <ShoppingCart className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Sale #{1000 + i}</p>
                      <p className="text-xs text-gray-500">Cash Payment</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatCurrency(Math.random() * 100 + 20)}
                    </p>
                    <p className="text-xs text-gray-400">Today</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockAlerts.length > 0 ? (
              <div className="space-y-4">
                {lowStockAlerts.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          Min: {item.min} units
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-600">
                        {item.stock} left
                      </p>
                      <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{
                            width: `${Math.min((item.stock / item.min) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No low stock items
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Total Products</p>
                <p className="text-3xl font-bold">
                  {stats.total_medicines || 0}
                </p>
              </div>
              <Package className="h-10 w-10 text-orange-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300">Monthly Revenue</p>
                <p className="text-3xl font-bold">
                  {formatCurrency(stats.monthly_sales || 0)}
                </p>
              </div>
              <DollarSign className="h-10 w-10 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Active Customers</p>
                <p className="text-3xl font-bold">156</p>
              </div>
              <Users className="h-10 w-10 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
