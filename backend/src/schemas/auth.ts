import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  phone: z.string().optional(),
  role: z.enum(["customer", "contractor"]),
});

export const registerCustomerSchema = registerSchema.extend({
  role: z.literal("customer"),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
});

export const registerContractorSchema = registerSchema.extend({
  role: z.literal("contractor"),
  profession: z.string().min(1, "Profession is required"),
  specialties: z.array(z.string()).min(1, "At least one specialty is required"),
  experience: z.number().min(0).max(50),
  location: z.string().min(1, "Location is required"),
  serviceRadius: z.number().min(1).max(200).default(25),
  hourlyRate: z.number().min(0).optional(),
  bio: z.string().max(1000).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  profession: z.string().optional(),
  specialties: z.array(z.string()).optional(),
  experience: z.number().min(0).max(50).optional(),
  bio: z.string().max(1000).optional(),
  hourlyRate: z.number().min(0).optional(),
  availability: z.enum(["available", "busy", "unavailable"]).optional(),
  location: z.string().optional(),
  serviceRadius: z.number().min(1).max(200).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});
