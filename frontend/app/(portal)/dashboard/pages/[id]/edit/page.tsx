"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth";
import api from "@/lib/api";

export default function PageEditor() {
  const params = useParams();
  const router = useRouter();
  const pageId = params.id as string;
  const portalId = useAuthStore((s) => s.portalId);

  const [page, setPage] = useState<any>(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPage() {
      if (!pageId || !portalId) return;
      
      try {
        const response = await api.get(`/api/v1/pages/${pageId}`);
        const pageData = response.data;
        setPage(pageData);
        setContent(pageData.content?.html || "");
      } catch (error) {
        console.error("Failed to load page:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadPage();
  }, [pageId, portalId]);

  const handleSave = async () => {
    try {
      await api.put(`/api/v1/pages/${pageId}`, { 
        content: { html: content }
      });
      alert("Page saved successfully!");
    } catch (error) {
      console.error("Failed to save page:", error);
      alert("Failed to save page");
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">{page?.title || "Edit Page"}</h1>
        <div className="space-x-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
          >
            Save
          </button>
          <button
            onClick={() => router.push(`/dashboard/pages/${pageId}/preview`)}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Preview
          </button>
        </div>
      </div>
      
      <div className="flex-1 p-8">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full p-4 border rounded font-mono"
          placeholder="Enter HTML content here..."
        />
      </div>
    </div>
  );
}