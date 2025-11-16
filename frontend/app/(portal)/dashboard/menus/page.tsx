"use client";
export const dynamic = 'force-dynamic';
import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/stores/auth";
import { usePortals } from "@/lib/hooks/usePortals"; // Import usePortals
import {
  useMenus,
  useMenu,
  useCreateMenu,
  useDeleteMenu,
  useCreateMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
  useReorderMenuItems,
} from "@/lib/hooks/useMenus";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { navigation as adminNavigation } from "@/components/layouts/DashboardLayout";
import { Plus, Trash2, GripVertical, Link as LinkIcon, FileText, ChevronDown } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type MenuItem = {
  id: string;
  label: string;
  url: string | null;
  pageId: string | null;
  parentId: string | null;
  order: number;
};

function SortableMenuItem({ item, onDelete }: { item: MenuItem; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-4 mb-2"
    >
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
        <GripVertical className="w-5 h-5" />
      </button>
      <div className="flex-1">
        <div className="font-medium text-gray-900">{item.label}</div>
        <div className="text-sm text-gray-600">
          {item.url ? (
            <span className="flex items-center gap-1">
              <LinkIcon className="w-3 h-3" />
              {item.url}
            </span>
          ) : item.pageId ? (
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              Page: {item.pageId}
            </span>
          ) : (
            <span className="text-gray-400">No link</span>
          )}
        </div>
      </div>
      <button
        onClick={() => onDelete(item.id)}
        className="text-red-600 hover:text-red-900"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}

export default function MenusPage() {
  const { portalId: authPortalId, setPortal } = useAuthStore(); // Get setPortal from useAuthStore
  const { data: portals, isLoading: isLoadingPortals } = usePortals(); // Fetch all portals

  const [selectedPortalId, setSelectedPortalId] = useState<string | undefined>(authPortalId || undefined);

  // Update local selectedPortalId when authPortalId changes
  useEffect(() => {
    if (authPortalId && authPortalId !== selectedPortalId) {
      setSelectedPortalId(authPortalId);
    }
  }, [authPortalId]);

  // Update authPortalId when local selectedPortalId changes
  useEffect(() => {
    if (selectedPortalId && selectedPortalId !== authPortalId) {
      setPortal(selectedPortalId);
    }
  }, [selectedPortalId]);

  const { data: menus, isLoading } = useMenus(selectedPortalId); // Use selectedPortalId here
  const createMenu = useCreateMenu();
  const deleteMenu = useDeleteMenu();
  const createMenuItem = useCreateMenuItem();
  const deleteMenuItem = useDeleteMenuItem();
  const reorderMenuItems = useReorderMenuItems();

  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [isCreatingMenu, setIsCreatingMenu] = useState(false);
  const [isCreatingItem, setIsCreatingItem] = useState(false);
  const [menuName, setMenuName] = useState("");
  const [itemForm, setItemForm] = useState({ label: "", url: "", pageId: "" });
  const [isImportingSidebar, setIsImportingSidebar] = useState(false);
  const [populateWithSidebar, setPopulateWithSidebar] = useState(true);
  const [createError, setCreateError] = useState<string | null>(null);

  const { data: selectedMenu } = useMenu(selectedMenuId || "");
  const [localItems, setLocalItems] = useState<MenuItem[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Update local items when menu data changes
  useEffect(() => { // Changed from useState to useEffect
    if (selectedMenu?.items) {
      const items = [...selectedMenu.items]
        .sort((a: any, b: any) => (a.displayOrder ?? a.order ?? 0) - (b.displayOrder ?? b.order ?? 0))
        .map((it: any) => ({
          id: it.id,
          label: it.label ?? it.title ?? "",
          url: it.url ?? it.linkUrl ?? null,
          pageId: it.pageId ?? null,
          parentId: it.parentId ?? null,
          order: it.order ?? it.displayOrder ?? 0,
        }));
      setLocalItems(items);
    } else {
      setLocalItems([]); // Clear items if no menu selected or no items
    }
  }, [selectedMenu]); // Depend on selectedMenu

  const slugify = (s: string) =>
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const handleCreateMenu = async () => {
    if (!selectedPortalId || !menuName) return; // Require portal and name
    try {
      setCreateError(null);
      const newMenu = await createMenu.mutateAsync({
        portalId: selectedPortalId,
        name: menuName,
        location: slugify(menuName) || `menu-${Date.now()}`,
      });
      setIsCreatingMenu(false);
      setMenuName("");
      setSelectedMenuId(newMenu.id);

      // Optional: immediately populate with sidebar items
      if (populateWithSidebar) {
        let order = 0;
        for (const nav of adminNavigation) {
          await createMenuItem.mutateAsync({
            menuId: newMenu.id,
            label: nav.name,
            url: nav.href,
            order: order++,
          });
        }
      }
    } catch (error: any) {
      console.error("Failed to create menu:", error);
      const msg = error?.response?.data?.error?.message || error?.message || "Failed to create menu";
      setCreateError(msg);
    }
  };

  const handleDeleteMenu = async (id: string) => {
    if (!confirm("Are you sure you want to delete this menu?")) return;
    try {
      await deleteMenu.mutateAsync(id);
      if (selectedMenuId === id) setSelectedMenuId(null);
    } catch (error) {
      console.error("Failed to delete menu:", error);
    }
  };

  const handleCreateItem = async () => {
    if (!selectedMenuId || !itemForm.label) return;
    try {
      await createMenuItem.mutateAsync({
        menuId: selectedMenuId,
        label: itemForm.label,
        url: itemForm.url || undefined,
        pageId: itemForm.pageId || undefined,
        order: localItems.length,
      });
      setIsCreatingItem(false);
      setItemForm({ label: "", url: "", pageId: "" });
    } catch (error) {
      console.error("Failed to create menu item:", error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      if (!selectedMenuId) return;
      await deleteMenuItem.mutateAsync({ menuId: selectedMenuId, id });
    } catch (error) {
      console.error("Failed to delete menu item:", error);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !selectedMenuId) return;

    const oldIndex = localItems.findIndex((item) => item.id === active.id);
    const newIndex = localItems.findIndex((item) => item.id === over.id);

    const newItems = arrayMove(localItems, oldIndex, newIndex);
    setLocalItems(newItems);

    try {
      await reorderMenuItems.mutateAsync({
        menuId: selectedMenuId,
        items: newItems.map((item, index) => ({
          id: item.id,
          order: index,
          parentId: item.parentId,
        })),
      });
    } catch (error) {
      console.error("Failed to reorder items:", error);
      setLocalItems(localItems);
    }
  };

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Menus</h1>
          <div className="flex items-center gap-4">
            {/* Portal Selector Dropdown */}
            <div className="relative">
              <select
                value={selectedPortalId ?? "__all__"}
                onChange={(e) => {
                  const v = e.target.value;
                  setSelectedPortalId(v === "__all__" ? undefined : v);
                }}
                className="w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={isLoadingPortals}
              >
                <option value="__all__">All Portals</option>
                {portals?.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.subdomain})</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            </div>

            <button
              onClick={() => setIsCreatingMenu(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Menu
            </button>

            <button
              onClick={async () => {
                if (!selectedPortalId) return;
                try {
                  setIsImportingSidebar(true);
                  const menuName = "Sidebar Navigation";
                  const existing = (menus || []).find((m: any) => (m.name || "").toLowerCase() === menuName.toLowerCase());
                  const targetMenuId = existing?.id || (await createMenu.mutateAsync({
                    portalId: selectedPortalId,
                    name: menuName,
                    location: slugify(menuName),
                  })).id;
                  setSelectedMenuId(targetMenuId);
                  let order = 0;
                  for (const nav of adminNavigation) {
                    await createMenuItem.mutateAsync({
                      menuId: targetMenuId,
                      label: nav.name,
                      url: nav.href,
                      order: order++,
                    });
                  }
                } finally {
                  setIsImportingSidebar(false);
                }
              }}
              disabled={!selectedPortalId || isImportingSidebar}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              title="Create a menu and import the sidebar items"
            >
              Import Sidebar
            </button>

            <button
              onClick={async () => {
                if (!selectedPortalId) return;
                const names = ["User portal", "Admin portal", "Test portal"];                
                // Avoid duplicates by name in current list
                const existingNames = new Set((menus || []).map((m: any) => m.name.toLowerCase()));
                for (const name of names) {
                  if (existingNames.has(name.toLowerCase())) continue;
                  await createMenu.mutateAsync({
                    portalId: selectedPortalId,
                    name,
                    location: slugify(name),
                  });
                }
              }}
              disabled={!selectedPortalId || createMenu.isPending}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              title="Add default menus (User/Admin/Test) to this portal"
            >
              Bulk add
            </button>
          </div>
        </div>

        {isCreatingMenu && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Menu</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Menu Name</label>
                <input
                  type="text"
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Main Navigation"
                />
              </div>
              {createError && (
                <div className="text-red-600 text-sm mb-2">{createError}</div>
              )}
              <div className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={populateWithSidebar}
                    onChange={(e) => setPopulateWithSidebar(e.target.checked)}
                  />
                  Populate with sidebar items
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={handleCreateMenu}
                    disabled={createMenu.isPending || !selectedPortalId}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {createMenu.isPending ? "Creating..." : "Create"}
                  </button>
                  <button
                    onClick={() => {
                      setIsCreatingMenu(false);
                      setMenuName("");
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Menu List</h2>
              </div>
              {isLoading || isLoadingPortals ? ( // Add isLoadingPortals here
                <div className="p-4 text-center text-gray-600">Loading...</div>
              ) : menus && menus.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {menus.map((menu) => (
                    <div
                      key={menu.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between ${
                        selectedMenuId === menu.id ? "bg-indigo-50" : ""
                      }`}
                      onClick={() => setSelectedMenuId(menu.id)}
                    >
                      <div>
                        <div className="font-medium text-gray-900 flex items-center gap-2">
                          {menu.name}
                          {!selectedPortalId && (
                            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
                              {(portals || []).find((p) => p.id === menu.portalId)?.name || menu.portalId}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">{menu.items?.length || 0} items</div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMenu(menu.id);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-600">No menus found.</div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedMenuId && selectedMenu ? (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">{selectedMenu.name}</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={async () => {
                        if (!selectedMenuId) return;
                        const existing = new Set(localItems.map((i) => i.label.toLowerCase()));
                        let order = localItems.length;
                        for (const nav of adminNavigation) {
                          const label = nav.name;
                          if (existing.has(label.toLowerCase())) continue;
                          await createMenuItem.mutateAsync({
                            menuId: selectedMenuId,
                            label,
                            url: nav.href,
                            order: order++,
                          });
                        }
                      }}
                      className="flex items-center px-3 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 text-sm"
                    >
                      Import Sidebar
                    </button>
                    <button
                      onClick={() => setIsCreatingItem(true)}
                      className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </button>
                  </div>
                </div>

                {isCreatingItem && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">New Menu Item</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                        <input
                          type="text"
                          value={itemForm.label}
                          onChange={(e) => setItemForm({ ...itemForm, label: e.target.value })}
                          className="w-full rounded border border-gray-300 px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Menu item label"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL (optional)</label>
                        <input
                          type="text"
                          value={itemForm.url}
                          onChange={(e) => setItemForm({ ...itemForm, url: e.target.value })}
                          className="w-full rounded border border-gray-300 px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="/path or https://..."
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleCreateItem}
                          disabled={createMenuItem.isPending}
                          className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm disabled:opacity-50"
                        >
                          {createMenuItem.isPending ? "Adding..." : "Add"}
                        </button>
                        <button
                          onClick={() => {
                            setIsCreatingItem(false);
                            setItemForm({ label: "", url: "", pageId: "" });
                          }}
                          className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {localItems.length > 0 ? (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={localItems.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                      {localItems.map((item) => (
                        <SortableMenuItem key={item.id} item={item} onDelete={handleDeleteItem} />
                      ))}
                    </SortableContext>
                  </DndContext>
                ) : (
                  <div className="text-center py-12 text-gray-600">
                    No menu items yet. Click "Add Item" to get started.
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <h3 className="text-lg font-medium text-gray-900">No menu selected</h3>
                <p className="mt-2 text-gray-600">Select a menu from the list to manage its items.</p>
                {selectedPortalId && (
                  <div className="mt-6">
                    <button
                      onClick={async () => {
                        try {
                          setIsImportingSidebar(true);
                          const menuName = "Sidebar Navigation";
                          const existing = (menus || []).find((m: any) => (m.name || "").toLowerCase() === menuName.toLowerCase());
                          const targetMenuId = existing?.id || (await createMenu.mutateAsync({
                            portalId: selectedPortalId!,
                            name: menuName,
                            location: slugify(menuName),
                          })).id;
                          setSelectedMenuId(targetMenuId);
                          let order = 0;
                          for (const nav of adminNavigation) {
                            await createMenuItem.mutateAsync({
                              menuId: targetMenuId,
                              label: nav.name,
                              url: nav.href,
                              order: order++,
                            });
                          }
                        } finally {
                          setIsImportingSidebar(false);
                        }
                      }}
                      className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 text-sm"
                    >
                      Quick import sidebar
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
