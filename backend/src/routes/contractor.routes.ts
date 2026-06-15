import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/database.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { portfolioItemSchema, certificationSchema } from "../schemas/auth.js";

const router = Router();

// GET /api/contractors - List contractors (public)
router.get("/", async (req, res) => {
  try {
    const { profession, location, minRating, search } = req.query as Record<string, string | undefined>;
    const page = (req.query.page as string) || "1";
    const limit = (req.query.limit as string) || "10";
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (profession) where.profession = { contains: profession as string, mode: "insensitive" };
    if (location) where.location = { contains: location as string, mode: "insensitive" };
    if (minRating) where.rating = { gte: parseFloat(minRating) };
    if (search) {
      where.OR = [
        { user: { firstName: { contains: search as string, mode: "insensitive" } } },
        { user: { lastName: { contains: search as string, mode: "insensitive" } } },
        { profession: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const [contractors, total] = await Promise.all([
      prisma.contractor.findMany({
        where,
        include: { user: { select: { firstName: true, lastName: true, email: true, avatar: true, createdAt: true } } },
        orderBy: { rating: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.contractor.count({ where }),
    ]);

    res.json({
      contractors: contractors.map((c) => ({
        id: c.id, email: c.user.email, firstName: c.user.firstName, lastName: c.user.lastName,
        role: "contractor", profession: c.profession, specialties: c.specialties,
        experience: c.experience, rating: c.rating, reviewCount: c.reviewCount,
        completedProjects: c.completedProjects, verified: c.verified, avatar: c.user.avatar,
        portfolio: [], certifications: [], bio: c.bio ?? "",
        hourlyRate: c.hourlyRate, availability: c.availability, location: c.location,
        serviceRadius: c.serviceRadius, createdAt: c.user.createdAt.toISOString(),
        isVerified: c.verified,
      })),
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    console.error("List contractors error:", err);
    res.status(500).json({ error: "Failed to list contractors" });
  }
});

// IMPORTANT: Static routes must come BEFORE parameterized routes

// GET /api/contractors/featured - Get featured contractors (public)
router.get("/featured", async (_req, res) => {
  try {
    const contractors = await prisma.contractor.findMany({
      where: { rating: { gte: 4.5 } },
      include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
      orderBy: { rating: "desc" },
      take: 4,
    });

    res.json({
      contractors: contractors.map((c) => ({
        id: c.id, firstName: c.user.firstName, lastName: c.user.lastName,
        role: "contractor", profession: c.profession, rating: c.rating,
        reviewCount: c.reviewCount, completedProjects: c.completedProjects,
        verified: c.verified, avatar: c.user.avatar, location: c.location,
      })),
    });
  } catch (err) {
    console.error("Get featured contractors error:", err);
    res.status(500).json({ error: "Failed to get featured contractors" });
  }
});

// ==================== Earnings (must be BEFORE /:id route) ====================

// GET /api/contractors/earnings - Get contractor's earnings data
router.get("/earnings", requireAuth, requireRole("CONTRACTOR"), async (req, res) => {
  try {
    const contractor = await prisma.contractor.findUnique({ where: { userId: req.session.userId! } });
    if (!contractor) { res.status(400).json({ error: "Contractor profile not found" }); return; }

    const completedProjects = await prisma.project.findMany({
      where: { awardedTo: contractor.id, status: "COMPLETED" },
      orderBy: { endDate: "desc" },
    });

    const monthlyMap = new Map<string, number>();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for (let i = 0; i < 12; i++) {
      monthlyMap.set(months[i], 0);
    }

    for (const p of completedProjects) {
      if (p.endDate) {
        const d = new Date(p.endDate);
        const monthLabel = months[d.getMonth()];
        const value = (p.budgetMin + p.budgetMax) / 2;
        monthlyMap.set(monthLabel, (monthlyMap.get(monthLabel) || 0) + value);
      }
    }

    const monthlyData = months.map((m) => monthlyMap.get(m) || 0);
    const totalEarnings = monthlyData.reduce((a, b) => a + b, 0);

    const transactions = completedProjects.slice(0, 10).map((p) => ({
      id: `txn-${p.id}`,
      project: p.title,
      amount: (p.budgetMin + p.budgetMax) / 2,
      status: "completed",
      date: p.endDate || p.updatedAt.toISOString().split("T")[0],
      type: "credit" as const,
    }));

    const feeTransactions = transactions.map((t) => ({
      id: `fee-${t.id}`,
      project: `Platform Fee - ${t.project}`,
      amount: -Math.round(t.amount * 0.05),
      status: "completed" as const,
      date: t.date,
      type: "debit" as const,
    }));

    res.json({
      monthlyData,
      totalEarnings,
      transactions: [...transactions, ...feeTransactions].sort((a, b) => b.date.localeCompare(a.date)),
    });
  } catch (err) {
    console.error("Get earnings error:", err);
    res.status(500).json({ error: "Failed to get earnings" });
  }
});

// GET /api/contractors/:id - Get contractor by ID (MUST be AFTER static routes)
router.get("/:id", async (req, res) => {
  try {
    const contractor = await prisma.contractor.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { firstName: true, lastName: true, email: true, avatar: true, createdAt: true } },
        portfolioItems: true,
        certifications: true,
        reviews: {
          include: { customer: { include: { user: { select: { firstName: true, lastName: true, avatar: true } } } } },
          orderBy: { rating: "desc" },
          take: 10,
        },
      },
    });
    if (!contractor) {
      res.status(404).json({ error: "Contractor not found" });
      return;
    }

    res.json({
      id: contractor.id, email: contractor.user.email,
      firstName: contractor.user.firstName, lastName: contractor.user.lastName,
      role: "contractor", profession: contractor.profession,
      specialties: contractor.specialties, experience: contractor.experience,
      rating: contractor.rating, reviewCount: contractor.reviewCount,
      completedProjects: contractor.completedProjects, verified: contractor.verified,
      avatar: contractor.user.avatar,
      portfolio: contractor.portfolioItems.map((p) => ({
        id: p.id, title: p.title, description: p.description, images: p.images,
        category: p.category, completedAt: p.completedAt, location: p.location,
      })),
      certifications: contractor.certifications.map((c) => ({
        id: c.id, name: c.name, issuer: c.issuer,
        issueDate: c.issueDate,
        expiryDate: c.expiryDate,
        documentUrl: c.documentUrl, verified: c.verified,
      })),
      bio: contractor.bio ?? "",
      hourlyRate: contractor.hourlyRate,
      availability: contractor.availability,
      location: contractor.location,
      serviceRadius: contractor.serviceRadius,
      createdAt: contractor.user.createdAt.toISOString(),
      isVerified: contractor.verified,
    });
  } catch (err) {
    console.error("Get contractor error:", err);
    res.status(500).json({ error: "Failed to get contractor" });
  }
});

// ==================== Portfolio CRUD ====================

// POST /api/contractors/portfolio - Add portfolio item
router.post("/portfolio", requireAuth, requireRole("CONTRACTOR"), async (req, res) => {
  try {
    const data = portfolioItemSchema.parse(req.body);
    const contractor = await prisma.contractor.findUnique({ where: { userId: req.session.userId! } });
    if (!contractor) { res.status(400).json({ error: "Contractor profile not found" }); return; }
    const item = await prisma.portfolioItem.create({
      data: {
        contractorId: contractor.id,
        title: data.title,
        description: data.description,
        images: data.images ?? [],
        category: data.category,
        completedAt: data.completedAt,
        location: data.location,
      },
    });
    res.status(201).json({
      id: item.id, title: item.title, description: item.description,
      images: item.images, category: item.category,
      completedAt: item.completedAt, location: item.location,
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: "Validation failed", details: err.errors }); return; }
    console.error("Create portfolio item error:", err);
    res.status(500).json({ error: "Failed to create portfolio item" });
  }
});

// GET /api/contractors/portfolio - Get current contractor's portfolio
router.get("/portfolio/list", requireAuth, requireRole("CONTRACTOR"), async (req, res) => {
  try {
    const contractor = await prisma.contractor.findUnique({ where: { userId: req.session.userId! } });
    if (!contractor) { res.status(400).json({ error: "Contractor profile not found" }); return; }
    const projects = await prisma.portfolioItem.findMany({
      where: { contractorId: contractor.id },
      orderBy: { completedAt: "desc" },
    });
    res.json({
      projects: projects.map((p) => ({
        id: p.id, title: p.title, description: p.description,
        images: p.images, category: p.category,
        completedAt: p.completedAt, location: p.location,
      })),
    });
  } catch (err) {
    console.error("Get portfolio error:", err);
    res.status(500).json({ error: "Failed to get portfolio" });
  }
});

// PUT /api/contractors/portfolio/:id - Update portfolio item
router.put("/portfolio/:id", requireAuth, requireRole("CONTRACTOR"), async (req, res) => {
  try {
    const data = portfolioItemSchema.partial().parse(req.body);
    const contractor = await prisma.contractor.findUnique({ where: { userId: req.session.userId! } });
    if (!contractor) { res.status(400).json({ error: "Contractor profile not found" }); return; }
    const itemId = req.params.id as string;
    const item = await prisma.portfolioItem.findUnique({ where: { id: itemId } });
    if (!item || item.contractorId !== contractor.id) { res.status(403).json({ error: "Not authorized" }); return; }
    const updated = await prisma.portfolioItem.update({
      where: { id: itemId },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description && { description: data.description }),
        ...(data.images && { images: data.images }),
        ...(data.category && { category: data.category }),
        ...(data.completedAt && { completedAt: data.completedAt }),
        ...(data.location !== undefined && { location: data.location }),
      },
    });
    res.json({
      id: updated.id, title: updated.title, description: updated.description,
      images: updated.images, category: updated.category,
      completedAt: updated.completedAt, location: updated.location,
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: "Validation failed", details: err.errors }); return; }
    console.error("Update portfolio item error:", err);
    res.status(500).json({ error: "Failed to update portfolio item" });
  }
});

