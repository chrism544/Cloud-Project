import axios from "axios";

const api = axios.create();

// Token management via localStorage
function getTokens() {
  if (typeof window === "undefined") return { accessToken: null, refreshToken: null } as const;
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  return { accessToken, refreshToken } as const;
}

// Dynamically determine API URL based on hostname
function getApiUrl(): string {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname === "admin.home-networks.org") {
      return "https://api.home-networks.org";
    }
    // Default for localhost and any other hostnames
    return "http://localhost:3001";
  }
  // Server-side rendering fallback
  return "http://localhost:3001";
}

api.interceptors.request.use((config) => {
  // Set baseURL dynamically for each request
  const apiUrl = getApiUrl();
  config.baseURL = apiUrl;

  // Debug logging
  if (typeof window !== "undefined") {
    console.log(`[API] Request to ${config.url}, baseURL: ${apiUrl}, hostname: ${window.location.hostname}`);
  }

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
      const resp = await axios.post(getApiUrl() + "/api/v1/auth/refresh", { refreshToken });
      localStorage.setItem("accessToken", resp.data.accessToken);
      localStorage.setItem("refreshToken", resp.data.refreshToken);
      original.headers.Authorization = `Bearer ${resp.data.accessToken}`;
      return axios(original);
    }
    throw error;
  }
);

export default api;
