import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../config/database.js";
import { requireAuth } from "../middleware/auth.js";
import {
  registerCustomerSchema, registerContractorSchema,
  loginSchema, updateProfileSchema, changePasswordSchema,
} from "../schemas/auth.js";

const router = Router();

router.post("/register/customer", async (req, res) => {
  try {
    const data = registerCustomerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) { res.status(409).json({ error: "Email already registered" }); return; }
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: {
        email: data.email, password: hashedPassword, firstName: data.firstName,
        lastName: data.lastName, phone: data.phone, role: "CUSTOMER",
        customer: { create: { street: data.address?.street, city: data.address?.city, state: data.address?.state, zipCode: data.address?.zipCode, country: data.address?.country } },
      },
      include: { customer: true },
    });
    req.session.userId = user.id;
    req.session.userRole = user.role;
    res.status(201).json({
      user: {
        id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName,
        phone: user.phone, role: "customer", avatar: user.avatar, createdAt: user.createdAt.toISOString(), isVerified: false,
        address: user.customer ? { street: user.customer.street, city: user.customer.city, state: user.customer.state, zipCode: user.customer.zipCode, country: user.customer.country } : undefined,
      },
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: "Validation failed", details: err.errors }); return; }
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/register/contractor", async (req, res) => {
  try {
    const data = registerContractorSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) { res.status(409).json({ error: "Email already registered" }); return; }
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: {
        email: data.email, password: hashedPassword, firstName: data.firstName,
        lastName: data.lastName, phone: data.phone, role: "CONTRACTOR",
        contractor: {
          create: {
            profession: data.profession, specialties: data.specialties, experience: data.experience,
            location: data.location, serviceRadius: data.serviceRadius ?? 25,
            hourlyRate: data.hourlyRate, bio: data.bio,
          },
        },
      },
      include: { contractor: true },
    });
    req.session.userId = user.id;
    req.session.userRole = user.role;
    res.status(201).json({
      user: {
        id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName,
        phone: user.phone, role: "contractor", avatar: user.avatar, createdAt: user.createdAt.toISOString(), isVerified: false,
        profession: user.contractor?.profession, specialties: user.contractor?.specialties ?? [],
        experience: user.contractor?.experience ?? 0, rating: 0, reviewCount: 0, completedProjects: 0,
        verified: false, portfolio: [], certifications: [], bio: user.contractor?.bio ?? "",
        hourlyRate: user.contractor?.hourlyRate, availability: "available" as const,
        location: user.contractor?.location ?? "", serviceRadius: user.contractor?.serviceRadius ?? 25,
      },
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: "Validation failed", details: err.errors }); return; }
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) { res.status(401).json({ error: "Invalid email or password" }); return; }
    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) { res.status(401).json({ error: "Invalid email or password" }); return; }
    req.session.userId = user.id;
    req.session.userRole = user.role;
    let roleData: Record<string, unknown> = {};
    if (user.role === "CUSTOMER") {
      const customer = await prisma.customer.findUnique({ where: { userId: user.id } });
      roleData = { role: "customer", address: customer ? { street: customer.street, city: customer.city, state: customer.state, zipCode: customer.zipCode, country: customer.country } : undefined };
    } else if (user.role === "CONTRACTOR") {
      const contractor = await prisma.contractor.findUnique({ where: { userId: user.id } });
      const portfolio = await prisma.portfolioItem.findMany({ where: { contractorId: contractor?.id } });
      const certifications = await prisma.certification.findMany({ where: { contractorId: contractor?.id } });
      roleData = {
        role: "contractor", profession: contractor?.profession, specialties: contractor?.specialties ?? [],
        experience: contractor?.experience ?? 0, rating: contractor?.rating ?? 0, reviewCount: contractor?.reviewCount ?? 0,
        completedProjects: contractor?.completedProjects ?? 0, verified: contractor?.verified ?? false,
        portfolio: portfolio.map((p) => ({ id: p.id, title: p.title, description: p.description, images: p.images, category: p.category, completedAt: p.completedAt, location: p.location })),
        certifications: certifications.map((c) => ({ id: c.id, name: c.name, issuer: c.issuer, issueDate: c.issueDate, expiryDate: c.expiryDate, documentUrl: c.documentUrl, verified: c.verified })),
        bio: contractor?.bio ?? "", hourlyRate: contractor?.hourlyRate,
        availability: contractor?.availability ?? "available", location: contractor?.location ?? "", serviceRadius: contractor?.serviceRadius ?? 25,
      };
    } else if (user.role === "ADMIN") {
      const admin = await prisma.admin.findUnique({ where: { userId: user.id } });
      roleData = { role: "admin", permissions: admin?.permissions ?? [] };
    }
    res.json({
      user: {
        id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName,
        phone: user.phone, avatar: user.avatar, createdAt: user.createdAt.toISOString(),
        isVerified: user.isVerified, ...roleData,
      },
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: "Validation failed", details: err.errors }); return; }
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) { res.status(500).json({ error: "Logout failed" }); return; }
    res.clearCookie("bc.sid");
    res.json({ success: true });
  });
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.session.userId! }, include: { customer: true, contractor: true, admin: true },
    });
    if (!user) { res.status(404).json({ error: "User not found" }); return; }
    let roleData: Record<string, unknown> = {};
    if (user.customer) {
      roleData = { role: "customer", address: { street: user.customer.street, city: user.customer.city, state: user.customer.state, zipCode: user.customer.zipCode, country: user.customer.country } };
    } else if (user.contractor) {
      const portfolio = await prisma.portfolioItem.findMany({ where: { contractorId: user.contractor.id } });
      const certifications = await prisma.certification.findMany({ where: { contractorId: user.contractor.id } });
      roleData = {
        role: "contractor", profession: user.contractor.profession, specialties: user.contractor.specialties,
        experience: user.contractor.experience, rating: user.contractor.rating, reviewCount: user.contractor.reviewCount,
        completedProjects: user.contractor.completedProjects, verified: user.contractor.verified,
        portfolio: portfolio.map((p) => ({ id: p.id, title: p.title, description: p.description, images: p.images, category: p.category, completedAt: p.completedAt, location: p.location })),
        certifications: certifications.map((c) => ({ id: c.id, name: c.name, issuer: c.issuer, issueDate: c.issueDate, expiryDate: c.expiryDate, documentUrl: c.documentUrl, verified: c.verified })),
        bio: user.contractor.bio ?? "", hourlyRate: user.contractor.hourlyRate,
        availability: user.contractor.availability, location: user.contractor.location, serviceRadius: user.contractor.serviceRadius,
      };
    } else if (user.admin) {
      roleData = { role: "admin", permissions: user.admin.permissions };
    }
    res.json({
      user: {
        id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName,
        phone: user.phone, avatar: user.avatar, createdAt: user.createdAt.toISOString(),
        isVerified: user.isVerified, ...roleData,
      },
    });
  } catch (err) {
    console.error("Get me error:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.put("/profile", requireAuth, async (req, res) => {
  try {
    const data = updateProfileSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { id: req.session.userId! } });
    if (!user) { res.status(404).json({ error: "User not found" }); return; }
    const { address, ...userFields } = data;
    await prisma.user.update({ where: { id: user.id }, data: userFields });
    if (user.role === "CUSTOMER" && address) {
      await prisma.customer.upsert({ where: { userId: user.id }, create: { userId: user.id, ...address }, update: address });
    }
    if (user.role === "CONTRACTOR") {
      const contractorData: Record<string, unknown> = {};
      if (data.profession) contractorData.profession = data.profession;
      if (data.specialties) contractorData.specialties = data.specialties;
      if (data.experience !== undefined) contractorData.experience = data.experience;
      if (data.bio !== undefined) contractorData.bio = data.bio;
      if (data.hourlyRate !== undefined) contractorData.hourlyRate = data.hourlyRate;
      if (data.availability) contractorData.availability = data.availability;
      if (data.location) contractorData.location = data.location;
      if (data.serviceRadius !== undefined) contractorData.serviceRadius = data.serviceRadius;
      if (Object.keys(contractorData).length > 0) {
        await prisma.contractor.update({ where: { userId: user.id }, data: contractorData });
      }
    }
    res.json({ success: true });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: "Validation failed", details: err.errors }); return; }
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

router.put("/change-password", requireAuth, async (req, res) => {
  try {
    const data = changePasswordSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { id: req.session.userId! } });
    if (!user) { res.status(404).json({ error: "User not found" }); return; }
    const valid = await bcrypt.compare(data.currentPassword, user.password);
    if (!valid) { res.status(401).json({ error: "Current password is incorrect" }); return; }
    const hashedPassword = await bcrypt.hash(data.newPassword, 12);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashedPassword } });
    res.json({ success: true });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: "Validation failed", details: err.errors }); return; }
    console.error("Change password error:", err);
    res.status(500).json({ error: "Failed to change password" });
  }
});

export default router;
