// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import api from "@/lib/axios";

// export const useAuthStore = create()(
//   persist(
//     (set, get) => ({
//       user: null,
//       isAuthenticated: false,
//       isLoading: false,
//       error: null,

//       login: async (username, password) => {
//         try {
//           set({ isLoading: true, error: null });

//           const response = await api.post("/auth/login/", {
//             username,
//             password,
//           });

//           const { access, refresh, user } = response.data;

//           // Store tokens
//           localStorage.setItem("access_token", access);
//           localStorage.setItem("refresh_token", refresh);

//           set({
//             user: user || response.data,
//             isAuthenticated: true,
//             isLoading: false,
//             error: null,
//           });

//           return response.data;
//         } catch (error) {
//           const message = error.response?.data?.detail || "Login failed";
//           set({
//             isLoading: false,
//             error: message,
//           });
//           throw error;
//         }
//       },

//       logout: () => {
//         localStorage.removeItem("access_token");
//         localStorage.removeItem("refresh_token");
//         set({
//           user: null,
//           isAuthenticated: false,
//           error: null,
//         });
//       },

//       fetchUser: async () => {
//         try {
//           set({ isLoading: true });
//           const token = localStorage.getItem("access_token");

//           if (!token) {
//             set({ isLoading: false });
//             return;
//           }

//           const response = await api.get("/users/me/");
//           set({
//             user: response.data,
//             isAuthenticated: true,
//             isLoading: false,
//           });
//         } catch (error) {
//           set({
//             user: null,
//             isAuthenticated: false,
//             isLoading: false,
//           });
//         }
//       },

//       setUser: (user) => {
//         set({ user });
//       },

//       clearError: () => {
//         set({ error: null });
//       },
//     }),
//     {
//       name: "auth-storage",
//       partialize: (state) => ({
//         user: state.user,
//         isAuthenticated: state.isAuthenticated,
//       }),
//     },
//   ),
// );

// src/store/authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/axios";

// Demo users for testing without backend
const DEMO_USERS = {
  admin: {
    id: 1,
    username: "admin",
    email: "admin@pharmacy.com",
    first_name: "John",
    last_name: "Admin",
    role: "SUPER_ADMIN",
    phone: "+1234567890",
    address: "123 Main St",
  },
  pharmacist: {
    id: 2,
    username: "pharmacist",
    email: "pharmacist@pharmacy.com",
    first_name: "Jane",
    last_name: "Smith",
    role: "PHARMACIST",
    phone: "+1234567891",
    address: "456 Oak Ave",
  },
  cashier: {
    id: 3,
    username: "cashier",
    email: "cashier@pharmacy.com",
    first_name: "Bob",
    last_name: "Johnson",
    role: "CASHIER",
    phone: "+1234567892",
    address: "789 Pine Rd",
  },
  manager: {
    id: 4,
    username: "manager",
    email: "manager@pharmacy.com",
    first_name: "Alice",
    last_name: "Williams",
    role: "STORE_MANAGER",
    phone: "+1234567893",
    address: "321 Elm St",
  },
};

const DEMO_PASSWORDS = {
  admin: "admin123",
  pharmacist: "pharm123",
  cashier: "cash123",
  manager: "mgr123",
};

export const useAuthStore = create()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (username, password) => {
        try {
          set({ isLoading: true, error: null });

          // DEMO MODE: Check demo credentials first
          const demoUser = DEMO_USERS[username];
          const demoPassword = DEMO_PASSWORDS[username];

          if (demoUser && demoPassword === password) {
            // Demo login successful
            const fakeToken =
              "demo_token_" + Math.random().toString(36).substring(7);
            localStorage.setItem("access_token", fakeToken);
            localStorage.setItem("refresh_token", "demo_refresh_token");

            set({
              user: demoUser,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            return { success: true, user: demoUser };
          }

          // If not demo user, try real API
          try {
            const response = await api.post("/auth/login/", {
              username,
              password,
            });

            const { access, refresh } = response.data;

            localStorage.setItem("access_token", access);
            localStorage.setItem("refresh_token", refresh);

            // Fetch user data from API
            const userResponse = await api.get("/users/me/");

            set({
              user: userResponse.data,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            return response.data;
          } catch (apiError) {
            // If API call fails and not demo user, throw error
            throw new Error("Invalid username or password");
          }
        } catch (error) {
          const message =
            error.response?.data?.detail ||
            error.message ||
            "Invalid credentials";
          set({
            isLoading: false,
            error: message,
          });
          throw error;
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
          set({ isLoading: true });
          const token = localStorage.getItem("access_token");

          if (!token) {
            set({ isLoading: false });
            return;
          }

          // If demo token, try to restore user from storage
          if (token.startsWith("demo_token_")) {
            const storedUser = get().user;
            if (storedUser) {
              set({
                isAuthenticated: true,
                isLoading: false,
              });
            } else {
              set({ isLoading: false });
            }
            return;
          }

          // Try API
          try {
            const response = await api.get("/users/me/");
            set({
              user: response.data,
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
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      setUser: (user) => {
        set({ user });
      },

      clearError: () => {
        set({ error: null });
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
