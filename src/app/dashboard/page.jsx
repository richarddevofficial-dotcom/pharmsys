"use client";

import { useAuth } from "@/hooks/useAuth";
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
  ClipboardList,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { formatCurrency } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Mock data for development
const mockStats = [
  {
    title: "Total Medicines",
    value: "1,234",
    change: "+12%",
    trend: "up",
    icon: Pill,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Low Stock Items",
    value: "23",
    change: "+5%",
    trend: "up",
    icon: AlertTriangle,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  {
    title: "Today's Sales",
    value: "$4,560",
    change: "+18%",
    trend: "up",
    icon: ShoppingCart,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Monthly Revenue",
    value: "$45,678",
    change: "+8%",
    trend: "up",
    icon: TrendingUp,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Expired Products",
    value: "12",
    change: "-3%",
    trend: "down",
    icon: Package,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  {
    title: "Pending Orders",
    value: "8",
    change: "+2%",
    trend: "up",
    icon: DollarSign,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
  },
];

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth(true);

  // Fetch dashboard stats from API
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      try {
        const response = await api.get("/reports/dashboard/");
        return response.data;
      } catch (error) {
        // Return mock data if API is not available
        console.log("Using mock data for dashboard");
        return mockStats;
      }
    },
  });

  if (authLoading || isLoading) {
    return <LoadingSpinner />;
  }

  const displayStats = stats || mockStats;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Overview of your pharmacy performance
        </p>
      </div>

      {/* Stats Grid */}
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
                    className={`h-4 w-4 mr-1 ${
                      stat.trend === "up" ? "text-green-500" : "text-red-500"
                    }`}
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400">Sales Chart Coming Soon</p>
                <p className="text-sm text-gray-300">
                  Connect to API to view data
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Selling Medicines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <Pill className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400">Top Medicines Chart Coming Soon</p>
                <p className="text-sm text-gray-300">
                  Connect to API to view data
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded">
                      <ShoppingCart className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Sale #{1000 + item}</p>
                      <p className="text-xs text-gray-500">Cash Payment</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      ${(Math.random() * 100 + 20).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">5 mins ago</p>
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
            <div className="space-y-4">
              {[
                { name: "Paracetamol 500mg", stock: 5, min: 20 },
                { name: "Amoxicillin 250mg", stock: 8, min: 15 },
                { name: "Ibuprofen 400mg", stock: 3, min: 25 },
                { name: "Omeprazole 20mg", stock: 10, min: 30 },
                { name: "Cetirizine 10mg", stock: 7, min: 20 },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded">
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
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${(item.stock / item.min) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
