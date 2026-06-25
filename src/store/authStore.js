import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUserStore } from "./userStore";

export const useAuthStore = create()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (username, password) => {
        const users = useUserStore.getState().users;
        const user = users.find(
          (u) => u.username === username && u.password === password,
        );

        if (user) {
          if (!user.is_active) {
            throw new Error("Account is deactivated. Contact admin.");
          }
          localStorage.setItem("access_token", "demo_token_" + Date.now());
          set({ user: user, isAuthenticated: true });
          return { success: true };
        }
        throw new Error("Invalid username or password");
      },

      logout: () => {
        localStorage.removeItem("access_token");
        set({ user: null, isAuthenticated: false });
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
