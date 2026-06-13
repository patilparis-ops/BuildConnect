import { Router } from "express";
import { prisma } from "../config/database.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

// POST /api/reviews - Create a review (customer only)
router.post("/", requireAuth, requireRole("CUSTOMER"), async (req, res) => {
  try {
    const { projectId, contractorId, rating, title, comment, images } = req.body;

    if (!projectId || !contractorId || !rating || !title || !comment) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json({ error: "Rating must be between 1 and 5" });
      return;
    }

    const customer = await prisma.customer.findUnique({ where: { userId: req.session.userId! } });
    if (!customer) {
      res.status(400).json({ error: "Customer profile not found" });
      return;
    }

    // Check project is completed and awarded to this contractor
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project || project.customerId !== customer.id) {
      res.status(403).json({ error: "Not authorized to review this project" });
      return;
    }

    if (project.status !== "COMPLETED") {
      res.status(400).json({ error: "Can only review completed projects" });
      return;
    }

    // Check for existing review
    const existing = await prisma.review.findUnique({
      where: { projectId_customerId: { projectId, customerId: customer.id } },
    });
    if (existing) {
      res.status(409).json({ error: "You have already reviewed this project" });
      return;
    }

    const review = await prisma.review.create({
      data: {
        projectId,
        customerId: customer.id,
        contractorId,
        rating,
        title,
        comment,
        images: images || [],
      },
    });

    // Update contractor rating
    const reviews = await prisma.review.findMany({ where: { contractorId } });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await prisma.contractor.update({
      where: { id: contractorId },
      data: { rating: Math.round(avgRating * 10) / 10, reviewCount: reviews.length },
    });

    // Notify contractor
    await prisma.notification.create({
      data: {
        userId: (await prisma.contractor.findUnique({ where: { id: contractorId } }))!.userId,
        type: "REVIEW_RECEIVED",
        title: "New Review Received",
        message: `You received a ${rating}-star review for project: ${project.title}`,
        link: `/contractor/reviews`,
      },
    });

    res.status(201).json({
      id: review.id,
      projectId: review.projectId,
      contractorId: review.contractorId,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      images: review.images,
      createdAt: review.createdAt.toISOString(),
    });
  } catch (err) {
    console.error("Create review error:", err);
    res.status(500).json({ error: "Failed to create review" });
  }
});

// GET /api/reviews/contractor/:contractorId - Get reviews for a contractor (public)
router.get("/contractor/:contractorId", async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { contractorId: req.params.contractorId },
      include: {
        customer: { include: { user: { select: { firstName: true, lastName: true, avatar: true } } } },
        project: { select: { id: true, title: true, category: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      reviews: reviews.map((r) => ({
        id: r.id, projectId: r.projectId, customerId: r.customerId,
        contractorId: r.contractorId, rating: r.rating, title: r.title,
        comment: r.comment, images: r.images,
        customer: {
          firstName: r.customer.user.firstName,
          lastName: r.customer.user.lastName,
          avatar: r.customer.user.avatar,
        },
        project: r.project ? { id: r.project.id, title: r.project.title } : null,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error("Get contractor reviews error:", err);
    res.status(500).json({ error: "Failed to get reviews" });
  }
});

// GET /api/reviews/customer/my - Get current customer's reviews
router.get("/customer/my", requireAuth, requireRole("CUSTOMER"), async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({ where: { userId: req.session.userId! } });
    if (!customer) {
      res.status(400).json({ error: "Customer profile not found" });
      return;
    }

    const reviews = await prisma.review.findMany({
      where: { customerId: customer.id },
      include: {
        contractor: { include: { user: { select: { firstName: true, lastName: true, avatar: true } } } },
        project: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      reviews: reviews.map((r) => ({
        id: r.id, projectId: r.projectId, rating: r.rating, title: r.title,
        comment: r.comment, images: r.images,
        contractor: {
          firstName: r.contractor.user.firstName,
          lastName: r.contractor.user.lastName,
          avatar: r.contractor.user.avatar,
          profession: r.contractor.profession,
        },
        project: r.project ? { id: r.project.id, title: r.project.title } : null,
        createdAt: r.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error("Get my reviews error:", err);
    res.status(500).json({ error: "Failed to get reviews" });
  }
});

export default router;
