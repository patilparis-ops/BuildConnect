import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi, contractorsApi, quotationsApi, reviewsApi, notificationsApi, adminApi, authApi } from "@/services/api";
import { useAuthStore } from "@/store/auth-store";
import { useNotificationStore } from "@/store/notification-store";
import { toast } from "@/components/ui/toast";
import type { Project, Contractor, Quotation, Review, User, DashboardStats } from "@/types";
import { mockProjects, mockContractors, mockQuotations, mockReviews, mockDashboardStats } from "@/mock/data";

function safeQuery(key: unknown[], fn: () => Promise<any>, fallback: any) {
  const [hasError, setHasError] = useState(false);
  const result = useQuery({
    queryKey: key,
    queryFn: async () => {
      try {
        const data = await fn();
        setHasError(false);
        return data;
      } catch (e) {
        console.error("API error for", key[0], e);
        setHasError(true);
        return fallback;
      }
    },
    retry: 1,
    staleTime: 30_000,
  });
  return { ...result, isError: hasError };
}

function useSafeMutation(opts: {
  mutationFn: (vars: any) => Promise<any>;
  invalidateKeys?: string[][];
  successMsg?: string;
  errorMsg?: string;
}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: opts.mutationFn,
    onSuccess: () => {
      opts.invalidateKeys?.forEach(key => qc.invalidateQueries({ queryKey: key }));
      if (opts.successMsg) toast({ title: opts.successMsg, variant: "success" });
    },
    onError: () => { if (opts.errorMsg) toast({ title: opts.errorMsg, variant: "error" }); },
  });
}

export function useLogin() {
  const login = useAuthStore(s => s.login);
  return useMutation({
    mutationFn: (data: { email: string; password: string }) => authApi.login(data),
    onSuccess: (data: any) => { login(data.user as User); toast({ title: "Welcome back!", variant: "success" }); },
    onError: () => toast({ title: "Login failed", message: "Invalid credentials", variant: "error" }),
  });
}

export function useRegisterCustomer() {
  const login = useAuthStore(s => s.login);
  return useMutation({
    mutationFn: (data: any) => authApi.registerCustomer(data),
    onSuccess: (data: any) => { login(data.user as User); toast({ title: "Account created!", variant: "success" }); },
    onError: () => toast({ title: "Registration failed", message: "Could not create account. Try again.", variant: "error" }),
  });
}

export function useRegisterContractor() {
  const login = useAuthStore(s => s.login);
  return useMutation({
    mutationFn: (data: any) => authApi.registerContractor(data),
    onSuccess: (data: any) => { login(data.user as User); toast({ title: "Profile created!", variant: "success" }); },
    onError: () => toast({ title: "Registration failed", message: "Could not create profile. Try again.", variant: "error" }),
  });
}

export function useProjects(params?: { status?: string; category?: string; search?: string; page?: number; limit?: number }) {
  return safeQuery(["projects", params], () => projectsApi.list(params), { projects: mockProjects, pagination: { page: 1, pageSize: 10, total: mockProjects.length } });
}

export function useProject(id: string) {
  return safeQuery(["project", id], () => projectsApi.getById(id), mockProjects.find(p => p.id === id) || mockProjects[0]);
}

export function useMyProjects() {
  return safeQuery(["my-projects"], () => projectsApi.getMyProjects(), { projects: mockProjects });
}

export function useCreateProject() {
  return useSafeMutation({ mutationFn: projectsApi.create, invalidateKeys: [["projects"], ["my-projects"]], successMsg: "Project created!" });
}

export function useUpdateProject() {
  return useSafeMutation({ mutationFn: (vars: any) => projectsApi.update(vars.id, vars.data), invalidateKeys: [["projects"], ["my-projects"]], successMsg: "Project updated" });
}

export function useDeleteProject() {
  return useSafeMutation({ mutationFn: projectsApi.delete, invalidateKeys: [["projects"], ["my-projects"]], successMsg: "Project deleted" });
}

export function useCompleteProject() {
  return useSafeMutation({ mutationFn: projectsApi.complete, invalidateKeys: [["projects"], ["my-projects"]], successMsg: "Project completed! Leave a review to help others." });
}

export function useContractors(params?: { profession?: string; location?: string; minRating?: number; search?: string; page?: number; limit?: number }) {
  return safeQuery(["contractors", params], () => contractorsApi.list(params), { contractors: mockContractors, pagination: { page: 1, pageSize: 10, total: mockContractors.length } });
}

export function useFeaturedContractors() {
  return safeQuery(["featured-contractors"], () => contractorsApi.getFeatured(), { contractors: mockContractors.slice(0, 4) });
}

export function useContractor(id: string) {
  return safeQuery(["contractor", id], () => contractorsApi.getById(id), mockContractors.find(c => c.id === id) || mockContractors[0]);
}

