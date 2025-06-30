import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  connectionString: string;
}

// Default configuration for development (Replit's built-in database)
const defaultConfig: DatabaseConfig = {
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432'),
  database: process.env.PGDATABASE || 'main',
  username: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '',
  connectionString: process.env.DATABASE_URL || ''
};

// Production configuration for your VPS PostgreSQL
const productionConfig: DatabaseConfig = {
  host: process.env.PROD_DB_HOST || 'your-vps-ip',
  port: parseInt(process.env.PROD_DB_PORT || '5432'),
  database: process.env.PROD_DB_NAME || 'funcionarios_db',
  username: process.env.PROD_DB_USER || 'postgres',
  password: process.env.PROD_DB_PASSWORD || 'your-password',
  connectionString: process.env.PROD_DATABASE_URL || ''
};

export function getDatabaseConfig(): DatabaseConfig {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    return productionConfig;
  }
  
  return defaultConfig;
}

export function getConnectionString(): string {
  const config = getDatabaseConfig();
  
  if (config.connectionString) {
    return config.connectionString;
  }
  
  return `postgresql://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`;
}