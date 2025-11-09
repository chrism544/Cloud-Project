import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  portalId: string | null;
  setTokens: (access: string, refresh: string) => void;
  clear: () => void;
  setPortal: (id: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  portalId: null,
  setTokens: (access, refresh) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
    }
    set({ accessToken: access, refreshToken: refresh });
  },
  clear: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
    set({ accessToken: null, refreshToken: null });
  },
  setPortal: (id) => set({ portalId: id }),
}));
