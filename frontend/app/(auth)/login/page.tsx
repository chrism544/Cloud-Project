"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/stores/auth";
import { ChevronDown, Mail, Lock } from "lucide-react";

type Portal = { id: string; name: string; subdomain: string };

export default function LoginPage() {
  const [portals, setPortals] = useState<Portal[]>([]);
  const [selectedPortal, setSelectedPortal] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setTokens = useAuthStore((s) => s.setTokens);
  const setPortal = useAuthStore((s) => s.setPortal);

  useEffect(() => {
    console.log("Fetching portals from:", window.location.hostname);
    api.get("/api/v1/portals").then((r) => {
      console.log("Portals response:", r.data);
      setPortals(r.data);
      if (r.data?.length) {
        setSelectedPortal(r.data[0].id);
      }
    }).catch((err) => {
      console.error("Failed to load portals:", err);
      console.error("Error details:", err.response?.data, err.message);
      setError("Failed to load portals. Please check your connection.");
    });
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const resp = await api.post("/api/v1/auth/login", { emailOrUsername: email, password });
      setTokens(resp.data.accessToken, resp.data.refreshToken);
      setPortal(selectedPortal);
      if (remember) {
        // already persisted to localStorage via store
      }
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-extrabold text-center text-gray-900">Portal Access</h1>
        <p className="text-center text-gray-500 mt-2">Select your destination portal and log in.</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Portal</label>
            <div className="relative">
              <select
                value={selectedPortal}
                onChange={(e) => setSelectedPortal(e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {portals.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.subdomain})</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email or Username</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., john.doe@example.com"
                className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center space-x-2">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="rounded" />
              <span className="text-gray-700">Remember me</span>
            </label>
            <a className="text-indigo-600 hover:text-indigo-500" href="#">Forgot password?</a>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
