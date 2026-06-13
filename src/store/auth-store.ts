import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Customer, Contractor, Admin } from "@/types";
import { authApi } from "@/services/api";

interface AuthState {
  user: User | Customer | Contractor | Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User | Customer | Contractor | Admin) => void;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  updateUser: (updates: Partial<User>) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user) =>
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: async () => {
        try {
          await authApi.logout();
        } catch {
          // Logout server-side even if request fails
        }
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setLoading: (loading) => set({ isLoading: loading }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      checkAuth: async () => {
        const state = get();
        if (!state.isAuthenticated) return;

        try {
          set({ isLoading: true });
          const { user } = await authApi.getMe();
          set({ user, isLoading: false });
        } catch {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: "buildconnect-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
