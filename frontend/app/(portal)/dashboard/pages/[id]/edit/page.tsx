"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SerializedNodes } from "@craftjs/core";
import { useAuthStore } from "@/lib/stores/auth";
import api from "@/lib/api";
import CraftEditor from "@/lib/craftjs/editor/CraftEditor";
import { convertPuckToCraft, validatePuckData } from "@/lib/craftjs/utils/puckToCraftMigration";

export default function PageEditorV2() {
  const params = useParams();
  const router = useRouter();
  const pageId = params.id as string;
  const portalId = useAuthStore((s) => s.portalId);

  const [initialData, setInitialData] = useState<SerializedNodes | null>(null);
  const [page, setPage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load page data
  useEffect(() => {
    async function loadPage() {
      if (!pageId || !portalId) {
        console.log("Missing pageId or portalId:", { pageId, portalId });
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get(`/api/v1/pages/${pageId}`);
        const pageData = response.data;
        setPage(pageData);

        if (pageData.content && typeof pageData.content === "object" && Object.keys(pageData.content).length > 0) {
          // Check if data is in Puck format and migrate if needed
          if (validatePuckData(pageData.content)) {
            console.log("Migrating Puck data to Craft.js format...");
            const craftData = convertPuckToCraft(pageData.content);
            setInitialData(craftData);
          } else {
            // Already in Craft.js format
            setInitialData(pageData.content as SerializedNodes);
          }
        } else {
          // Empty page - set empty object to trigger editor initialization
          setInitialData({});
        }
      } catch (error) {
        console.error("Failed to load page:", error);
        alert("Failed to load page");
      } finally {
        setIsLoading(false);
      }
    }

    loadPage();
  }, [pageId, portalId]);

  const handleSave = async (data: SerializedNodes) => {
    try {
      await api.put(`/api/v1/pages/${pageId}`, { content: data });
      alert("Page saved successfully!");
    } catch (error) {
      console.error("Failed to save page:", error);
      alert("Failed to save page");
    }
  };

  const handlePublish = async () => {
    try {
      await api.put(`/api/v1/pages/${pageId}`, { isPublished: true });
      alert("Page published successfully!");
    } catch (error) {
      console.error("Failed to publish page:", error);
      alert("Failed to publish page");
    }
  };

  const handlePreview = () => {
    router.push(`/dashboard/pages/${pageId}/preview`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-lg text-gray-400">Loading editor...</div>
      </div>
    );
  }

  if (!portalId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="text-lg text-red-600">Portal not selected</div>
          <div className="text-sm text-gray-500 mt-2">Please log in again to select a portal</div>
          <button
            onClick={() => router.push("/login")}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (initialData === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-lg text-red-600">Failed to load page data</div>
      </div>
    );
  }

  return (
    <CraftEditor
      initialData={initialData}
      onSave={handleSave}
      onPublish={handlePublish}
      onPreview={handlePreview}
      pageTitle={page?.title || "Untitled Page"}
      pageSlug={page?.slug || ""}
    />
  );
}
