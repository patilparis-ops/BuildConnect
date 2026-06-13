import { Router } from "express";
import { prisma } from "../config/database.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.use(requireRole("ADMIN"));

router.get("/dashboard", async (_req, res) => {
  try {
    const [totalUsers, totalCustomers, totalContractors, totalProjects, activeProjects, completedProjects, pendingQuotations] = await Promise.all([
      prisma.user.count(), prisma.customer.count(), prisma.contractor.count(),
      prisma.project.count(), prisma.project.count({ where: { status: "IN_PROGRESS" } }),
      prisma.project.count({ where: { status: "COMPLETED" } }),
      prisma.quotation.count({ where: { status: "PENDING" } }),
    ]);
    res.json({
      users: { total: totalUsers, customers: totalCustomers, contractors: totalContractors, newThisMonth: 0 },
      projects: { total: totalProjects, active: activeProjects, completed: completedProjects, byCategory: {} },
      revenue: { total: 0, monthly: [], averageProjectValue: 0 },
      ratings: { average: 0, distribution: {} },
    });
  } catch (err: any) {
    console.error("Admin dashboard error:", err);
    res.status(500).json({ error: "Failed to get dashboard stats" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const { role, search } = req.query as Record<string, string | undefined>;
    const page = (req.query.page as string) || "1";
    const limit = (req.query.limit as string) || "20";
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    const where: any = {};
    if (role) where.role = (role as string).toUpperCase();
    if (search) {
      where.OR = [
        { firstName: { contains: search as string, mode: "insensitive" } },
        { lastName: { contains: search as string, mode: "insensitive" } },
        { email: { contains: search as string, mode: "insensitive" } },
      ];
    }
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where, select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true, avatar: true, isVerified: true, createdAt: true },
        orderBy: { createdAt: "desc" }, skip, take: limitNum,
      }),
      prisma.user.count({ where }),
    ]);
    res.json({
      users: users.map((u) => ({
        id: u.id, email: u.email, firstName: u.firstName, lastName: u.lastName,
        phone: u.phone, role: u.role.toLowerCase(), avatar: u.avatar,
        isVerified: u.isVerified, createdAt: u.createdAt.toISOString(),
      })),
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (err: any) {
    console.error("List users error:", err);
    res.status(500).json({ error: "Failed to list users" });
  }
});

router.put("/users/:id/verify", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) { res.status(404).json({ error: "User not found" }); return; }
    await prisma.user.update({ where: { id: user.id }, data: { isVerified: !user.isVerified } });
    if (user.role === "CONTRACTOR") {
      const contractor = await prisma.contractor.findUnique({ where: { userId: user.id } });
      if (contractor) await prisma.contractor.update({ where: { id: contractor.id }, data: { verified: !contractor.verified } });
    }
    res.json({ success: true, isVerified: !user.isVerified });
  } catch (err: any) {
    console.error("Verify user error:", err);
    res.status(500).json({ error: "Failed to verify user" });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) { res.status(404).json({ error: "User not found" }); return; }
    if (user.role === "ADMIN") { res.status(403).json({ error: "Cannot delete admin users" }); return; }
    await prisma.user.delete({ where: { id: user.id } });
    res.json({ success: true });
  } catch (err: any) {
    console.error("Delete user error:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

router.get("/projects", async (req, res) => {
  try {
    const status = req.query.status as string | undefined;
    const page = (req.query.page as string) || "1";
    const limit = (req.query.limit as string) || "20";
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    const where: any = {};
    if (status) where.status = (status as string).toUpperCase();
    const [projects, total] = await Promise.all([
      prisma.project.findMany({ where, include: { customer: { include: { user: { select: { firstName: true, lastName: true } } } } }, orderBy: { createdAt: "desc" }, skip, take: limitNum }),
      prisma.project.count({ where }),
    ]);
    res.json({
      projects: projects.map((p) => ({ id: p.id, customerId: p.customerId, title: p.title, category: p.category, status: p.status.toLowerCase(), budgetMin: p.budgetMin, budgetMax: p.budgetMax, location: p.location, quoteCount: p.quoteCount, createdAt: p.createdAt.toISOString() })),
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (err: any) {
    console.error("Admin list projects error:", err);
    res.status(500).json({ error: "Failed to list projects" });
  }
});

router.get("/contractors", async (req, res) => {
  try {
    const verified = req.query.verified as string | undefined;
    const page = (req.query.page as string) || "1";
    const limit = (req.query.limit as string) || "20";
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    const where: any = {};
    if (verified !== undefined) where.verified = verified === "true";
    const [contractors, total] = await Promise.all([
      prisma.contractor.findMany({
        where, include: { user: { select: { firstName: true, lastName: true, email: true, phone: true } }, certifications: true },
        orderBy: { rating: "desc" }, skip, take: limitNum,
      }),
      prisma.contractor.count({ where }),
    ]);
    res.json({
      contractors: contractors.map((c) => ({
        id: c.id, userId: c.userId, firstName: c.user.firstName, lastName: c.user.lastName,
        email: c.user.email, phone: c.user.phone, profession: c.profession, location: c.location,
        verified: c.verified, experience: c.experience,
        certifications: c.certifications.map((cert) => ({ id: cert.id, name: cert.name, issuer: cert.issuer, verified: cert.verified })),
      })),
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (err: any) {
    console.error("Admin list contractors error:", err);
    res.status(500).json({ error: "Failed to list contractors" });
  }
});

router.put("/contractors/:id/verify", async (req, res) => {
  try {
    const contractor = await prisma.contractor.findUnique({ where: { id: req.params.id } });
    if (!contractor) { res.status(404).json({ error: "Contractor not found" }); return; }
    await prisma.contractor.update({ where: { id: contractor.id }, data: { verified: !contractor.verified } });
    await prisma.user.update({ where: { id: contractor.userId }, data: { isVerified: !contractor.verified } });
    res.json({ success: true, verified: !contractor.verified });
  } catch (err: any) {
    console.error("Verify contractor error:", err);
    res.status(500).json({ error: "Failed to verify contractor" });
  }
});

export default router;
