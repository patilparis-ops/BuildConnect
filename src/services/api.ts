const API_BASE = import.meta.env.VITE_API_URL || "";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers as Record<string, string> },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// ==================== Auth API ====================

export const authApi = {
  registerCustomer: async (data: {
    email: string; password: string; firstName: string; lastName: string;
    phone?: string; address?: { street?: string; city?: string; state?: string; zipCode?: string; country?: string };
  }) => {
    return request<{ user: any }>("/api/auth/register/customer", {
      method: "POST",
      body: JSON.stringify({ ...data, role: "customer" }),
    });
  },

  registerContractor: async (data: {
    email: string; password: string; firstName: string; lastName: string;
    phone?: string; profession: string; specialties: string[];
    experience: number; location: string; serviceRadius?: number;
    hourlyRate?: number; bio?: string;
  }) => {
    return request<{ user: any }>("/api/auth/register/contractor", {
      method: "POST",
      body: JSON.stringify({ ...data, role: "contractor" }),
    });
  },

  login: async (data: { email: string; password: string }) => {
    return request<{ user: any }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  logout: async () => {
    return request<{ success: boolean }>("/api/auth/logout", { method: "POST" });
  },

  getMe: async () => {
    return request<{ user: any }>("/api/auth/me");
  },

  updateProfile: async (data: Record<string, any>) => {
    return request<{ success: boolean }>("/api/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    return request<{ success: boolean }>("/api/auth/change-password", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};

// ==================== Projects API ====================

export const projectsApi = {
  list: async (params?: { status?: string; category?: string; search?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set("status", params.status);
    if (params?.category) searchParams.set("category", params.category);
    if (params?.search) searchParams.set("search", params.search);
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    const qs = searchParams.toString();
    return request<{ projects: any[]; pagination: any }>(`/api/projects${qs ? `?${qs}` : ""}`);
  },

  getById: async (id: string) => {
    return request<any>(`/api/projects/${id}`);
  },

  create: async (data: any) => {
    return request<any>("/api/projects", { method: "POST", body: JSON.stringify(data) });
  },

  update: async (id: string, data: any) => {
    return request<any>(`/api/projects/${id}`, { method: "PUT", body: JSON.stringify(data) });
  },

  delete: async (id: string) => {
    return request<{ success: boolean }>(`/api/projects/${id}`, { method: "DELETE" });
  },

  getMyProjects: async () => {
    return request<{ projects: any[] }>("/api/projects/customer/my");
  },

  complete: async (id: string) => {
    return request<{ success: boolean; id: string; status: string }>(`/api/projects/${id}/complete`, { method: "PATCH" });
  },
};

// ==================== Contractors API ====================

export const contractorsApi = {
  list: async (params?: { profession?: string; location?: string; minRating?: number; search?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.profession) searchParams.set("profession", params.profession);
    if (params?.location) searchParams.set("location", params.location);
    if (params?.minRating) searchParams.set("minRating", String(params.minRating));
    if (params?.search) searchParams.set("search", params.search);
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    const qs = searchParams.toString();
    return request<{ contractors: any[]; pagination: any }>(`/api/contractors${qs ? `?${qs}` : ""}`);
  },

  getFeatured: async () => {
    return request<{ contractors: any[] }>("/api/contractors/featured");
  },

  getById: async (id: string) => {
    return request<any>(`/api/contractors/${id}`);
  },
};

// ==================== Quotations API ====================

export const quotationsApi = {
  create: async (data: { projectId: string; estimatedPrice: number; timeline: string; proposal: string; materials?: any[] }) => {
    return request<any>("/api/quotations", { method: "POST", body: JSON.stringify(data) });
  },

  getByProject: async (projectId: string) => {
    return request<{ quotations: any[] }>(`/api/quotations/project/${projectId}`);
  },

  getMyQuotes: async () => {
    return request<{ quotations: any[] }>("/api/quotations/contractor/my");
  },

  accept: async (id: string) => {
    return request<{ success: boolean }>(`/api/quotations/${id}/accept`, { method: "PUT" });
  },

  reject: async (id: string) => {
    return request<{ success: boolean }>(`/api/quotations/${id}/reject`, { method: "PUT" });
  },
};

// ==================== Reviews API ====================

export const reviewsApi = {
  create: async (data: { projectId: string; contractorId: string; rating: number; title: string; comment: string; images?: string[] }) => {
    return request<any>("/api/reviews", { method: "POST", body: JSON.stringify(data) });
  },

  getByContractor: async (contractorId: string) => {
    return request<{ reviews: any[] }>(`/api/reviews/contractor/${contractorId}`);
  },

  getMyReviews: async () => {
    return request<{ reviews: any[] }>("/api/reviews/customer/my");
  },
};

// ==================== Notifications API ====================

export const notificationsApi = {
  list: async () => {
    return request<{ notifications: any[]; unreadCount: number }>("/api/notifications");
  },

  markRead: async (id: string) => {
    return request<{ success: boolean }>(`/api/notifications/${id}/read`, { method: "PUT" });
  },

  markAllRead: async () => {
    return request<{ success: boolean }>("/api/notifications/read-all", { method: "PUT" });
  },

  clear: async () => {
    return request<{ success: boolean }>("/api/notifications", { method: "DELETE" });
  },
};

// ==================== Admin API ====================

export const adminApi = {
  getDashboard: async () => {
    return request<any>("/api/admin/dashboard");
  },

  getUsers: async (params?: { role?: string; search?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.role) searchParams.set("role", params.role);
    if (params?.search) searchParams.set("search", params.search);
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    const qs = searchParams.toString();
    return request<{ users: any[]; pagination: any }>(`/api/admin/users${qs ? `?${qs}` : ""}`);
  },

  verifyUser: async (id: string) => {
    return request<{ success: boolean; isVerified: boolean }>(`/api/admin/users/${id}/verify`, { method: "PUT" });
  },

  deleteUser: async (id: string) => {
    return request<{ success: boolean }>(`/api/admin/users/${id}`, { method: "DELETE" });
  },

  getProjects: async (params?: { status?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set("status", params.status);
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    const qs = searchParams.toString();
    return request<{ projects: any[]; pagination: any }>(`/api/admin/projects${qs ? `?${qs}` : ""}`);
  },

  getContractors: async (params?: { verified?: boolean; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.verified !== undefined) searchParams.set("verified", String(params.verified));
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    const qs = searchParams.toString();
    return request<{ contractors: any[]; pagination: any }>(`/api/admin/contractors${qs ? `?${qs}` : ""}`);
  },

  verifyContractor: async (id: string) => {
    return request<{ success: boolean; verified: boolean }>(`/api/admin/contractors/${id}/verify`, { method: "PUT" });
  },
};

// ==================== Platform API (marketing pages - keep mock data) ====================

import { platformStats, testimonials, faqData, teamMembers } from "@/mock/data";

export const platformApi = {
  getStats: async () => platformStats,
  getTestimonials: async () => testimonials,
  getFAQ: async () => faqData,
  getTeam: async () => teamMembers,
};

// ==================== Auth Extras (Forgot/Reset Password) ====================

export const authExtraApi = {
  forgotPassword: async (data: { email: string }) => {
    return request<{ success: boolean; message: string; resetToken?: string }>("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  resetPassword: async (data: { token: string; newPassword: string }) => {
    return request<{ success: boolean; message: string }>("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

// ==================== Portfolio API ====================

export const portfolioApi = {
  list: async () => {
    return request<{ projects: any[] }>("/api/contractors/portfolio/list");
  },

  create: async (data: { title: string; description: string; images?: string[]; category: string; completedAt: string; location?: string }) => {
    return request<any>("/api/contractors/portfolio", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<{ title: string; description: string; images: string[]; category: string; completedAt: string; location: string }>) => {
    return request<any>(`/api/contractors/portfolio/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return request<{ success: boolean }>(`/api/contractors/portfolio/${id}`, { method: "DELETE" });
  },
};

// ==================== Earnings API ====================

export const earningsApi = {
  get: async () => {
    return request<{ monthlyData: number[]; totalEarnings: number; transactions: any[] }>("/api/contractors/earnings");
  },
};

// ==================== Certifications API ====================

export const certificationsApi = {
  list: async () => {
    return request<{ certifications: any[] }>("/api/contractors/certifications/list");
  },

  create: async (data: { name: string; issuer: string; issueDate: string; expiryDate?: string; documentUrl?: string }) => {
    return request<any>("/api/contractors/certifications", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<{ name: string; issuer: string; issueDate: string; expiryDate: string; documentUrl: string }>) => {
    return request<any>(`/api/contractors/certifications/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return request<{ success: boolean }>(`/api/contractors/certifications/${id}`, { method: "DELETE" });
  },
};
