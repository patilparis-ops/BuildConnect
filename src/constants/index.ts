import type { ProjectCategory } from "@/types";

// ==================== Project Categories ====================
export const PROJECT_CATEGORIES: {
  value: ProjectCategory;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    value: "renovation",
    label: "Renovation",
    description: "Home and office renovation services",
    icon: "Building2",
  },
  {
    value: "new_build",
    label: "New Build",
    description: "Construction of new structures",
    icon: "Construction",
  },
  {
    value: "repair",
    label: "Repairs",
    description: "General repair and maintenance",
    icon: "Wrench",
  },
  {
    value: "electrical",
    label: "Electrical",
    description: "Electrical installations and repairs",
    icon: "Zap",
  },
  {
    value: "plumbing",
    label: "Plumbing",
    description: "Plumbing services",
    icon: "Droplets",
  },
  {
    value: "painting",
    label: "Painting",
    description: "Interior and exterior painting",
    icon: "Paintbrush",
  },
  {
    value: "roofing",
    label: "Roofing",
    description: "Roof installation and repair",
    icon: "Home",
  },
  {
    value: "landscaping",
    label: "Landscaping",
    description: "Garden and outdoor design",
    icon: "Trees",
  },
  {
    value: "interior_design",
    label: "Interior Design",
    description: "Interior decoration and design",
    icon: "Palette",
  },
  {
    value: "other",
    label: "Other",
    description: "Other construction services",
    icon: "MoreHorizontal",
  },
];

// ==================== Contractor Professions ====================
export const PROFESSIONS = [
  "Architect",
  "Builder",
  "Electrician",
  "Plumber",
  "Painter",
  "Carpenter",
  "Roofer",
  "Landscaper",
  "Interior Designer",
  "Mason",
  "HVAC Specialist",
  "General Contractor",
] as const;

// ==================== Property Types ====================
export const PROPERTY_TYPES = [
  "Apartment",
  "House",
  "Villa",
  "Office",
  "Commercial Space",
  "Warehouse",
  "Other",
] as const;

// ==================== App Config ====================
export const APP_CONFIG = {
  NAME: "BuildConnect",
  TAGLINE: "Connect. Build. Trust.",
  DESCRIPTION:
    "India's trusted marketplace connecting homeowners with verified contractors and skilled professionals.",
  EMAIL: "hello@buildconnect.in",
  PHONE: "+91 1800-123-BUILD",
  ADDRESS: "123, Construction House, Andheri East, Mumbai - 400093",
  SOCIAL: {
    TWITTER: "https://twitter.com/buildconnect",
    LINKEDIN: "https://linkedin.com/company/buildconnect",
    INSTAGRAM: "https://instagram.com/buildconnect",
    YOUTUBE: "https://youtube.com/@buildconnect",
  },
  SUPPORT_HOURS: "Mon - Sat: 9:00 AM - 8:00 PM",
} as const;

// ==================== Pagination ====================
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const;

// ==================== Status Colors ====================
export const STATUS_COLORS: Record<string, string> = {
  open: "bg-success-100 text-success-700 border-success-200",
  quoting: "bg-warning-100 text-warning-700 border-warning-200",
  in_progress: "bg-brand-100 text-brand-700 border-brand-200",
  completed: "bg-success-100 text-success-700 border-success-200",
  cancelled: "bg-slate-100 text-slate-600 border-slate-200",
  pending: "bg-warning-100 text-warning-700 border-warning-200",
  accepted: "bg-success-100 text-success-700 border-success-200",
  rejected: "bg-danger-100 text-danger-700 border-danger-200",
  withdrawn: "bg-slate-100 text-slate-600 border-slate-200",
  available: "bg-success-100 text-success-700 border-success-200",
  busy: "bg-warning-100 text-warning-700 border-warning-200",
  unavailable: "bg-slate-100 text-slate-600 border-slate-200",
};