export function useProjectQuotations(projectId: string) {
  return safeQuery(["quotations", projectId], () => quotationsApi.getByProject(projectId), { quotations: mockQuotations.filter(q => q.projectId === projectId) });
}

export function useMyQuotes() {
  return safeQuery(["my-quotes"], () => quotationsApi.getMyQuotes(), { quotations: mockQuotations });
}

export function useSubmitQuote() {
  return useSafeMutation({ mutationFn: quotationsApi.create, invalidateKeys: [["quotations"], ["my-quotes"]], successMsg: "Quote submitted!" });
}

export function useAcceptQuote() {
  return useSafeMutation({ mutationFn: quotationsApi.accept, invalidateKeys: [["quotations"], ["projects"]], successMsg: "Quote accepted!" });
}

export function useRejectQuote() {
  return useSafeMutation({ mutationFn: quotationsApi.reject, invalidateKeys: [["quotations"]], successMsg: "Quote rejected" });
}

export function useContractorReviews(contractorId: string) {
  return safeQuery(["reviews", contractorId], () => reviewsApi.getByContractor(contractorId), { reviews: mockReviews.filter(r => r.contractorId === contractorId) });
}

export function useMyReviews() {
  return safeQuery(["my-reviews"], () => reviewsApi.getMyReviews(), { reviews: mockReviews });
}

export function useCreateReview() {
  return useSafeMutation({ mutationFn: reviewsApi.create, invalidateKeys: [["reviews"]], successMsg: "Review submitted!" });
}

export function useNotifications() {
  const setNotifs = useNotificationStore(s => s.setNotifications);
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const d = await notificationsApi.list();
        setNotifs(d.notifications as any);
        return d;
      } catch {
        const mock: any = [
          { id: "n1", userId: "", type: "quote_received", title: "New Quote", message: "Amit Verma submitted a quote", read: false, createdAt: new Date().toISOString() },
          { id: "n2", userId: "", type: "project_update", title: "Project Update", message: "Project marked as In Progress", read: false, createdAt: new Date(Date.now() - 86400000).toISOString() } as any,
          { id: "n3", userId: "", type: "review_received", title: "New Review", message: "You received a 5-star review", read: false, createdAt: new Date(Date.now() - 172800000).toISOString() } as any,
        ];
        setNotifs(mock);
        return { notifications: mock, unreadCount: 3 };
      }
    },
    staleTime: 15_000,
  });
}

export function useMarkRead() {
  const markRead = useNotificationStore(s => s.markAsRead);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.markRead,
    onSuccess: (_data: any, id: string) => { markRead(id); qc.invalidateQueries({ queryKey: ["notifications"] }); },
  });
}

export function useMarkAllRead() {
  const markAll = useNotificationStore(s => s.markAllAsRead);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.markAllRead,
    onSuccess: () => { markAll(); qc.invalidateQueries({ queryKey: ["notifications"] }); },
  });
}

export function useAdminDashboard() {
  return safeQuery(["admin-dashboard"], () => adminApi.getDashboard(), {
    users: { total: 4892, customers: 2442, contractors: 2450, newThisMonth: 520 },
    projects: { total: 1234, active: 456, completed: 778, byCategory: {} },
    revenue: { total: 6420000, monthly: [], averageProjectValue: 85000 },
    ratings: { average: 4.7, distribution: { 5: 245, 4: 85, 3: 30, 2: 12, 1: 8 } },
  });
}

const mockUsers = [
  { id: "1", name: "Priya Mehta", email: "priya@example.com", role: "customer", status: "active", verified: true, joined: "2026-01-15", firstName: "Priya", lastName: "Mehta", isVerified: true, createdAt: "2026-01-15T00:00:00Z" },
  { id: "2", name: "Amit Verma", email: "amit.verma@example.com", role: "contractor", status: "active", verified: true, joined: "2026-02-20", firstName: "Amit", lastName: "Verma", isVerified: true, createdAt: "2026-02-20T00:00:00Z" },
  { id: "3", name: "Rajesh Kumar", email: "rajesh@example.com", role: "contractor", status: "active", verified: false, joined: "2026-03-10", firstName: "Rajesh", lastName: "Kumar", isVerified: false, createdAt: "2026-03-10T00:00:00Z" },
  { id: "4", name: "Sneha Patel", email: "sneha@example.com", role: "contractor", status: "pending", verified: false, joined: "2026-06-12", firstName: "Sneha", lastName: "Patel", isVerified: false, createdAt: "2026-06-12T00:00:00Z" },
  { id: "5", name: "Vikram Singh", email: "vikram@example.com", role: "contractor", status: "active", verified: true, joined: "2026-01-05", firstName: "Vikram", lastName: "Singh", isVerified: true, createdAt: "2026-01-05T00:00:00Z" },
  { id: "6", name: "Ananya Gupta", email: "ananya@example.com", role: "customer", status: "active", verified: true, joined: "2026-05-12", firstName: "Ananya", lastName: "Gupta", isVerified: true, createdAt: "2026-05-12T00:00:00Z" },
  { id: "7", name: "Admin User", email: "admin@buildconnect.in", role: "admin", status: "active", verified: true, joined: "2025-12-01", firstName: "Admin", lastName: "User", isVerified: true, createdAt: "2025-12-01T00:00:00Z" },
];

