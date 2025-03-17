import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;

// Define a custom interface to extend Request
export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as { id: string; role: string };
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isBanned) {
      return res.status(403).json({ message: "User is banned" });
    }

    req.user = { id: user._id.toString(), role: user.role }; // Attach user info
    next();
  } catch (err) {
    return res.status(403).json({ message: "Forbidden" });
  }
};

export const adminMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};
