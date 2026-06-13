import { Router } from "express";
import { prisma } from "../config/database.js";

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

export default router;
