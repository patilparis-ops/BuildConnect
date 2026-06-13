import { Router } from "express";
import { prisma } from "../config/database.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// GET /api/notifications - Get current user's notifications
router.get("/", requireAuth, async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.session.userId! },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: req.session.userId!, read: false },
    });

    const notifs = notifications as any[];
    res.json({
      notifications: notifs.map((n) => ({
        id: n.id, userId: n.userId, type: n.type.toLowerCase(),
        title: n.title, message: n.message, read: n.read, link: n.link,
        createdAt: n.createdAt.toISOString(),
      })),
      unreadCount,
    });
  } catch (err: any) {
    console.error("Get notifications error:", err);
    res.status(500).json({ error: "Failed to get notifications" });
  }
});

// PUT /api/notifications/:id/read - Mark a notification as read
router.put("/:id/read", requireAuth, async (req, res) => {
  try {
    const id = req.params.id as string;
    await prisma.notification.updateMany({
      where: { id, userId: req.session.userId! },
      data: { read: true },
    });
    res.json({ success: true });
  } catch (err: any) {
    console.error("Mark notification read error:", err);
    res.status(500).json({ error: "Failed to update notification" });
  }
});

// PUT /api/notifications/read-all - Mark all notifications as read
router.put("/read-all", requireAuth, async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.session.userId!, read: false },
      data: { read: true },
    });
    res.json({ success: true });
  } catch (err: any) {
    console.error("Mark all read error:", err);
    res.status(500).json({ error: "Failed to update notifications" });
  }
});

// DELETE /api/notifications - Clear all notifications
router.delete("/", requireAuth, async (req, res) => {
  try {
    await prisma.notification.deleteMany({ where: { userId: req.session.userId! } });
    res.json({ success: true });
  } catch (err: any) {
    console.error("Clear notifications error:", err);
    res.status(500).json({ error: "Failed to clear notifications" });
  }
});

export default router;
