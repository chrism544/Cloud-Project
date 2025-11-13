"use client";
export const dynamic = 'force-dynamic';
import { useState } from "react";
import { useAuthStore } from "@/lib/stores/auth";
import { usePages, useCreatePage, useUpdatePage, useDeletePage } from "@/lib/hooks/usePages";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Plus, Edit, Trash2, Eye, EyeOff, FileText, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PagesPage() {
  const router = useRouter();
  const portalId = useAuthStore((s) => s.portalId);
  const { data: pages, isLoading } = usePages(portalId || undefined);
  const createPage = useCreatePage();
  const updatePage = useUpdatePage("");
  const deletePage = useDeletePage();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", slug: "", content: {} });

  const handleCreate = async () => {
    console.log("Create button clicked", { portalId, formData });
    if (!portalId) {
      alert("Portal ID is missing. Please log in again.");
      return;
    }
    if (!formData.title) {
      alert("Please enter a title");
      return;
    }
    if (!formData.slug) {
      alert("Please enter a slug");
      return;
    }
    try {
      const newPage = await createPage.mutateAsync({
        portalId,
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
      });
      console.log("Page created:", newPage);
      setIsCreating(false);
      setFormData({ title: "", slug: "", content: {} });
      // Immediately redirect to Puck editor
      router.push(`/dashboard/pages/${newPage.id}/edit`);
    } catch (error: any) {
      console.error("Failed to create page:", error);
      alert(`Failed to create page: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    try {
      await updatePage.mutateAsync({ isPublished: !isPublished });
    } catch (error) {
      console.error("Failed to toggle publish:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this page?")) return;
    try {
      await deletePage.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete page:", error);
    }
  };

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Pages</h1>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Page
          </button>
        </div>

        {isCreating && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Page</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Page title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="page-slug"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCreate}
                  disabled={createPage.isPending}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {createPage.isPending ? "Creating..." : "Create"}
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setFormData({ title: "", slug: "", content: {} });
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="mt-6 text-center text-gray-600">Loading pages...</div>
        ) : pages && pages.length > 0 ? (
          <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{page.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">/{page.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          page.isPublished
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {page.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(page.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/dashboard/pages/${page.id}/preview`)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Preview"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/pages/${page.id}/edit`)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit Page Builder"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleTogglePublish(page.id, page.isPublished)}
                          className="text-green-600 hover:text-green-900"
                          title={page.isPublished ? "Unpublish" : "Publish"}
                        >
                          {page.isPublished ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={() => handleDelete(page.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 bg-white rounded-lg shadow p-12 text-center">
            <FileText className="w-16 h-16 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No pages yet</h3>
            <p className="mt-2 text-gray-600">Get started by creating your first page.</p>
            <button
              onClick={() => setIsCreating(true)}
              className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Create Page
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
