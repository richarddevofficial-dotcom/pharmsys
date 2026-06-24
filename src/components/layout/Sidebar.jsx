"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/store/settingsStore";
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
  X,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "POS / Sales", href: "/pos", icon: ShoppingCart },
  { name: "Medicines", href: "/medicines", icon: Pill },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Sales History", href: "/sales", icon: ClipboardList },
  { name: "Purchases", href: "/purchases", icon: ShoppingBag },
  { name: "Suppliers", href: "/suppliers", icon: Truck },
  { name: "Prescriptions", href: "/prescriptions", icon: FileText },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Users", href: "/users", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { pharmacyName, systemName } = useSettingsStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-900 text-white shadow-lg"
      >
        <Menu className="h-5 w-5" />
      </button>
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-gray-900 text-white transition-all duration-300 no-print",
          collapsed ? "w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Pill className="h-8 w-8 text-orange-400" />
              <div>
                <h1 className="text-lg font-bold">{pharmacyName}</h1>
                <p className="text-xs text-orange-400">
                  Powered by {systemName}
                </p>
              </div>
            </div>
          )}
          <div className="flex gap-1">
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1 rounded hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:block p-1 rounded hover:bg-gray-800"
            >
              {collapsed ? (
                <Menu className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-orange-500 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white",
                  collapsed && "lg:justify-center lg:px-2",
                )}
                title={collapsed ? item.name : ""}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-gray-800">
          <Link
            href="/notifications"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg",
              collapsed && "lg:justify-center",
            )}
          >
            <Bell className="h-5 w-5" />
            {!collapsed && (
              <>
                <span>Notifications</span>
                <span className="ml-auto bg-orange-500 text-xs rounded-full px-2 py-1">
                  3
                </span>
              </>
            )}
          </Link>
        </div>
      </div>
    </>
  );
}
