"use client";
export const dynamic = 'force-dynamic';
import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/stores/auth";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Settings, Globe, Code, AlertCircle, Save } from "lucide-react";
import api from "@/lib/api";

export default function GlobalSettingsPage() {
  const portalId = useAuthStore((s) => s.portalId);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState({
    siteName: "",
    siteDescription: "",
    faviconUrl: "",
    logoUrl: "",
    defaultLocale: "en",
    timezone: "UTC",
    analyticsCode: "",
    googleTagManager: "",
    customHeadCode: "",
    customFooterCode: "",
    maintenanceMode: false,
    maintenanceMessage: "",
  });

  useEffect(() => {
    async function loadSettings() {
      if (!portalId) return;
      try {
        const response = await api.get(`/api/v1/portals/${portalId}/settings`);
        if (response.data) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, [portalId]);

  const handleSave = async () => {
    if (!portalId) return;
    setIsSaving(true);
    try {
      await api.post(`/api/v1/portals/${portalId}/settings`, settings);
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center text-gray-600">Loading settings...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Global Settings</h1>
            <p className="text-gray-600 mt-1">Configure site-wide settings and metadata</p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Settings"}
          </button>
        </div>

        <div className="space-y-6">
          {/* General Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-900">General Settings</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="My Website"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Description
                </label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  placeholder="A brief description of your website"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo URL
                </label>
                <input
                  type="url"
                  value={settings.logoUrl}
                  onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Favicon URL
                </label>
                <input
                  type="url"
                  value={settings.faviconUrl}
                  onChange={(e) => setSettings({ ...settings, faviconUrl: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://example.com/favicon.ico"
                />
              </div>
            </div>
          </div>

          {/* Localization */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-900">Localization</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Locale
                </label>
                <select
                  value={settings.defaultLocale}
                  onChange={(e) => setSettings({ ...settings, defaultLocale: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="ja">Japanese</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>
            </div>
          </div>

          {/* Analytics & Tracking */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Code className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-900">Analytics & Tracking</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Tag Manager ID
                </label>
                <input
                  type="text"
                  value={settings.googleTagManager}
                  onChange={(e) => setSettings({ ...settings, googleTagManager: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="GTM-XXXXXX"
                />
                <p className="text-xs text-gray-500 mt-1">Enter your Google Tag Manager container ID</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Analytics Code
                </label>
                <textarea
                  value={settings.analyticsCode}
                  onChange={(e) => setSettings({ ...settings, analyticsCode: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={4}
                  placeholder="<script>...</script>"
                  spellCheck={false}
                />
                <p className="text-xs text-gray-500 mt-1">Add custom analytics scripts (Google Analytics, Plausible, etc.)</p>
              </div>
            </div>
          </div>

          {/* Custom Code */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Code className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-900">Custom Code Injection</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom &lt;head&gt; Code
                </label>
                <textarea
                  value={settings.customHeadCode}
                  onChange={(e) => setSettings({ ...settings, customHeadCode: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={6}
                  placeholder="<!-- Custom meta tags, fonts, etc. -->"
                  spellCheck={false}
                />
                <p className="text-xs text-gray-500 mt-1">Code injected into the &lt;head&gt; section of every page</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Footer Code
                </label>
                <textarea
                  value={settings.customFooterCode}
                  onChange={(e) => setSettings({ ...settings, customFooterCode: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={6}
                  placeholder="<!-- Custom scripts before </body> -->"
                  spellCheck={false}
                />
                <p className="text-xs text-gray-500 mt-1">Code injected before the closing &lt;/body&gt; tag of every page</p>
              </div>
            </div>
          </div>

          {/* Maintenance Mode */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-900">Maintenance Mode</h2>
            </div>
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-5 h-5"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Enable Maintenance Mode</span>
                  <p className="text-xs text-gray-500">Display a maintenance page to visitors</p>
                </div>
              </label>

              {settings.maintenanceMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maintenance Message
                  </label>
                  <textarea
                    value={settings.maintenanceMessage}
                    onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={3}
                    placeholder="We're currently performing maintenance. Please check back soon!"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
