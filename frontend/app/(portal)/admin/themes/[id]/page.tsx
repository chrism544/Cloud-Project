"use client";
import AdminLayout from "../../layout";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/stores/auth";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ThemeEditorPage() {
  const params = useParams();
  const id = (params?.id as string) || "";
  const portalId = useAuthStore((s) => s.portalId) || "";
  const [name, setName] = useState("");
  const [tokens, setTokens] = useState<string>("{}");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/v1/admin/themes`, {
        params: { portalId },
        headers: { "X-Portal-ID": portalId },
      });
      const t = (res.data as any[]).find((x) => x.id === id);
      if (t) {
        setName(t.name || "");
        setTokens(JSON.stringify(t.tokens || {}, null, 2));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && portalId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, portalId]);

  const save = async () => {
    setSaving(true);
    try {
      await api.put(
        `/api/v1/admin/themes/${id}`,
        { name, tokens: JSON.parse(tokens) },
        { headers: { "X-Portal-ID": portalId } }
      );
      alert("Saved");
    } catch (e: any) {
      alert("Failed: " + (e?.response?.data?.error?.message || e.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Theme</h1>
        {loading ? (
          <div className="mt-4 text-gray-500">Loading…</div>
        ) : (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tokens (JSON)</label>
              <textarea
                value={tokens}
                onChange={(e) => setTokens(e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2 font-mono"
                rows={20}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={save}
                disabled={saving}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save"}
              </button>
              <a href="/admin/themes" className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">Back</a>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
