import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create()(
  persist(
    (set) => ({
      users: [
        {
          id: 1,
          first_name: "Admin",
          last_name: "User",
          username: "admin",
          email: "admin@pharmacy.com",
          phone: "+211 123 456 789",
          role: "SUPER_ADMIN",
          is_active: true,
          password: "admin123",
          last_login: new Date().toISOString(),
          created_at: new Date().toISOString(),
        },
      ],

      addUser: (userData) => {
        const newUser = {
          id: Date.now(),
          ...userData,
          is_active: true,
          last_login: new Date().toISOString(),
          created_at: new Date().toISOString(),
        };
        set((state) => ({
          users: [...state.users, newUser],
        }));
        return newUser;
      },

      updateUser: (id, userData) => {
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id ? { ...u, ...userData } : u,
          ),
        }));
      },

      deleteUser: (id) => {
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
        }));
      },

      toggleUserStatus: (id) => {
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id ? { ...u, is_active: !u.is_active } : u,
          ),
        }));
      },

      getUserByUsername: (username) => {
        return useUserStore
          .getState()
          .users.find((u) => u.username === username);
      },
    }),
    {
      name: "pharmacy-users",
    },
  ),
);
