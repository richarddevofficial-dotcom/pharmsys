import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const useAuthStore = create()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (username, password) => {
        set({ isLoading: true, error: null });

        try {
          // Try Django backend first
          const response = await axios.post(`${API_URL}/auth/login/`, {
            username,
            password,
          });
          const { access, refresh } = response.data;

          localStorage.setItem("access_token", access);
          localStorage.setItem("refresh_token", refresh);

          const userResponse = await axios.get(`${API_URL}/users/me/`, {
            headers: { Authorization: `Bearer ${access}` },
          });

          set({
            user: userResponse.data,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true };
        } catch (error) {
          console.log("Backend login failed, trying local...");
          // Fallback to local users
          const localUsers = {
            admin: {
              id: 1,
              username: "admin",
              first_name: "Admin",
              last_name: "User",
              role: "SUPER_ADMIN",
              email: "admin@pharmplus.com",
            },
            pharmacist: {
              id: 2,
              username: "pharmacist",
              first_name: "Jane",
              last_name: "Smith",
              role: "PHARMACIST",
              email: "jane@pharmplus.com",
            },
            cashier: {
              id: 3,
              username: "cashier",
              first_name: "Bob",
              last_name: "Johnson",
              role: "CASHIER",
              email: "bob@pharmplus.com",
            },
            manager: {
              id: 4,
              username: "manager",
              first_name: "Alice",
              last_name: "Williams",
              role: "STORE_MANAGER",
              email: "alice@pharmplus.com",
            },
          };
          const localPasswords = {
            admin: "admin123",
            pharmacist: "pharm123",
            cashier: "cash123",
            manager: "mgr123",
          };

          const user = localUsers[username];
          if (user && localPasswords[username] === password) {
            localStorage.setItem("access_token", "local_token");
            set({ user, isAuthenticated: true, isLoading: false });
            return { success: true };
          }

          set({
            isLoading: false,
            error: "Invalid credentials",
            isAuthenticated: false,
          });
          throw new Error("Invalid username or password");
        }
      },

      logout: () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      fetchUser: async () => {
        try {
          const token = localStorage.getItem("access_token");
          if (!token) {
            set({ isLoading: false });
            return;
          }

          const response = await axios.get(`${API_URL}/users/`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const userData =
            response.data.results?.[0] || response.data[0] || response.data;

          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
