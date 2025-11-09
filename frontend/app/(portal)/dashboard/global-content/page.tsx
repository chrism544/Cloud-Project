"use client";
export const dynamic = 'force-dynamic';
import { useState } from "react";
import { useAuthStore } from "@/lib/stores/auth";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Package, Plus, Edit, Trash2, Copy } from "lucide-react";
import api from "@/lib/api";

export default function GlobalContentPage() {
  const portalId = useAuthStore((s) => s.portalId);
  const [blocks, setBlocks] = useState([
    { id: "1", name: "Header Block", key: "global-header", category: "Navigation", content: { type: "header" } },
    { id: "2", name: "Footer Block", key: "global-footer", category: "Navigation", content: { type: "footer" } },
    { id: "3", name: "CTA Banner", key: "cta-banner", category: "Marketing", content: { type: "banner" } },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ name: "", key: "", category: "" });

  const handleCreate = async () => {
    if (!portalId || !formData.name || !formData.key) return;
    try {
      await api.post(`/api/v1/global-content`, {
        portalId,
        name: formData.name,
        key: formData.key,
        category: formData.category,
        content: {},
      });
      setIsCreating(false);
      setFormData({ name: "", key: "", category: "" });
      alert("Block created successfully!");
    } catch (error) {
      console.error("Failed to create block:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this reusable block?")) return;
    try {
      await api.delete(`/api/v1/global-content/${id}`);
      setBlocks(blocks.filter(b => b.id !== id));
    } catch (error) {
      console.error("Failed to delete block:", error);
    }
  };

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reusable Content Blocks</h1>
            <p className="text-gray-600 mt-1">Create reusable content blocks to use across multiple pages</p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Block
          </button>
        </div>

        {isCreating && (
          <div className="mb-6 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create Reusable Block</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Block Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Header Block"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unique Key</label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="global-header"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Navigation"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Create Block
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setFormData({ name: "", key: "", category: "" });
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blocks.map((block) => (
            <div key={block.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Package className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{block.name}</h3>
                    <p className="text-sm text-gray-600">{block.key}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                  {block.category}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Edit Block"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Copy Key"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(block.id)}
                  className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  title="Delete Block"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {blocks.length === 0 && !isCreating && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reusable blocks yet</h3>
            <p className="text-gray-600 mb-6">Create reusable content blocks to use across multiple pages</p>
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Create Your First Block
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
