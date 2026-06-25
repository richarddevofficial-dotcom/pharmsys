"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
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

// Define all navigation items
const allNavigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: [
      "SUPER_ADMIN",
      "PHARMACIST",
      "CASHIER",
      "STORE_MANAGER",
      "CUSTOMER",
    ],
  },
  {
    name: "POS / Sales",
    href: "/pos",
    icon: ShoppingCart,
    roles: ["SUPER_ADMIN", "PHARMACIST", "CASHIER"],
  },
  {
    name: "Medicines",
    href: "/medicines",
    icon: Pill,
    roles: ["SUPER_ADMIN", "PHARMACIST", "STORE_MANAGER"],
  },
  {
    name: "Inventory",
    href: "/inventory",
    icon: Package,
    roles: ["SUPER_ADMIN", "PHARMACIST", "STORE_MANAGER"],
  },
  {
    name: "Sales History",
    href: "/sales",
    icon: ClipboardList,
    roles: ["SUPER_ADMIN", "PHARMACIST", "CASHIER"],
  },
  {
    name: "Purchases",
    href: "/purchases",
    icon: ShoppingBag,
    roles: ["SUPER_ADMIN", "PHARMACIST", "STORE_MANAGER"],
  },
  {
    name: "Suppliers",
    href: "/suppliers",
    icon: Truck,
    roles: ["SUPER_ADMIN", "PHARMACIST", "STORE_MANAGER"],
  },
  {
    name: "Prescriptions",
    href: "/prescriptions",
    icon: FileText,
    roles: ["SUPER_ADMIN", "PHARMACIST"],
  },
  {
    name: "Customers",
    href: "/customers",
    icon: Users,
    roles: ["SUPER_ADMIN", "PHARMACIST", "CASHIER"],
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
    roles: ["SUPER_ADMIN", "PHARMACIST", "STORE_MANAGER"],
  },
  {
    name: "Notifications",
    href: "/notifications",
    icon: Bell,
    roles: ["SUPER_ADMIN", "PHARMACIST", "STORE_MANAGER"],
  },
  { name: "Users", href: "/users", icon: Users, roles: ["SUPER_ADMIN"] },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["SUPER_ADMIN"],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const { pharmacyName, systemName } = useSettingsStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Filter navigation based on user role
  const userRole = user?.role || "CUSTOMER";
  const navigation = allNavigation.filter((item) =>
    item.roles.includes(userRole),
  );

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

        {/* User info */}
        {!collapsed && user && (
          <div className="px-4 py-3 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {user.first_name?.[0]}
                  {user.last_name?.[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs text-orange-400 capitalize">
                  {userRole.toLowerCase().replace("_", " ")}
                </p>
              </div>
            </div>
          </div>
        )}

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
      </div>
    </>
  );
}
