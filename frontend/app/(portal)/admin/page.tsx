"use client";
import AdminLayout from "./layout";
import { useAuthStore } from "@/lib/stores/auth";
import Link from "next/link";

export default function AdminHomePage() {
  const portalId = useAuthStore((s) => s.portalId);

  const cards = [
    { title: "Themes", href: "/admin/themes", desc: "Manage design tokens and activate themes" },
    { title: "Users", href: "/admin/users", desc: "Manage users, roles and permissions" },
    { title: "Analytics", href: "/admin/analytics", desc: "View portal analytics and reports" },
    { title: "Security", href: "/admin/security", desc: "Review audit logs and security alerts" },
  ];

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin</h1>
        <p className="mt-2 text-gray-600">Portal: {portalId || "-"}</p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <Link key={c.title} href={c.href} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow block">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{c.title}</p>
                  <p className="mt-2 text-sm text-gray-600">{c.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
