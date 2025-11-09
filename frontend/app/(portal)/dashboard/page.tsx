"use client";
import { useAuthStore } from "@/lib/stores/auth";
import { usePortal } from "@/lib/hooks/usePortals";
import { usePages } from "@/lib/hooks/usePages";
import { useMenus } from "@/lib/hooks/useMenus";
import { useAssetContainers } from "@/lib/hooks/useAssetContainers";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { FileText, Menu, Palette, Upload } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const portalId = useAuthStore((s) => s.portalId);
  const { data: portal } = usePortal(portalId || "");
  const { data: pages } = usePages(portalId || undefined);
  const { data: menus } = useMenus(portalId || undefined);
  const { data: containers } = useAssetContainers(portalId || undefined);

  const stats = [
    { name: "Pages", value: pages?.length || 0, icon: FileText, href: "/dashboard/pages" },
    { name: "Menus", value: menus?.length || 0, icon: Menu, href: "/dashboard/menus" },
    { name: "Asset Containers", value: containers?.length || 0, icon: Palette, href: "/dashboard/assets" },
  ];

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        {portal && (
          <p className="mt-2 text-gray-600">
            Managing: <span className="font-semibold">{portal.name}</span> ({portal.subdomain})
          </p>
        )}

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <a
              key={stat.name}
              href={stat.href}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon className="w-12 h-12 text-indigo-600" />
              </div>
            </a>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/dashboard/pages"
              className="block px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="font-medium text-gray-900">Create a new page</span>
              <p className="text-sm text-gray-600 mt-1">Add content to your portal</p>
            </a>
            <a
              href="/dashboard/menus"
              className="block px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="font-medium text-gray-900">Manage navigation</span>
              <p className="text-sm text-gray-600 mt-1">Organize your menu structure</p>
            </a>
            <a
              href="/dashboard/assets"
              className="block px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="font-medium text-gray-900">Upload assets</span>
              <p className="text-sm text-gray-600 mt-1">Manage images and files</p>
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
