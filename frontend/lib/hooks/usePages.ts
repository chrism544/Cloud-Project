import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

type Page = {
  id: string;
  portalId: string;
  title: string;
  slug: string;
  content: any;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type CreatePageInput = {
  portalId: string;
  title: string;
  slug: string;
  content?: any;
};

type UpdatePageInput = Partial<CreatePageInput> & {
  isPublished?: boolean;
};

export function usePages(portalId?: string) {
  return useQuery({
    queryKey: ["pages", portalId],
    queryFn: async () => {
      const url = portalId ? `/api/v1/pages?portalId=${portalId}` : "/api/v1/pages";
      const { data } = await api.get<Page[]>(url);
      return data;
    },
  });
}

export function usePage(id: string) {
  return useQuery({
    queryKey: ["pages", id],
    queryFn: async () => {
      const { data } = await api.get<Page>(`/api/v1/pages/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreatePage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreatePageInput) => {
      const { data } = await api.post<Page>("/api/v1/pages", input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });
}

export function useUpdatePage(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdatePageInput) => {
      const { data } = await api.patch<Page>(`/api/v1/pages/${id}`, input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      queryClient.invalidateQueries({ queryKey: ["pages", id] });
    },
  });
}

export function useDeletePage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/v1/pages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });
}
