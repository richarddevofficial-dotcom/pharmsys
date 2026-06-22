"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Pill,
  Package,
  ShoppingCart,
  Truck,
  BarChart3,
  Settings,
  Users,
  Bell,
  ChevronLeft,
  Menu,
  ClipboardList,
  FileText,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Medicines", href: "/medicines", icon: Pill },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "POS / Sales", href: "/pos", icon: ShoppingCart },
  { name: "Sales History", href: "/sales", icon: ClipboardList },
  { name: "Purchases", href: "/purchases", icon: ShoppingBag },
  { name: "Suppliers", href: "/suppliers", icon: Truck },
  { name: "Prescriptions", href: "/prescriptions", icon: FileText },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col bg-gray-900 text-white transition-all duration-300",
        collapsed ? "w-20" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Pill className="h-8 w-8 text-blue-400" />
            <div>
              <h1 className="text-lg font-bold">PharmaSys</h1>
              <p className="text-xs text-gray-400">Management</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-gray-800"
        >
          {collapsed ? (
            <Menu className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white",
                collapsed && "justify-center px-2",
              )}
              title={collapsed ? item.name : ""}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Notifications */}
      <div className="px-3 py-4 border-t border-gray-800">
        <button
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg",
            collapsed && "justify-center",
          )}
        >
          <Bell className="h-5 w-5" />
          {!collapsed && (
            <>
              <span>Notifications</span>
              <span className="ml-auto bg-red-500 text-xs rounded-full px-2 py-1">
                3
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