export function useAdminUsers(params?: { role?: string; search?: string; page?: number; limit?: number }) {
  return safeQuery(["admin-users", params], () => adminApi.getUsers(params), { users: mockUsers, pagination: { page: 1, pageSize: 10, total: mockUsers.length } });
}

export function useAdminProjects(params?: { status?: string; page?: number; limit?: number }) {
  return safeQuery(["admin-projects", params], () => adminApi.getProjects(params), { projects: mockProjects, pagination: { page: 1, pageSize: 10, total: mockProjects.length } });
}

export function useAdminContractors(params?: { verified?: boolean; page?: number; limit?: number }) {
  const filtered = params?.verified === false ? mockContractors.filter(c => !c.verified) : params?.verified === true ? mockContractors.filter(c => c.verified) : mockContractors;
  return safeQuery(["admin-contractors", params], () => adminApi.getContractors(params), { contractors: filtered, pagination: { page: 1, pageSize: 10, total: filtered.length } });
}

export function useVerifyUser() {
  return useSafeMutation({ mutationFn: adminApi.verifyUser, invalidateKeys: [["admin-users"]], successMsg: "User verified" });
}

export function useVerifyContractor() {
  return useSafeMutation({ mutationFn: adminApi.verifyContractor, invalidateKeys: [["admin-contractors"]], successMsg: "Contractor verified" });
}

export function useDeleteUser() {
  return useSafeMutation({ mutationFn: adminApi.deleteUser, invalidateKeys: [["admin-users"]], successMsg: "User deleted" });
}

export function useDashboardStats() {
  return safeQuery(["dashboard-stats"], () => adminApi.getDashboard(), mockDashboardStats);
}

const mockTransactions = [
  { id: "t1", project: "Home Renovation", customer: "Priya Mehta", contractor: "Amit Verma", amount: 650000, status: "completed", date: "2026-06-10", fee: 32500 },
  { id: "t2", project: "Office Interior", customer: "TechCorp", contractor: "Priya Sharma", amount: 1200000, status: "completed", date: "2026-06-08", fee: 60000 },
  { id: "t3", project: "Bathroom Plumbing", customer: "Rajesh Iyer", contractor: "Vikram Singh", amount: 85000, status: "completed", date: "2026-06-05", fee: 4250 },
  { id: "t4", project: "Electrical Repair", customer: "Ananya Gupta", contractor: "Rajesh Kumar", amount: 12000, status: "completed", date: "2026-06-03", fee: 600 },
  { id: "t5", project: "Garden Landscaping", customer: "Suresh Reddy", contractor: "Ananya Gupta", amount: 150000, status: "pending", date: "2026-06-12", fee: 7500 },
  { id: "t6", project: "New House Construction", customer: "Vikram Joshi", contractor: "Amit Verma", amount: 2800000, status: "escrow", date: "2026-06-01", fee: 140000 },
];

export function useAdminPayments() {
  return safeQuery(["admin-payments"], () => adminApi.getDashboard(), { transactions: mockTransactions });
}

const mockPortfolio = [
  { id: "1", title: "Modern Villa Renovation", description: "Complete renovation of a 4-bedroom villa with modern finishes.", category: "Renovation", images: 8, completedAt: "2025-12", location: "Mumbai", rating: 5 },
  { id: "2", title: "Office Interior Design", description: "Contemporary office design for a tech startup.", category: "Interior Design", images: 12, completedAt: "2025-09", location: "Pune", rating: 5 },
];

export function usePortfolio() {
  return safeQuery(["portfolio"], async () => ({ projects: mockPortfolio }), { projects: mockPortfolio });
}

const mockEarningsData = [25000, 42000, 38000, 55000, 48000, 62000, 71000, 58000, 45000];
const mockEarningTransactions = [
  { id: "t1", project: "Home Renovation", amount: 65000, status: "completed", date: "2026-06-10", type: "credit" },
  { id: "t2", project: "Office Interior", amount: 120000, status: "completed", date: "2026-05-28", type: "credit" },
  { id: "t3", project: "Platform Fee", amount: -6500, status: "completed", date: "2026-06-10", type: "debit" },
];

export function useEarnings() {
  return safeQuery(["earnings"], async () => ({
    monthlyData: mockEarningsData,
    transactions: mockEarningTransactions,
    totalEarnings: mockEarningsData.reduce((a, b) => a + b, 0),
  }), {
    monthlyData: mockEarningsData,
    transactions: mockEarningTransactions,
    totalEarnings: mockEarningsData.reduce((a, b) => a + b, 0),
  });
}
