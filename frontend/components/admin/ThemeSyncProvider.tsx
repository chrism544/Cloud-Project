"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/stores/auth";

export type ThemeTokens = Record<string, any>;

const ThemeContext = createContext<ThemeTokens>({});

export function ThemeSyncProvider({ children }: { children: React.ReactNode }) {
  const portalId = useAuthStore((s) => s.portalId) || "";
  const [tokens, setTokens] = useState<ThemeTokens>({});

  useEffect(() => {
    if (!portalId) return;
    (async () => {
      const res = await api.get("/api/v1/admin/themes/active/tokens", {
        params: { portalId },
        headers: { "X-Portal-ID": portalId },
      });
      setTokens(res.data || {});
    })();
  }, [portalId]);

  // Convert tokens to CSS variables (basic example for colors/typography)
  const cssVars = useMemo(() => {
    const t = tokens || {};
    const vars: Record<string, string> = {};
    if (t.colors) {
      for (const [k, v] of Object.entries(t.colors)) vars[`--color-${k}`] = String(v);
    }
    if (t.typography?.bodySize) vars["--font-size-body"] = String(t.typography.bodySize);
    return vars;
  }, [tokens]);

  return (
    <ThemeContext.Provider value={tokens}>
      <div style={cssVars as React.CSSProperties}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function useThemeTokens() {
  return useContext(ThemeContext);
}
