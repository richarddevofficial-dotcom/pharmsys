"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

// Define which roles can access each page
const pageAccess = {
  "/dashboard": [
    "SUPER_ADMIN",
    "PHARMACIST",
    "CASHIER",
    "STORE_MANAGER",
    "CUSTOMER",
  ],
  "/pos": ["SUPER_ADMIN", "PHARMACIST", "CASHIER"],
  "/medicines": ["SUPER_ADMIN", "PHARMACIST", "STORE_MANAGER"],
  "/inventory": ["SUPER_ADMIN", "PHARMACIST", "STORE_MANAGER"],
  "/sales": ["SUPER_ADMIN", "PHARMACIST", "CASHIER"],
  "/purchases": ["SUPER_ADMIN", "PHARMACIST", "STORE_MANAGER"],
  "/suppliers": ["SUPER_ADMIN", "PHARMACIST", "STORE_MANAGER"],
  "/prescriptions": ["SUPER_ADMIN", "PHARMACIST"],
  "/customers": ["SUPER_ADMIN", "PHARMACIST", "CASHIER"],
  "/reports": ["SUPER_ADMIN", "PHARMACIST", "STORE_MANAGER"],
  "/notifications": ["SUPER_ADMIN", "PHARMACIST", "STORE_MANAGER"],
  "/users": ["SUPER_ADMIN"],
  "/settings": ["SUPER_ADMIN"],
  "/profile": [
    "SUPER_ADMIN",
    "PHARMACIST",
    "CASHIER",
    "STORE_MANAGER",
    "CUSTOMER",
  ],
};

export function useRoleAccess() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) return;

    // Find matching page access
    let allowedRoles = null;
    for (const [path, roles] of Object.entries(pageAccess)) {
      if (pathname === path || pathname.startsWith(path + "/")) {
        allowedRoles = roles;
        break;
      }
    }

    // If page has restrictions and user role is not allowed
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      toast.error("You do not have permission to access this page");
      router.push("/dashboard");
    }
  }, [pathname, user, router]);
}
