import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { db } from "./db";
import { clients, type Client } from "@shared/schema";
import { eq } from "drizzle-orm";
import { logger } from "./logger";

if (!process.env.JWT_SECRET) {
  logger.warn("JWT_SECRET environment variable is not set. Using a temporary generated secret. For production, please set JWT_SECRET to a secure random string.");
  process.env.JWT_SECRET = crypto.randomBytes(64).toString('hex');
}

const JWT_SECRET: string = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "30d"; // Clients get longer sessions

export interface ClientAuthRequest extends Request {
  client?: Client;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateClientToken(clientId: string): string {
  return jwt.sign({ clientId, type: 'client' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyClientToken(token: string): { clientId: string; type: string } | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { clientId: string; type: string };
    if (payload.type !== 'client') {
      return null;
    }
    return payload;
  } catch (error) {
    return null;
  }
}

export async function clientAuthMiddleware(
  req: ClientAuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.substring(7);
    const payload = verifyClientToken(token);

    if (!payload) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.id, payload.clientId));

    if (!client) {
      return res.status(401).json({ error: "Client not found" });
    }

    req.client = client;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Authentication failed" });
  }
}

export async function registerClient(email: string, password: string, name: string, company?: string, phone?: string) {
  // Check if client already exists
  const [existing] = await db
    .select()
    .from(clients)
    .where(eq(clients.email, email));

  if (existing) {
    throw new Error("Client with this email already exists");
  }

  const passwordHash = await hashPassword(password);
  
  const [client] = await db
    .insert(clients)
    .values({ email, passwordHash, name, company, phone } as any)
    .returning();
  
  const token = generateClientToken(client.id);
  
  return {
    token,
    client: {
      id: client.id,
      email: client.email,
      name: client.name,
      company: client.company,
      phone: client.phone,
    },
  };
}

export async function loginClient(email: string, password: string) {
  const [client] = await db
    .select()
    .from(clients)
    .where(eq(clients.email, email));

  if (!client) {
    return null;
  }

  const isValid = await comparePassword(password, client.passwordHash);
  
  if (!isValid) {
    return null;
  }

  // Update last login
  await db
    .update(clients)
    .set({ lastLoginAt: new Date() })
    .where(eq(clients.id, client.id));

  const token = generateClientToken(client.id);
  
  return {
    token,
    client: {
      id: client.id,
      email: client.email,
      name: client.name,
      company: client.company,
      phone: client.phone,
    },
  };
}
