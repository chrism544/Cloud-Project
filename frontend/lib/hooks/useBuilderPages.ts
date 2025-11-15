import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

type BuilderPage = {
  id: string;
  portalId: string;
  slug: string;
  name: string;
  pageData: any;
  pageHtml: string | null;
  pageCss: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

type CreateBuilderPageInput = {
  portalId: string;
  name: string;
  slug: string;
};

type UpdateBuilderPageInput = {
  'gjs-html'?: string;
  'gjs-css'?: string;
  'gjs-components'?: any;
};

export function useBuilderPages(portalId: string) {
  return useQuery({
    queryKey: ["builder-pages", portalId],
    queryFn: async () => {
      const { data } = await api.get<BuilderPage[]>(`/api/v1/builder/pages?portalId=${portalId}`);
      return data;
    },
    enabled: !!portalId,
  });
}

export function useBuilderPage(id: string) {
  return useQuery({
    queryKey: ["builder-pages", id],
    queryFn: async () => {
      const { data } = await api.get<BuilderPage>(`/api/v1/builder/pages/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateBuilderPage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateBuilderPageInput) => {
      const { data } = await api.post<BuilderPage>("/api/v1/builder/pages", input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["builder-pages"] });
    },
  });
}

export function useUpdateBuilderPage(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateBuilderPageInput) => {
      const { data } = await api.put<BuilderPage>(`/api/v1/builder/pages/${id}`, input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["builder-pages"] });
      queryClient.invalidateQueries({ queryKey: ["builder-pages", id] });
    },
  });
}

export function usePublishBuilderPage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/api/v1/builder/pages/${id}/publish`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["builder-pages"] });
    },
  });
}

export function useDeleteBuilderPage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/v1/builder/pages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["builder-pages"] });
    },
  });
}