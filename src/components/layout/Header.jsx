"use client";

import { useAuthStore } from "@/store/authStore";
import { useSettingsStore } from "@/store/settingsStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { LogOut, User, Settings, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Header() {
  const { user, logout } = useAuthStore();
  const { pharmacyName } = useSettingsStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-3 no-print">
      <div className="flex items-center justify-between">
        <div className="ml-12 lg:ml-0">
          <h2 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white">
            Welcome back, {user?.first_name || user?.username || "User"}
          </h2>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
            {pharmacyName} •{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-40 md:w-64 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <ThemeToggle />
          <div className="relative group">
            <button className="flex items-center gap-2">
              <Avatar className="h-8 w-8 md:h-10 md:w-10">
                <AvatarFallback className="text-xs md:text-sm">
                  {getInitials(
                    `${user?.first_name || ""} ${user?.last_name || ""}`,
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {user?.role?.toLowerCase()}
                </p>
              </div>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-1">
                <div className="px-4 py-2 border-b dark:border-gray-700 md:hidden">
                  <p className="text-sm font-medium dark:text-white">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={() => router.push("/profile")}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <User className="h-4 w-4" />
                  My Profile
                </button>
                <button
                  onClick={() => router.push("/settings")}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
                <hr className="my-1 dark:border-gray-700" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
