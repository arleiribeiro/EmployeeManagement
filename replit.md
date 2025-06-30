# Employee Management System

## Overview

This is a full-stack employee management system built with React, Express, and PostgreSQL. The application provides comprehensive CRUD operations for employee records with Microsoft authentication integration. It features a modern UI built with shadcn/ui components and Tailwind CSS, with real-time data management using TanStack Query.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: Single-page application with conditional rendering

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Authentication**: Session-based authentication (prepared for Microsoft MSAL integration)
- **API Design**: RESTful API with JSON responses
- **Session Storage**: In-memory session store (development) with express-session

## Key Components

### Database Layer
- **ORM**: Drizzle ORM with type-safe queries
- **Database**: PostgreSQL via Neon serverless
- **Schema**: Employee records (`funcionarios`) with comprehensive fields including personal info, job details, and contact information
- **Migrations**: Managed through Drizzle Kit

### Authentication System
- **Current**: Mock authentication system simulating Microsoft login
- **Planned**: Microsoft MSAL integration for enterprise authentication
- **Session Management**: Express sessions with memory store
- **Authorization**: Route-level protection with middleware

### API Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Current user info
- `GET /api/funcionarios` - List employees with pagination and filtering
- `POST /api/funcionarios` - Create new employee
- `PUT /api/funcionarios/:id` - Update employee
- `DELETE /api/funcionarios/:id` - Delete employee

### Frontend Features
- **Employee Management**: Full CRUD operations with form validation
- **Search & Filter**: Real-time search by name, role, and status
- **Pagination**: Server-side pagination for large datasets
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Data Validation**: Client-side validation with Brazilian-specific formats (CPF, CEP, phone)

## Data Flow

1. **Authentication Flow**:
   - User initiates Microsoft login (mock implementation)
   - Server validates credentials and creates session
   - Client receives user data and updates authentication state

2. **Employee Management Flow**:
   - Client requests employee data with filters/pagination
   - Server queries database through Drizzle ORM
   - Data is returned with metadata (total count, pagination info)
   - Client updates UI with TanStack Query cache management

3. **Form Submission Flow**:
   - Client validates form data using Zod schemas
   - Data is sent to server with appropriate HTTP method
   - Server validates and processes data through storage layer
   - Success/error responses trigger UI updates and notifications

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@hookform/resolvers**: Form validation integration
- **react-hook-form**: Form state management
- **zod**: Schema validation

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Build tool and dev server
- **typescript**: Static type checking
- **tsx**: TypeScript execution for development

## Deployment Strategy

### Development
- **Frontend**: Vite dev server with HMR
- **Backend**: tsx for TypeScript execution
- **Database**: Neon serverless PostgreSQL
- **Environment**: Local development with environment variables

### Production Build
- **Frontend**: Vite build to `dist/public`
- **Backend**: esbuild bundling to `dist/index.js`
- **Database**: Production PostgreSQL connection
- **Deployment**: Single Node.js server serving both API and static files

### Build Process
1. `npm run build` - Builds both frontend and backend
2. Frontend assets are served from `dist/public`
3. Backend serves API routes and static files
4. Database migrations handled via `drizzle-kit push`

## Changelog

- June 30, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.