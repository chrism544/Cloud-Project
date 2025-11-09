import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

type AssetContainer = {
  id: string;
  portalId: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

type Asset = {
  id: string;
  containerId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
  updatedAt: string;
};

type CreateAssetContainerInput = {
  portalId: string;
  name: string;
  slug: string;
  description?: string;
};

type UpdateAssetContainerInput = Partial<CreateAssetContainerInput>;

export function useAssetContainers(portalId?: string) {
  return useQuery({
    queryKey: ["asset-containers", portalId],
    queryFn: async () => {
      const url = portalId ? `/api/v1/asset-containers?portalId=${portalId}` : "/api/v1/asset-containers";
      const { data } = await api.get<AssetContainer[]>(url);
      return data;
    },
  });
}

export function useAssetContainer(id: string) {
  return useQuery({
    queryKey: ["asset-containers", id],
    queryFn: async () => {
      const { data } = await api.get<AssetContainer>(`/api/v1/asset-containers/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateAssetContainer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateAssetContainerInput) => {
      const { data } = await api.post<AssetContainer>("/api/v1/asset-containers", input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["asset-containers"] });
    },
  });
}

export function useUpdateAssetContainer(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateAssetContainerInput) => {
      const { data } = await api.patch<AssetContainer>(`/api/v1/asset-containers/${id}`, input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["asset-containers"] });
      queryClient.invalidateQueries({ queryKey: ["asset-containers", id] });
    },
  });
}

export function useDeleteAssetContainer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/v1/asset-containers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["asset-containers"] });
    },
  });
}

export function useAssets(containerId?: string) {
  return useQuery({
    queryKey: ["assets", containerId],
    queryFn: async () => {
      const url = containerId ? `/api/v1/assets?containerId=${containerId}` : "/api/v1/assets";
      const { data } = await api.get<Asset[]>(url);
      return data;
    },
  });
}

export function useUploadAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ containerId, file }: { containerId: string; file: File }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("containerId", containerId);
      const { data } = await api.post<Asset>("/api/v1/assets", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["assets", variables.containerId] });
    },
  });
}

export function useDeleteAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/v1/assets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}
