"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export function useAuth(requireAuth = true) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    // If auth is required and user is not authenticated, redirect to login
    if (requireAuth && !isAuthenticated && pathname !== "/login") {
      router.push("/login");
    }
  }, [isAuthenticated, requireAuth, router, pathname]);

  return {
    user,
    isAuthenticated,
    isLoading: false,
  };
}
