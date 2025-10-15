import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { db } from "./db";
import { adminUsers, type AdminUser } from "@shared/schema";
import { eq } from "drizzle-orm";
import { logger } from "./logger";

if (!process.env.JWT_SECRET) {
  logger.warn("JWT_SECRET environment variable is not set. Using a temporary generated secret. For production, please set JWT_SECRET to a secure random string.");
  process.env.JWT_SECRET = crypto.randomBytes(64).toString('hex');
}

const JWT_SECRET: string = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "7d";

export interface AuthRequest extends Request {
  user?: AdminUser;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (error) {
    return null;
  }
}

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    if (!payload) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const [user] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.id, payload.userId));

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Authentication failed" });
  }
}

export async function createAdminUser(email: string, password: string, name: string) {
  const passwordHash = await hashPassword(password);
  
  const [user] = await db
    .insert(adminUsers)
    .values({ email, passwordHash, name } as any)
    .returning();
  
  return user;
}

export async function loginAdmin(email: string, password: string) {
  logger.info(`Login attempt for email: ${email}`);
  
  const [user] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email));

  if (!user) {
    logger.warn(`User not found: ${email}`);
    return null;
  }

  logger.info(`User found, checking password for: ${email}`);
  const isValid = await comparePassword(password, user.passwordHash);
  logger.info(`Password validation result: ${isValid}`);
  
  if (!isValid) {
    logger.warn(`Invalid password for user: ${email}`);
    return null;
  }

  // Update last login
  await db
    .update(adminUsers)
    .set({ lastLoginAt: new Date() })
    .where(eq(adminUsers.id, user.id));

  const token = generateToken(user.id);
  
  logger.info(`Login successful for user: ${email}`);
  
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
}
