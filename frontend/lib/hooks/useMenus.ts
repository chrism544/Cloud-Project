import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

type MenuItem = {
  id: string;
  label: string;
  url: string | null;
  pageId: string | null;
  parentId: string | null;
  order: number;
  children?: MenuItem[];
};

type Menu = {
  id: string;
  portalId: string;
  name: string;
  items: MenuItem[];
  createdAt: string;
  updatedAt: string;
};

type CreateMenuInput = {
  portalId: string;
  name: string;
};

type UpdateMenuInput = Partial<CreateMenuInput>;

type CreateMenuItemInput = {
  menuId: string;
  label: string;
  url?: string;
  pageId?: string;
  parentId?: string;
  order?: number;
};

type UpdateMenuItemInput = Partial<Omit<CreateMenuItemInput, "menuId">>;

export function useMenus(portalId?: string) {
  return useQuery({
    queryKey: ["menus", portalId],
    queryFn: async () => {
      const url = portalId ? `/api/v1/menus?portalId=${portalId}` : "/api/v1/menus";
      const { data } = await api.get<Menu[]>(url);
      return data;
    },
  });
}

export function useMenu(id: string) {
  return useQuery({
    queryKey: ["menus", id],
    queryFn: async () => {
      const { data } = await api.get<Menu>(`/api/v1/menus/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateMenu() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateMenuInput) => {
      const { data } = await api.post<Menu>("/api/v1/menus", input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
  });
}

export function useUpdateMenu(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateMenuInput) => {
      const { data } = await api.patch<Menu>(`/api/v1/menus/${id}`, input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      queryClient.invalidateQueries({ queryKey: ["menus", id] });
    },
  });
}

export function useDeleteMenu() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/v1/menus/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
  });
}

export function useCreateMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateMenuItemInput) => {
      const { data } = await api.post<MenuItem>("/api/v1/menu-items", input);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      if (variables.menuId) {
        queryClient.invalidateQueries({ queryKey: ["menus", variables.menuId] });
      }
    },
  });
}

export function useUpdateMenuItem(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateMenuItemInput) => {
      const { data } = await api.patch<MenuItem>(`/api/v1/menu-items/${id}`, input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
  });
}

export function useDeleteMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/v1/menu-items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
  });
}

export function useReorderMenuItems() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ menuId, items }: { menuId: string; items: { id: string; order: number; parentId: string | null }[] }) => {
      const { data } = await api.patch(`/api/v1/menus/${menuId}/reorder`, { items });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      queryClient.invalidateQueries({ queryKey: ["menus", variables.menuId] });
    },
  });
}
