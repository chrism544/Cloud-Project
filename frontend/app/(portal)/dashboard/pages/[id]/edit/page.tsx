"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Puck, Data } from "@measured/puck";
import { config } from "@/lib/puck/config";
import { useAuthStore } from "@/lib/stores/auth";
import api from "@/lib/api";
import "@measured/puck/puck.css";
import { Monitor, Tablet, Smartphone, Code, Search, FileText, Clock, Save } from "lucide-react";

type ViewportSize = "desktop" | "tablet" | "mobile";

export default function PageEditorPage() {
  const params = useParams();
  const router = useRouter();
  const pageId = params.id as string;
  const portalId = useAuthStore((s) => s.portalId);

  const [initialData, setInitialData] = useState<Data | null>(null);
  const [page, setPage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "seo" | "code" | "versions">("content");
  const [viewport, setViewport] = useState<ViewportSize>("desktop");

  // SEO fields
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [noIndex, setNoIndex] = useState(false);
  const [noFollow, setNoFollow] = useState(false);

  // Custom Code
  const [customCss, setCustomCss] = useState("");
  const [customJs, setCustomJs] = useState("");

  // Load page data
  useEffect(() => {
    async function loadPage() {
      if (!pageId || !portalId) return;

      try {
        const response = await api.get(`/api/v1/pages/${pageId}`);
        const pageData = response.data;
        setPage(pageData);

        // Set initial Puck data
        if (pageData.content && typeof pageData.content === "object") {
          setInitialData(pageData.content as Data);
        } else {
          setInitialData({
            content: [],
            root: { props: {} },
          });
        }

        // Load SEO fields
        setSeoTitle(pageData.seoTitle || "");
        setMetaDescription(pageData.metaDescription || "");
        setCanonicalUrl(pageData.canonicalUrl || "");
        setNoIndex(pageData.noIndex || false);
        setNoFollow(pageData.noFollow || false);

        // Load custom code
        setCustomCss(pageData.customCss || "");
        setCustomJs(pageData.customJs || "");
      } catch (error) {
        console.error("Failed to load page:", error);
        alert("Failed to load page");
      } finally {
        setIsLoading(false);
      }
    }

    loadPage();
  }, [pageId, portalId]);

  const handleSave = async (data: Data) => {
    setIsSaving(true);
    try {
      await api.put(`/api/v1/pages/${pageId}`, {
        content: data,
        seoTitle,
        metaDescription,
        canonicalUrl,
        noIndex,
        noFollow,
        customCss,
        customJs,
      });
      alert("Page saved successfully!");
    } catch (error) {
      console.error("Failed to save page:", error);
      alert("Failed to save page");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    try {
      await api.put(`/api/v1/pages/${pageId}`, {
        isPublished: true,
      });
      alert("Page published successfully!");
    } catch (error) {
      console.error("Failed to publish page:", error);
      alert("Failed to publish page");
    }
  };

  const viewportWidths = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading editor...</div>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Failed to load page data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{page?.title || "Untitled Page"}</h1>
            <p className="text-sm text-gray-600 mt-1">/{page?.slug}</p>
          </div>

          {/* Viewport Controls */}
          {activeTab === "content" && (
            <div className="flex items-center gap-2 border-l border-gray-300 pl-4">
              <button
                onClick={() => setViewport("desktop")}
                className={`p-2 rounded ${viewport === "desktop" ? "bg-indigo-100 text-indigo-600" : "text-gray-600 hover:bg-gray-100"}`}
                title="Desktop View"
              >
                <Monitor className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewport("tablet")}
                className={`p-2 rounded ${viewport === "tablet" ? "bg-indigo-100 text-indigo-600" : "text-gray-600 hover:bg-gray-100"}`}
                title="Tablet View"
              >
                <Tablet className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewport("mobile")}
                className={`p-2 rounded ${viewport === "mobile" ? "bg-indigo-100 text-indigo-600" : "text-gray-600 hover:bg-gray-100"}`}
                title="Mobile View"
              >
                <Smartphone className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard/pages")}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePublish}
            disabled={isSaving}
            className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            Publish
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 flex gap-1">
          <button
            onClick={() => setActiveTab("content")}
            className={`px-4 py-3 font-medium transition-colors flex items-center gap-2 ${
              activeTab === "content"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FileText className="w-4 h-4" />
            Content Builder
          </button>
          <button
            onClick={() => setActiveTab("seo")}
            className={`px-4 py-3 font-medium transition-colors flex items-center gap-2 ${
              activeTab === "seo"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Search className="w-4 h-4" />
            SEO Settings
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`px-4 py-3 font-medium transition-colors flex items-center gap-2 ${
              activeTab === "code"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Code className="w-4 h-4" />
            Custom Code
          </button>
          <button
            onClick={() => setActiveTab("versions")}
            className={`px-4 py-3 font-medium transition-colors flex items-center gap-2 ${
              activeTab === "versions"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Clock className="w-4 h-4" />
            Version History
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1">
        {activeTab === "content" && (
          <div className="h-full" style={{ maxWidth: viewportWidths[viewport], margin: "0 auto", transition: "max-width 0.3s ease" }}>
            <Puck
              config={config}
              data={initialData}
              onPublish={handleSave}
              overrides={{
                header: () => <></>,
              }}
            />
          </div>
        )}

        {activeTab === "seo" && (
          <div className="max-w-4xl mx-auto p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">SEO Settings</h2>
            <div className="bg-white rounded-lg shadow p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Title
                  <span className="text-gray-500 ml-2 font-normal">(Leave blank to use page title)</span>
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Custom SEO title for search engines"
                  maxLength={60}
                />
                <p className="text-xs text-gray-500 mt-1">{seoTitle.length}/60 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Brief description of this page for search engines"
                  rows={3}
                  maxLength={160}
                />
                <p className="text-xs text-gray-500 mt-1">{metaDescription.length}/160 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Canonical URL
                </label>
                <input
                  type="url"
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://example.com/canonical-page"
                />
                <p className="text-xs text-gray-500 mt-1">Specify the preferred URL for this content</p>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={noIndex}
                    onChange={(e) => setNoIndex(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700">No Index</span>
                  <span className="text-xs text-gray-500">(Hide from search engines)</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={noFollow}
                    onChange={(e) => setNoFollow(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700">No Follow</span>
                  <span className="text-xs text-gray-500">(Don't follow links)</span>
                </label>
              </div>

              <button
                onClick={() => handleSave(initialData)}
                disabled={isSaving}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save SEO Settings"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "code" && (
          <div className="max-w-4xl mx-auto p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Custom CSS & JavaScript</h2>
            <div className="bg-white rounded-lg shadow p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom CSS
                </label>
                <textarea
                  value={customCss}
                  onChange={(e) => setCustomCss(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder=".my-custom-class { color: red; }"
                  rows={10}
                  spellCheck={false}
                />
                <p className="text-xs text-gray-500 mt-1">Add custom CSS styles for this page only</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom JavaScript
                </label>
                <textarea
                  value={customJs}
                  onChange={(e) => setCustomJs(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="console.log('Hello from custom JS');"
                  rows={10}
                  spellCheck={false}
                />
                <p className="text-xs text-gray-500 mt-1">Add custom JavaScript for this page (runs in sandbox)</p>
              </div>

              <button
                onClick={() => handleSave(initialData)}
                disabled={isSaving}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save Custom Code"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "versions" && (
          <div className="max-w-4xl mx-auto p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Version History</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center text-gray-500 py-12">
                <Clock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg">Version history will appear here</p>
                <p className="text-sm mt-2">Track and restore previous versions of this page</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
