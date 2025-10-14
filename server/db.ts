// Reference: javascript_database integration blueprint
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure WebSocket with SSL options for development
const wsWithOptions = class extends ws {
  constructor(url: any, protocols?: any) {
    super(url, protocols, {
      rejectUnauthorized: false
    });
  }
};

neonConfig.webSocketConstructor = wsWithOptions as any;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });
