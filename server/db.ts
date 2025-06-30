import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { getConnectionString } from "./config/database";

neonConfig.webSocketConstructor = ws;

const connectionString = getConnectionString();

if (!connectionString) {
  throw new Error(
    "Database connection string must be set. Check your database configuration.",
  );
}

export const pool = new Pool({ connectionString });
export const db = drizzle({ client: pool, schema });