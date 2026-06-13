// ==================== User Types ====================

export type UserRole = "customer" | "contractor" | "admin";

export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  isVerified: boolean;
}

export interface Customer extends User {
  role: "customer";
  address?: Address;
}

export interface Contractor extends User {
  role: "contractor";
  profession: string;
  specialties: string[];
  experience: number; // years
  rating: number;
  reviewCount: number;
  completedProjects: number;
  verified: boolean;
  portfolio: PortfolioItem[];
  certifications: Certification[];
  bio: string;
  hourlyRate?: number;
  availability: "available" | "busy" | "unavailable";
  location: string;
  serviceRadius: number; // in km
}

export interface Admin extends User {
  role: "admin";
  permissions: string[];
}

// ==================== Address Types ====================

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// ==================== Project Types ====================

export type ProjectStatus =
  | "open"
  | "quoting"
  | "in_progress"
  | "completed"
  | "cancelled";

export type ProjectCategory =
  | "renovation"
  | "new_build"
  | "repair"
  | "electrical"
  | "plumbing"
  | "painting"
  | "roofing"
  | "landscaping"
  | "interior_design"
  | "other";

export interface Project {
  id: string;
  customerId: string;
  title: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  budgetMin: number;
  budgetMax: number;
  location: string;
  address?: Address;
  propertyType?: string;
  propertySize?: number; // sq ft
  startDate?: string;
  endDate?: string;
  images: string[];
  attachments: Attachment[];
  requirements: string[];
  createdAt: string;
  updatedAt: string;
  quoteCount: number;
  awardedTo?: string; // contractor id
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

// ==================== Quotation Types ====================

export type QuotationStatus = "pending" | "accepted" | "rejected" | "withdrawn";

export interface Quotation {
  id: string;
  projectId: string;
  contractorId: string;
  estimatedPrice: number;
  timeline: string;
  proposal: string;
  status: QuotationStatus;
  materials?: { name: string; cost: number }[];
  createdAt: string;
  updatedAt: string;
}

// ==================== Review Types ====================

export interface Review {
  id: string;
  projectId: string;
  customerId: string;
  contractorId: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

// ==================== Portfolio Types ====================

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: ProjectCategory;
  completedAt: string;
  location?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  documentUrl?: string;
  verified: boolean;
}

// ==================== Notification Types ====================

export type NotificationType =
  | "quote_received"
  | "quote_accepted"
  | "quote_rejected"
  | "project_update"
  | "new_project"
  | "review_received"
  | "verification"
  | "payment"
  | "message";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

// ==================== Analytics Types ====================

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  pendingQuotations: number;
  completedProjects: number;
  totalRevenue?: number;
  averageRating?: number;
}

export interface RevenueData {
  month: string;
  amount: number;
  projects: number;
}

export interface AnalyticsData {
  users: {
    total: number;
    customers: number;
    contractors: number;
    newThisMonth: number;
  };
  projects: {
    total: number;
    active: number;
    completed: number;
    byCategory: Record<string, number>;
  };
  revenue: {
    total: number;
    monthly: RevenueData[];
    averageProjectValue: number;
  };
  ratings: {
    average: number;
    distribution: Record<number, number>;
  };
}

// ==================== UI Types ====================

export type SortDirection = "asc" | "desc";

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export interface TableSort {
  field: string;
  direction: SortDirection;
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}
