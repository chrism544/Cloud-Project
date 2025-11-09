import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
});

// Token management via localStorage
function getTokens() {
  if (typeof window === "undefined") return { accessToken: null, refreshToken: null } as const;
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  return { accessToken, refreshToken } as const;
}

api.interceptors.request.use((config) => {
  const { accessToken } = getTokens();
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const { refreshToken } = getTokens();
      if (!refreshToken) throw error;
      const resp = await axios.post((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/api/v1/auth/refresh", { refreshToken });
      localStorage.setItem("accessToken", resp.data.accessToken);
      localStorage.setItem("refreshToken", resp.data.refreshToken);
      original.headers.Authorization = `Bearer ${resp.data.accessToken}`;
      return axios(original);
    }
    throw error;
  }
);

export default api;
