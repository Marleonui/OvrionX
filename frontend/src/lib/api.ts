import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/authStore";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor — attaches JWT token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = useAuthStore.getState().accessToken;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handles 401 and refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) {
          useAuthStore.getState().logout();
          return Promise.reject(error);
        }

        const { data } = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          { refreshToken }
        );

        useAuthStore.getState().setTokens(
          data.accessToken,
          data.refreshToken
        );

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        }
        return api(originalRequest);
      } catch {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// ── API endpoint helpers ──

export const authApi = {
  register: (data: { email: string; password: string; displayName: string }) =>
    api.post("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),

  refresh: (refreshToken: string) =>
    api.post("/auth/refresh", { refreshToken }),

  logout: (refreshToken: string) =>
    api.post("/auth/logout", { refreshToken }),

  getProfile: () => api.get("/auth/profile"),

  health: () => api.get("/health"),
};

// ── Projects ──
export const projectsApi = {
  list: () => api.get("/projects"),
  get: (id: string) => api.get(`/projects/${id}`),
  create: (data: { name: string; description?: string; status?: string; teamIds?: string[] }) =>
    api.post("/projects", data),
  update: (id: string, data: Partial<{ name: string; description?: string; status?: string; teamIds?: string[] }>) =>
    api.put(`/projects/${id}`, data),
  remove: (id: string) => api.delete(`/projects/${id}`),
  createTask: (
    projectId: string,
    data: { title: string; description?: string; priority?: string; status?: string; assigneeId?: string; dueDate?: string }
  ) => api.post(`/projects/${projectId}/tasks`, data),
  updateTask: (
    projectId: string,
    taskId: string,
    data: Partial<{ title: string; description?: string; priority?: string; status?: string; assigneeId?: string }>
  ) => api.put(`/projects/${projectId}/tasks/${taskId}`, data),
  removeTask: (projectId: string, taskId: string) =>
    api.delete(`/projects/${projectId}/tasks/${taskId}`),
};

// ── Data Vault (Documents) ──
export const vaultApi = {
  list: (projectId?: string) =>
    api.get("/vault", { params: projectId ? { projectId } : undefined }),
  get: (id: string) => api.get(`/vault/${id}`),
  create: (data: {
    filename: string;
    mimeType: string;
    sizeBytes: number;
    storageKey: string;
    category?: string;
    checksum?: string;
    projectId?: string;
    tags?: string[];
  }) => api.post("/vault", data),
  update: (id: string, data: Partial<{ category?: string; aiSummary?: string; tags?: string[] }>) =>
    api.put(`/vault/${id}`, data),
  remove: (id: string) => api.delete(`/vault/${id}`),
};

// ── AI Assistant ──
export const aiApi = {
  getMemory: () => api.get("/ai/memory"),
  addMemory: (data: { type: string; content: string; source?: string; tags?: string[] }) =>
    api.post("/ai/memory", data),
  clearMemory: () => api.delete("/ai/memory"),
  getStats: () => api.get("/ai/stats"),
};
