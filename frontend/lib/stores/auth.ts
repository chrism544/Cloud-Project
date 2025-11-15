import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  portalId: string | null;
  setTokens: (access: string, refresh: string) => void;
  clear: () => void;
  setPortal: (id: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      portalId: null,
      setTokens: (access, refresh) => {
        set({ accessToken: access, refreshToken: refresh });
        // Also store in localStorage for API client compatibility
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", access);
          localStorage.setItem("refreshToken", refresh);
        }
      },
      clear: () => {
        set({ accessToken: null, refreshToken: null, portalId: null });
        // Also clear from localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      },
      setPortal: (id) => {
        console.log("Setting portalId in store:", id);
        set({ portalId: id });
      },
    }),
    {
      name: "auth-storage",
      // Only persist these fields
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        portalId: state.portalId,
      }),
    }
  )
);
