import { Router } from "express";
import { prisma } from "../config/database.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { status, category, search } = req.query as Record<string, string | undefined>;
    const page = (req.query.page as string) || "1";
    const limit = (req.query.limit as string) || "10";
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    const where: Record<string, unknown> = {};
    if (status) where.status = (status as string).toUpperCase();
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
        { location: { contains: search as string, mode: "insensitive" } },
      ];
    }
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where, include: { customer: { include: { user: { select: { firstName: true, lastName: true } } } } },
        orderBy: { createdAt: "desc" }, skip, take: limitNum,
      }),
      prisma.project.count({ where }),
    ]);
    const ps = projects as any[];
    res.json({
      projects: ps.map((p) => ({
        id: p.id, customerId: p.customerId, title: p.title, description: p.description,
        category: p.category, status: p.status.toLowerCase(),
        budgetMin: p.budgetMin, budgetMax: p.budgetMax, location: p.location,
        propertyType: p.propertyType, propertySize: p.propertySize,
        images: p.images, requirements: p.requirements, quoteCount: p.quoteCount,
        awardedTo: p.awardedTo, createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString(),
      })),
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    console.error("List projects error:", err);
    res.status(500).json({ error: "Failed to list projects" });
  }
});

// Static routes BEFORE parameterized routes
router.get("/customer/my", requireAuth, requireRole("CUSTOMER"), async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({ where: { userId: req.session.userId! } });
    if (!customer) { res.status(400).json({ error: "Customer profile not found" }); return; }
    const projects = await prisma.project.findMany({ where: { customerId: customer.id }, orderBy: { createdAt: "desc" } });
    res.json({
      projects: projects.map((p) => ({
        id: p.id, title: p.title, description: p.description, category: p.category,
        status: p.status.toLowerCase(), budgetMin: p.budgetMin, budgetMax: p.budgetMax,
        location: p.location, quoteCount: p.quoteCount,
        createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error("Get my projects error:", err);
    res.status(500).json({ error: "Failed to get projects" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const projectId = req.params.id as string;
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        customer: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
        quotations: { include: { contractor: { include: { user: { select: { firstName: true, lastName: true } } } } } },
      },
    });
    if (!project) { res.status(404).json({ error: "Project not found" }); return; }
    res.json({
      id: project.id, customerId: project.customerId, title: project.title,
      description: project.description, category: project.category,
      status: project.status.toLowerCase(), budgetMin: project.budgetMin, budgetMax: project.budgetMax,
      location: project.location, propertyType: project.propertyType, propertySize: project.propertySize,
      startDate: project.startDate, endDate: project.endDate,
      images: project.images, requirements: project.requirements,
      quoteCount: project.quoteCount, awardedTo: project.awardedTo,
      createdAt: project.createdAt.toISOString(), updatedAt: project.updatedAt.toISOString(),
    });
  } catch (err) {
    console.error("Get project error:", err);
    res.status(500).json({ error: "Failed to get project" });
  }
});

router.post("/", requireAuth, requireRole("CUSTOMER"), async (req, res) => {
  try {
    const { title, description, category, budgetMin, budgetMax, location,
      propertyType, propertySize, images, requirements, startDate } = req.body;
    const customer = await prisma.customer.findUnique({ where: { userId: req.session.userId! } });
    if (!customer) { res.status(400).json({ error: "Customer profile not found" }); return; }
    const project = await prisma.project.create({
      data: {
        customerId: customer.id, title, description,
        category: category || "other", budgetMin: budgetMin || 0, budgetMax: budgetMax || 0,
        location, propertyType, propertySize, startDate, images: images || [], requirements: requirements || [],
      },
    });
    res.status(201).json({ id: project.id, title: project.title, status: project.status.toLowerCase(), createdAt: project.createdAt.toISOString() });
  } catch (err) {
    console.error("Create project error:", err);
    res.status(500).json({ error: "Failed to create project" });
  }
});

router.put("/:id", requireAuth, requireRole("CUSTOMER"), async (req, res) => {
  try {
    const projectId = req.params.id as string;
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) { res.status(404).json({ error: "Project not found" }); return; }
    const customer = await prisma.customer.findUnique({ where: { userId: req.session.userId! } });
    if (!customer || project.customerId !== customer.id) { res.status(403).json({ error: "Not authorized" }); return; }
    const { title, description, category, budgetMin, budgetMax, location,
      propertyType, propertySize, images, requirements, startDate } = req.body;
    const updated = await prisma.project.update({
      where: { id: projectId }, data: {
        ...(title && { title }), ...(description && { description }), ...(category && { category }),
        ...(budgetMin !== undefined && { budgetMin }), ...(budgetMax !== undefined && { budgetMax }),
        ...(location && { location }), ...(propertyType !== undefined && { propertyType }),
        ...(propertySize !== undefined && { propertySize }), ...(images && { images }), ...(requirements && { requirements }),
        ...(startDate !== undefined && { startDate }),
      },
    });
    res.json({ id: updated.id, title: updated.title, status: updated.status.toLowerCase(), updatedAt: updated.updatedAt.toISOString() });
  } catch (err) {
    console.error("Update project error:", err);
    res.status(500).json({ error: "Failed to update project" });
  }
});

// PATCH /:id/complete - Mark project as completed (customer only, must be in_progress)
router.patch("/:id/complete", requireAuth, requireRole("CUSTOMER"), async (req, res) => {
  try {
    const projectId = req.params.id as string;
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) { res.status(404).json({ error: "Project not found" }); return; }

    const customer = await prisma.customer.findUnique({ where: { userId: req.session.userId! } });
    if (!customer || project.customerId !== customer.id) {
      res.status(403).json({ error: "Not authorized to complete this project" }); return;
    }

    if (project.status !== "IN_PROGRESS") {
      res.status(400).json({ error: "Only projects in progress can be marked as completed" }); return;
    }

    const now = new Date().toISOString();
    const updated = await prisma.project.update({
      where: { id: projectId },
      data: { status: "COMPLETED", endDate: now },
    });

    res.json({
      success: true,
      id: updated.id,
      status: updated.status.toLowerCase(),
      endDate: now,
    });
  } catch (err) {
    console.error("Complete project error:", err);
    res.status(500).json({ error: "Failed to complete project" });
  }
});

router.delete("/:id", requireAuth, requireRole("CUSTOMER"), async (req, res) => {
  try {
    const projectId = req.params.id as string;
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) { res.status(404).json({ error: "Project not found" }); return; }
    const customer = await prisma.customer.findUnique({ where: { userId: req.session.userId! } });
    if (!customer || project.customerId !== customer.id) { res.status(403).json({ error: "Not authorized" }); return; }
    await prisma.project.update({ where: { id: projectId }, data: { status: "CANCELLED" } });
    res.json({ success: true });
  } catch (err) {
    console.error("Delete project error:", err);
    res.status(500).json({ error: "Failed to cancel project" });
  }
});

export default router;
