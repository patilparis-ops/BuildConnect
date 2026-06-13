import { Router } from "express";
import { prisma } from "../config/database.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.post("/", requireAuth, requireRole("CONTRACTOR"), async (req, res) => {
  try {
    const { projectId, estimatedPrice, timeline, proposal, materials } = req.body;
    if (!projectId || !estimatedPrice || !timeline || !proposal) {
      res.status(400).json({ error: "Missing required fields" }); return;
    }
    const contractor = await prisma.contractor.findUnique({ where: { userId: req.session.userId! } });
    if (!contractor) { res.status(400).json({ error: "Contractor profile not found" }); return; }
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) { res.status(404).json({ error: "Project not found" }); return; }
    const existing = await prisma.quotation.findUnique({ where: { projectId_contractorId: { projectId, contractorId: contractor.id } } });
    if (existing) { res.status(409).json({ error: "You have already submitted a quote for this project" }); return; }
    const quotation = await prisma.quotation.create({
      data: { projectId, contractorId: contractor.id, estimatedPrice, timeline, proposal, materials: materials || undefined },
    });
    await prisma.project.update({
      where: { id: projectId },
      data: { quoteCount: { increment: 1 }, ...(project.status === "OPEN" && { status: "QUOTING" }) },
    });
    await prisma.notification.create({
      data: {
        userId: (await prisma.customer.findUniqueOrThrow({ where: { id: project.customerId } })).userId,
        type: "QUOTE_RECEIVED", title: "New Quotation Received",
        message: `A contractor has submitted a quote for your project: ${project.title}`,
        link: `/customer/projects/${projectId}`,
      },
    });
    res.status(201).json({
      id: quotation.id, projectId: quotation.projectId, contractorId: quotation.contractorId,
      estimatedPrice: quotation.estimatedPrice, timeline: quotation.timeline, proposal: quotation.proposal,
      status: quotation.status.toLowerCase(), createdAt: quotation.createdAt.toISOString(),
    });
  } catch (err: any) {
    console.error("Create quotation error:", err);
    res.status(500).json({ error: "Failed to submit quotation" });
  }
});

router.get("/project/:projectId", requireAuth, async (req, res) => {
  try {
    const projectIdParam = req.params.projectId as string;
    const project = await prisma.project.findUnique({ where: { id: projectIdParam } });
    if (!project) { res.status(404).json({ error: "Project not found" }); return; }
    const customer = await prisma.customer.findUnique({ where: { userId: req.session.userId! } });
    if (!customer || project.customerId !== customer.id) { res.status(403).json({ error: "Not authorized" }); return; }
    const quotations = await prisma.quotation.findMany({
      where: { projectId: projectIdParam },
      include: { contractor: { include: { user: { select: { firstName: true, lastName: true, avatar: true } }, certifications: true } } },
      orderBy: { createdAt: "desc" },
    });
    const qs = quotations as any[];
    res.json({
      quotations: qs.map((q) => ({
        id: q.id, projectId: q.projectId, contractorId: q.contractorId,
        estimatedPrice: q.estimatedPrice, timeline: q.timeline, proposal: q.proposal,
        status: q.status.toLowerCase(), materials: q.materials,
        contractor: {
          id: q.contractor.id, firstName: q.contractor.user.firstName, lastName: q.contractor.user.lastName,
          avatar: q.contractor.user.avatar, profession: q.contractor.profession, rating: q.contractor.rating,
          reviewCount: q.contractor.reviewCount, completedProjects: q.contractor.completedProjects, verified: q.contractor.verified,
        },
        createdAt: q.createdAt.toISOString(), updatedAt: q.updatedAt.toISOString(),
      })),
    });
  } catch (err: any) {
    console.error("Get project quotations error:", err);
    res.status(500).json({ error: "Failed to get quotations" });
  }
});

router.get("/contractor/my", requireAuth, requireRole("CONTRACTOR"), async (req, res) => {
  try {
    const contractor = await prisma.contractor.findUnique({ where: { userId: req.session.userId! } });
    if (!contractor) { res.status(400).json({ error: "Contractor profile not found" }); return; }
    const quotations = await prisma.quotation.findMany({
      where: { contractorId: contractor.id },
      include: { project: { select: { id: true, title: true, status: true, location: true, budgetMin: true, budgetMax: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json({
      quotations: quotations.map((q) => ({
        id: q.id, projectId: q.projectId, estimatedPrice: q.estimatedPrice, timeline: q.timeline,
        proposal: q.proposal, status: q.status.toLowerCase(),
        project: q.project ? { id: q.project.id, title: q.project.title, status: q.project.status.toLowerCase() } : null,
        createdAt: q.createdAt.toISOString(),
      })),
    });
  } catch (err: any) {
    console.error("Get my quotations error:", err);
    res.status(500).json({ error: "Failed to get quotations" });
  }
});

router.put("/:id/accept", requireAuth, requireRole("CUSTOMER"), async (req, res) => {
  try {
    const quoteId = req.params.id as string;
    const quotation = await prisma.quotation.findUnique({ where: { id: quoteId } });
    if (!quotation) { res.status(404).json({ error: "Quotation not found" }); return; }
    const customer = await prisma.customer.findUnique({ where: { userId: req.session.userId! } });
    const project = await prisma.project.findUnique({ where: { id: quotation.projectId } });
    if (!customer || !project || project.customerId !== customer.id) { res.status(403).json({ error: "Not authorized" }); return; }
    await prisma.$transaction([
      prisma.quotation.update({ where: { id: quoteId }, data: { status: "ACCEPTED" } }),
      prisma.quotation.updateMany({ where: { projectId: quotation.projectId, id: { not: quoteId }, status: "PENDING" }, data: { status: "REJECTED" } }),
      prisma.project.update({ where: { id: quotation.projectId }, data: { status: "IN_PROGRESS", awardedTo: quotation.contractorId } }),
    ]);
    const contractorUser = await prisma.contractor.findUnique({ where: { id: quotation.contractorId } });
    if (contractorUser) {
      await prisma.notification.create({
        data: { userId: contractorUser.userId, type: "QUOTE_ACCEPTED", title: "Quotation Accepted!", message: `Your quote for project ${project.title} has been accepted!`, link: "/contractor/projects" },
      });
    }
    res.json({ success: true });
  } catch (err: any) {
    console.error("Accept quotation error:", err);
    res.status(500).json({ error: "Failed to accept quotation" });
  }
});

router.put("/:id/reject", requireAuth, requireRole("CUSTOMER"), async (req, res) => {
  try {
    const quoteId = req.params.id as string;
    const quotation = await prisma.quotation.findUnique({ where: { id: quoteId } });
    if (!quotation) { res.status(404).json({ error: "Quotation not found" }); return; }
    const customer = await prisma.customer.findUnique({ where: { userId: req.session.userId! } });
    const project = await prisma.project.findUnique({ where: { id: quotation.projectId } });
    if (!customer || !project || project.customerId !== customer.id) { res.status(403).json({ error: "Not authorized" }); return; }
    await prisma.quotation.update({ where: { id: quoteId }, data: { status: "REJECTED" } });
    const contractorUser = await prisma.contractor.findUnique({ where: { id: quotation.contractorId } });
    if (contractorUser) {
      await prisma.notification.create({
        data: { userId: contractorUser.userId, type: "QUOTE_REJECTED", title: "Quotation Declined", message: `Your quote for project ${project.title} has been declined.`, link: "/contractor/quotes" },
      });
    }
    res.json({ success: true });
  } catch (err: any) {
    console.error("Reject quotation error:", err);
    res.status(500).json({ error: "Failed to reject quotation" });
  }
});

export default router;
