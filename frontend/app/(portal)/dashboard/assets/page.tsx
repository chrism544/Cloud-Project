"use client";
import { useState, useRef } from "react";
import { useAuthStore } from "@/lib/stores/auth";
import {
  useAssetContainers,
  useAssetContainer,
  useCreateAssetContainer,
  useDeleteAssetContainer,
  useAssets,
  useUploadAsset,
  useDeleteAsset,
} from "@/lib/hooks/useAssetContainers";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Plus, Trash2, Upload, Image as ImageIcon, File } from "lucide-react";

export default function AssetsPage() {
  const portalId = useAuthStore((s) => s.portalId);
  const { data: containers, isLoading } = useAssetContainers(portalId || undefined);
  const createContainer = useCreateAssetContainer();
  const deleteContainer = useDeleteAssetContainer();
  const uploadAsset = useUploadAsset();
  const deleteAsset = useDeleteAsset();

  const [selectedContainerId, setSelectedContainerId] = useState<string | null>(null);
  const [isCreatingContainer, setIsCreatingContainer] = useState(false);
  const [containerForm, setContainerForm] = useState({ name: "", slug: "", description: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: selectedContainer } = useAssetContainer(selectedContainerId || "");
  const { data: assets } = useAssets(selectedContainerId || undefined);

  const handleCreateContainer = async () => {
    if (!portalId || !containerForm.name || !containerForm.slug) return;
    try {
      const newContainer = await createContainer.mutateAsync({
        portalId,
        name: containerForm.name,
        slug: containerForm.slug,
        description: containerForm.description || undefined,
      });
      setIsCreatingContainer(false);
      setContainerForm({ name: "", slug: "", description: "" });
      setSelectedContainerId(newContainer.id);
    } catch (error) {
      console.error("Failed to create container:", error);
    }
  };

  const handleDeleteContainer = async (id: string) => {
    if (!confirm("Are you sure you want to delete this asset container?")) return;
    try {
      await deleteContainer.mutateAsync(id);
      if (selectedContainerId === id) setSelectedContainerId(null);
    } catch (error) {
      console.error("Failed to delete container:", error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedContainerId) return;

    try {
      await uploadAsset.mutateAsync({ containerId: selectedContainerId, file });
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to upload asset:", error);
    }
  };

  const handleDeleteAsset = async (id: string) => {
    if (!confirm("Are you sure you want to delete this asset?")) return;
    try {
      await deleteAsset.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete asset:", error);
    }
  };

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Asset Containers</h1>
          <button
            onClick={() => setIsCreatingContainer(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Container
          </button>
        </div>

        {isCreatingContainer && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Asset Container</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Container Name</label>
                <input
                  type="text"
                  value={containerForm.name}
                  onChange={(e) => setContainerForm({ ...containerForm, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Theme Assets"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  value={containerForm.slug}
                  onChange={(e) => setContainerForm({ ...containerForm, slug: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="theme-assets"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <textarea
                  value={containerForm.description}
                  onChange={(e) => setContainerForm({ ...containerForm, description: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  placeholder="Describe this asset container..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCreateContainer}
                  disabled={createContainer.isPending}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {createContainer.isPending ? "Creating..." : "Create"}
                </button>
                <button
                  onClick={() => {
                    setIsCreatingContainer(false);
                    setContainerForm({ name: "", slug: "", description: "" });
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Container List</h2>
              </div>
              {isLoading ? (
                <div className="p-4 text-center text-gray-600">Loading...</div>
              ) : containers && containers.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {containers.map((container) => (
                    <div
                      key={container.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between ${
                        selectedContainerId === container.id ? "bg-indigo-50" : ""
                      }`}
                      onClick={() => setSelectedContainerId(container.id)}
                    >
                      <div>
                        <div className="font-medium text-gray-900">{container.name}</div>
                        <div className="text-sm text-gray-600">{container.slug}</div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteContainer(container.id);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-600">No containers yet</div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedContainerId && selectedContainer ? (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedContainer.name}</h2>
                    {selectedContainer.description && (
                      <p className="text-sm text-gray-600 mt-1">{selectedContainer.description}</p>
                    )}
                  </div>
                  <label className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer text-sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploadAsset.isPending}
                    />
                  </label>
                </div>

                {uploadAsset.isPending && (
                  <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg">
                    Uploading file...
                  </div>
                )}

                {assets && assets.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {assets.map((asset) => (
                      <div
                        key={asset.id}
                        className="relative group bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:border-indigo-300 transition-colors"
                      >
                        <div className="aspect-square flex items-center justify-center p-4">
                          {asset.mimeType.startsWith("image/") ? (
                            <img
                              src={asset.url}
                              alt={asset.originalName}
                              className="max-w-full max-h-full object-contain"
                            />
                          ) : (
                            <File className="w-16 h-16 text-gray-400" />
                          )}
                        </div>
                        <div className="p-3 bg-white border-t border-gray-200">
                          <div className="text-sm font-medium text-gray-900 truncate" title={asset.originalName}>
                            {asset.originalName}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {(asset.size / 1024).toFixed(1)} KB
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteAsset(asset.id)}
                          className="absolute top-2 right-2 p-2 bg-white rounded-lg shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-600">
                    <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No assets yet</h3>
                    <p className="mt-2">Upload files to get started.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <h3 className="text-lg font-medium text-gray-900">No container selected</h3>
                <p className="mt-2 text-gray-600">Select a container from the list to manage its assets.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
