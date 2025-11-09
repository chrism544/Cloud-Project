"use client";
export const dynamic = 'force-dynamic';
import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/stores/auth";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Palette, Type, Layout, Save, RotateCcw } from "lucide-react";
import api from "@/lib/api";

export default function ThemePage() {
  const portalId = useAuthStore((s) => s.portalId);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [theme, setTheme] = useState<any>(null);

  // Theme tokens
  const [tokens, setTokens] = useState({
    colors: {
      primary: "#4F46E5",
      secondary: "#9333EA",
      accent: "#F59E0B",
      background: "#FFFFFF",
      surface: "#F9FAFB",
      text: "#111827",
      textSecondary: "#6B7280",
      border: "#E5E7EB",
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
    },
    typography: {
      fontFamily: "Inter, system-ui, sans-serif",
      fontSizeBase: "16px",
      fontSizeSmall: "14px",
      fontSizeLarge: "18px",
      fontSizeH1: "36px",
      fontSizeH2: "30px",
      fontSizeH3: "24px",
      fontWeightNormal: "400",
      fontWeightMedium: "500",
      fontWeightBold: "700",
      lineHeight: "1.6",
    },
    spacing: {
      xs: "4px",
      sm: "8px",
      md: "16px",
      lg: "24px",
      xl: "32px",
      xxl: "48px",
    },
    borderRadius: {
      sm: "4px",
      md: "8px",
      lg: "12px",
      xl: "16px",
      full: "9999px",
    },
    shadows: {
      sm: "0 1px 2px rgba(0,0,0,0.05)",
      md: "0 4px 6px rgba(0,0,0,0.1)",
      lg: "0 10px 15px rgba(0,0,0,0.1)",
      xl: "0 20px 25px rgba(0,0,0,0.1)",
    },
  });

  useEffect(() => {
    async function loadTheme() {
      if (!portalId) return;
      try {
        const response = await api.get(`/api/v1/portals/${portalId}/theme`);
        if (response.data && response.data.tokens) {
          setTokens(response.data.tokens);
          setTheme(response.data);
        }
      } catch (error) {
        console.error("Failed to load theme:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadTheme();
  }, [portalId]);

  const handleSave = async () => {
    if (!portalId) return;
    setIsSaving(true);
    try {
      if (theme?.id) {
        await api.put(`/api/v1/themes/${theme.id}`, { tokens });
      } else {
        await api.post(`/api/v1/themes`, {
          portalId,
          name: "Default Theme",
          isActive: true,
          tokens,
        });
      }
      alert("Theme saved successfully!");
    } catch (error) {
      console.error("Failed to save theme:", error);
      alert("Failed to save theme");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("Reset all theme settings to default?")) {
      setTokens({
        colors: {
          primary: "#4F46E5",
          secondary: "#9333EA",
          accent: "#F59E0B",
          background: "#FFFFFF",
          surface: "#F9FAFB",
          text: "#111827",
          textSecondary: "#6B7280",
          border: "#E5E7EB",
          success: "#10B981",
          warning: "#F59E0B",
          error: "#EF4444",
        },
        typography: {
          fontFamily: "Inter, system-ui, sans-serif",
          fontSizeBase: "16px",
          fontSizeSmall: "14px",
          fontSizeLarge: "18px",
          fontSizeH1: "36px",
          fontSizeH2: "30px",
          fontSizeH3: "24px",
          fontWeightNormal: "400",
          fontWeightMedium: "500",
          fontWeightBold: "700",
          lineHeight: "1.6",
        },
        spacing: {
          xs: "4px",
          sm: "8px",
          md: "16px",
          lg: "24px",
          xl: "32px",
          xxl: "48px",
        },
        borderRadius: {
          sm: "4px",
          md: "8px",
          lg: "12px",
          xl: "16px",
          full: "9999px",
        },
        shadows: {
          sm: "0 1px 2px rgba(0,0,0,0.05)",
          md: "0 4px 6px rgba(0,0,0,0.1)",
          lg: "0 10px 15px rgba(0,0,0,0.1)",
          xl: "0 20px 25px rgba(0,0,0,0.1)",
        },
      });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center text-gray-600">Loading theme...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Theme Editor</h1>
            <p className="text-gray-600 mt-1">Customize colors, typography, spacing, and more</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Default
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save Theme"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Colors */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-900">Colors</h2>
            </div>
            <div className="space-y-4">
              {Object.entries(tokens.colors).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="color"
                      value={value as string}
                      onChange={(e) => setTokens({ ...tokens, colors: { ...tokens.colors, [key]: e.target.value } })}
                      className="h-10 w-20 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={value as string}
                      onChange={(e) => setTokens({ ...tokens, colors: { ...tokens.colors, [key]: e.target.value } })}
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Type className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-900">Typography</h2>
            </div>
            <div className="space-y-4">
              {Object.entries(tokens.typography).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <input
                    type="text"
                    value={value as string}
                    onChange={(e) => setTokens({ ...tokens, typography: { ...tokens.typography, [key]: e.target.value } })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Spacing */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Layout className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-900">Spacing</h2>
            </div>
            <div className="space-y-4">
              {Object.entries(tokens.spacing).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 uppercase">
                    {key}
                  </label>
                  <input
                    type="text"
                    value={value as string}
                    onChange={(e) => setTokens({ ...tokens, spacing: { ...tokens.spacing, [key]: e.target.value } })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Border Radius */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Layout className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-900">Border Radius</h2>
            </div>
            <div className="space-y-4">
              {Object.entries(tokens.borderRadius).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 uppercase">
                    {key}
                  </label>
                  <input
                    type="text"
                    value={value as string}
                    onChange={(e) => setTokens({ ...tokens, borderRadius: { ...tokens.borderRadius, [key]: e.target.value } })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Preview</h2>
          <div style={{
            color: tokens.colors.text,
            fontFamily: tokens.typography.fontFamily,
            fontSize: tokens.typography.fontSizeBase
          }}>
            <h1 style={{ fontSize: tokens.typography.fontSizeH1, fontWeight: tokens.typography.fontWeightBold, marginBottom: tokens.spacing.md }}>
              Heading 1
            </h1>
            <h2 style={{ fontSize: tokens.typography.fontSizeH2, fontWeight: tokens.typography.fontWeightBold, marginBottom: tokens.spacing.md }}>
              Heading 2
            </h2>
            <p style={{ lineHeight: tokens.typography.lineHeight, marginBottom: tokens.spacing.md, color: tokens.colors.textSecondary }}>
              This is sample text to preview your typography settings. The quick brown fox jumps over the lazy dog.
            </p>
            <div className="flex gap-4 mt-6">
              <button style={{
                backgroundColor: tokens.colors.primary,
                color: 'white',
                padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
                borderRadius: tokens.borderRadius.md,
                fontWeight: tokens.typography.fontWeightMedium
              }}>
                Primary Button
              </button>
              <button style={{
                backgroundColor: tokens.colors.secondary,
                color: 'white',
                padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
                borderRadius: tokens.borderRadius.md,
                fontWeight: tokens.typography.fontWeightMedium
              }}>
                Secondary Button
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