// DELETE /api/contractors/portfolio/:id - Delete portfolio item
router.delete("/portfolio/:id", requireAuth, requireRole("CONTRACTOR"), async (req, res) => {
  try {
    const contractor = await prisma.contractor.findUnique({ where: { userId: req.session.userId! } });
    if (!contractor) { res.status(400).json({ error: "Contractor profile not found" }); return; }
    const itemId = req.params.id as string;
    const item = await prisma.portfolioItem.findUnique({ where: { id: itemId } });
    if (!item || item.contractorId !== contractor.id) { res.status(403).json({ error: "Not authorized" }); return; }
    await prisma.portfolioItem.delete({ where: { id: itemId } });
    res.json({ success: true });
  } catch (err) {
    console.error("Delete portfolio item error:", err);
    res.status(500).json({ error: "Failed to delete portfolio item" });
  }
});

// ==================== Certifications CRUD ====================

// POST /api/contractors/certifications - Add certification
router.post("/certifications", requireAuth, requireRole("CONTRACTOR"), async (req, res) => {
  try {
    const data = certificationSchema.parse(req.body);
    const contractor = await prisma.contractor.findUnique({ where: { userId: req.session.userId! } });
    if (!contractor) { res.status(400).json({ error: "Contractor profile not found" }); return; }
    const item = await prisma.certification.create({
      data: {
        contractorId: contractor.id,
        name: data.name,
        issuer: data.issuer,
        issueDate: data.issueDate,
        expiryDate: data.expiryDate,
        documentUrl: data.documentUrl,
      },
    });
    res.status(201).json({
      id: item.id, name: item.name, issuer: item.issuer,
      issueDate: item.issueDate, expiryDate: item.expiryDate,
      documentUrl: item.documentUrl, verified: item.verified,
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: "Validation failed", details: err.errors }); return; }
    console.error("Create certification error:", err);
    res.status(500).json({ error: "Failed to create certification" });
  }
});

