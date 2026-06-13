import type { Request, Response, NextFunction } from "express";

/** Require an authenticated user via session. */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  next();
}

/** Require one of the specified roles. Must be used after requireAuth. */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userRole || !roles.includes(req.session.userRole)) {
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }
    next();
  };
}
