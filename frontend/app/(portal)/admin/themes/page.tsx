"use client";
import AdminLayout from "../layout";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/stores/auth";
import { useEffect, useState } from "react";

interface Theme {
  id: string;
  name: string;
  portalId: string;
  isActive: boolean;
}

export default function AdminThemesPage() {
  const portalId = useAuthStore((s) => s.portalId) || "";
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!portalId) return;
    setLoading(true);
    try {
      const res = await api.get("/api/v1/admin/themes", {
        params: { portalId },
        headers: { "X-Portal-ID": portalId },
      });
      setThemes(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portalId]);

  const activate = async (id: string) => {
    await api.post(`/api/v1/admin/themes/${id}/activate`, {}, { headers: { "X-Portal-ID": portalId } });
    await load();
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Themes</h1>
        </div>
        <div className="mt-6 bg-white rounded-lg shadow divide-y">
          {loading && <div className="p-4 text-gray-500">Loading…</div>}
          {!loading && themes.length === 0 && <div className="p-4 text-gray-500">No themes found</div>}
          {!loading &&
            themes.map((t) => (
              <div key={t.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900"><a href={`/admin/themes/${t.id}`} className="hover:underline">{t.name}</a></div>
                  <div className="text-sm text-gray-500">{t.isActive ? "Active" : "Inactive"}</div>
                </div>
                {!t.isActive && (
                  <button
                    onClick={() => activate(t.id)}
                    className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Activate
                  </button>
                )}
              </div>
            ))}
        </div>
      </div>
    </AdminLayout>
  );
}
