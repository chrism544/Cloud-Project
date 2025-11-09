import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

type Portal = {
  id: string;
  name: string;
  subdomain: string;
  customDomain: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type CreatePortalInput = {
  name: string;
  subdomain: string;
  customDomain?: string;
};

type UpdatePortalInput = Partial<CreatePortalInput> & {
  isActive?: boolean;
};

export function usePortals() {
  return useQuery({
    queryKey: ["portals"],
    queryFn: async () => {
      const { data } = await api.get<Portal[]>("/api/v1/portals");
      return data;
    },
  });
}

export function usePortal(id: string) {
  return useQuery({
    queryKey: ["portals", id],
    queryFn: async () => {
      const { data } = await api.get<Portal>(`/api/v1/portals/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreatePortal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreatePortalInput) => {
      const { data } = await api.post<Portal>("/api/v1/portals", input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portals"] });
    },
  });
}

export function useUpdatePortal(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdatePortalInput) => {
      const { data } = await api.patch<Portal>(`/api/v1/portals/${id}`, input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portals"] });
      queryClient.invalidateQueries({ queryKey: ["portals", id] });
    },
  });
}

export function useDeletePortal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/v1/portals/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portals"] });
    },
  });
}
