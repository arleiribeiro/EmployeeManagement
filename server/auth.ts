import express from "express";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  // For now, we'll implement a simple session-based auth
  // In production, this would integrate with Microsoft MSAL
  const user = req.session?.user;
  
  if (!user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  req.user = user;
  next();
}

export function loginUser(req: express.Request, user: AuthUser) {
  req.session!.user = user;
}

export function logoutUser(req: express.Request) {
  if (req.session) {
    req.session.destroy(() => {});
  }
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