// GET /api/contractors/certifications/list - List current contractor's certifications
router.get("/certifications/list", requireAuth, requireRole("CONTRACTOR"), async (req, res) => {
  try {
    const contractor = await prisma.contractor.findUnique({ where: { userId: req.session.userId! } });
    if (!contractor) { res.status(400).json({ error: "Contractor profile not found" }); return; }
    const items = await prisma.certification.findMany({
      where: { contractorId: contractor.id },
      orderBy: { issueDate: "desc" },
    });
    res.json({
      certifications: items.map((c) => ({
        id: c.id, name: c.name, issuer: c.issuer,
        issueDate: c.issueDate, expiryDate: c.expiryDate,
        documentUrl: c.documentUrl, verified: c.verified,
      })),
    });
  } catch (err) {
    console.error("List certifications error:", err);
    res.status(500).json({ error: "Failed to list certifications" });
  }
});

// PUT /api/contractors/certifications/:id - Update certification
router.put("/certifications/:id", requireAuth, requireRole("CONTRACTOR"), async (req, res) => {
  try {
    const data = certificationSchema.partial().parse(req.body);
    const contractor = await prisma.contractor.findUnique({ where: { userId: req.session.userId! } });
    if (!contractor) { res.status(400).json({ error: "Contractor profile not found" }); return; }
    const certId = req.params.id as string;
    const item = await prisma.certification.findUnique({ where: { id: certId } });
    if (!item || item.contractorId !== contractor.id) { res.status(403).json({ error: "Not authorized" }); return; }
    const updated = await prisma.certification.update({
      where: { id: certId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.issuer && { issuer: data.issuer }),
        ...(data.issueDate && { issueDate: data.issueDate }),
        ...(data.expiryDate !== undefined && { expiryDate: data.expiryDate }),
        ...(data.documentUrl !== undefined && { documentUrl: data.documentUrl }),
      },
    });
    res.json({
      id: updated.id, name: updated.name, issuer: updated.issuer,
      issueDate: updated.issueDate, expiryDate: updated.expiryDate,
      documentUrl: updated.documentUrl, verified: updated.verified,
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: "Validation failed", details: err.errors }); return; }
    console.error("Update certification error:", err);
    res.status(500).json({ error: "Failed to update certification" });
  }
});

// DELETE /api/contractors/certifications/:id - Delete certification
router.delete("/certifications/:id", requireAuth, requireRole("CONTRACTOR"), async (req, res) => {
  try {
    const contractor = await prisma.contractor.findUnique({ where: { userId: req.session.userId! } });
    if (!contractor) { res.status(400).json({ error: "Contractor profile not found" }); return; }
    const certId = req.params.id as string;
    const item = await prisma.certification.findUnique({ where: { id: certId } });
    if (!item || item.contractorId !== contractor.id) { res.status(403).json({ error: "Not authorized" }); return; }
    await prisma.certification.delete({ where: { id: certId } });
    res.json({ success: true });
  } catch (err) {
    console.error("Delete certification error:", err);
    res.status(500).json({ error: "Failed to delete certification" });
  }
});

export default router;
