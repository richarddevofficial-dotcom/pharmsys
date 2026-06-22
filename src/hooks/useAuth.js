"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export function useAuth(requireAuth = true) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, fetchUser } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      fetchUser();
    }
  }, [fetchUser, isAuthenticated, isLoading]);

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, requireAuth, router]);

  return {
    user,
    isAuthenticated,
    isLoading,
  };
}
