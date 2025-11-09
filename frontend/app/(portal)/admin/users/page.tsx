"use client";
import AdminLayout from "../layout";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/stores/auth";
import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const portalId = useAuthStore((s) => s.portalId) || "";
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/admin/users", {
        params: { portalId, page: 1, pageSize: 50 },
        headers: { "X-Portal-ID": portalId },
      });
      setUsers(res.data.items || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portalId]);

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <div className="mt-6 bg-white rounded-lg shadow divide-y">
          {loading && <div className="p-4 text-gray-500">Loading…</div>}
          {!loading && users.length === 0 && <div className="p-4 text-gray-500">No users found</div>}
          {!loading &&
            users.map((u) => (
              <div key={u.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{u.email}</div>
                  <div className="text-sm text-gray-500">{u.role}</div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </AdminLayout>
  );
}
