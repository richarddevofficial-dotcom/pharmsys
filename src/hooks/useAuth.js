"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export function useAuth(requireAuth = true) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token && !user && !isLoading) {
      fetchUser();
    }
  }, []);

  useEffect(() => {
    if (
      !isLoading &&
      requireAuth &&
      !isAuthenticated &&
      pathname !== "/login"
    ) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, requireAuth, router, pathname]);

  return {
    user,
    isAuthenticated,
    isLoading,
  };
}
