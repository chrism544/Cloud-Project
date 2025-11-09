"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Data } from "@measured/puck";
import PageRenderer from "@/components/PageRenderer";
import { useAuthStore } from "@/lib/stores/auth";
import api from "@/lib/api";

export default function PagePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const pageId = params.id as string;
  const portalId = useAuthStore((s) => s.portalId);

  const [page, setPage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPage() {
      if (!pageId || !portalId) return;

      try {
        const response = await api.get(`/api/v1/pages/${pageId}`);
        setPage(response.data);
      } catch (error) {
        console.error("Failed to load page:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadPage();
  }, [pageId, portalId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading page...</div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Page not found</div>
      </div>
    );
  }

  const pageData: Data = page.content && typeof page.content === "object"
    ? page.content
    : { content: [], root: { props: {} } };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preview Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{page.title}</h1>
          <p className="text-sm text-gray-600 mt-1">Preview: /{page.slug}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard/pages")}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back to Pages
          </button>
          <button
            onClick={() => router.push(`/dashboard/pages/${pageId}/edit`)}
            className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Edit Page
          </button>
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <PageRenderer data={pageData} />
      </div>
    </div>
  );
}
