# Database Configuration Guide

This document explains how to configure the employee management system to connect to your VPS PostgreSQL database.

## Current Setup

The system is currently configured to use Replit's built-in PostgreSQL database for development. All database connection settings are centralized in `server/config/database.ts`.

## VPS Database Configuration

To connect to your VPS PostgreSQL instance, follow these steps:

### 1. Environment Variables

Create a `.env` file in the project root with your VPS database credentials:

```bash
# Production Database Configuration
NODE_ENV=production
PROD_DATABASE_URL=postgresql://postgres:your_password@your-vps-ip:5432/funcionarios_db
PROD_DB_HOST=your-vps-ip
PROD_DB_PORT=5432
PROD_DB_NAME=funcionarios_db
PROD_DB_USER=postgres
PROD_DB_PASSWORD=your_password

# Session Secret (change this!)
SESSION_SECRET=your-secure-session-secret-key
```

### 2. Database Schema

Your existing `funcionarios` table structure is already defined in the system. The table schema matches exactly what you provided:

```sql
CREATE TABLE IF NOT EXISTS public.funcionarios (
    id integer NOT NULL DEFAULT nextval('funcionarios_id_seq'::regclass),
    empresa_id integer,
    nome character varying(255) NOT NULL,
    cpf character varying(14) NOT NULL UNIQUE,
    rg character varying(20),
    data_nascimento date,
    funcao character varying(100),
    data_admissao date,
    ctps_numero character varying(20),
    ctps_serie character varying(20),
    pis character varying(20),
    telefone character varying(20),
    whatsapp character varying(50),
    email character varying(100),
    endereco text,
    cidade character varying(100),
    estado character varying(2),
    cep character varying(10),
    ativo boolean DEFAULT true,
    supervisor boolean DEFAULT true,
    CONSTRAINT funcionarios_pkey PRIMARY KEY (id),
    CONSTRAINT funcionarios_cpf_key UNIQUE (cpf)
);
```

### 3. Switching to Production

To use your VPS database:

1. Set `NODE_ENV=production` in your environment
2. Configure the `PROD_*` environment variables with your VPS details
3. Ensure your VPS PostgreSQL server accepts connections from your deployment location
4. Run `npm run db:push` to sync the schema (if needed)

### 4. Database Connection Configuration

The system automatically selects the appropriate database configuration based on the `NODE_ENV` environment variable:

- **Development**: Uses Replit's built-in PostgreSQL
- **Production**: Uses your VPS PostgreSQL instance

### 5. Security Considerations

- **Firewall**: Ensure your VPS PostgreSQL port (5432) is properly secured
- **SSL**: Consider enabling SSL connections for production
- **Credentials**: Keep database credentials secure and use environment variables
- **Backup**: Implement regular backups for your production database

### 6. Testing Connection

You can test the database connection by checking the server logs when starting the application. Any connection issues will be logged during startup.

## Microsoft Authentication

The current implementation uses a mock Microsoft authentication system. For production use with real Microsoft authentication:

1. Register your application with Microsoft Azure AD
2. Obtain client ID and client secret
3. Configure the proper redirect URLs
4. Update the authentication logic in `server/auth.ts` and `client/src/lib/auth.ts`

## Development vs Production

- **Development**: Uses mock authentication and local/Replit database
- **Production**: Ready for real Microsoft authentication and your VPS database

The configuration system is designed to seamlessly switch between environments using environment variables.