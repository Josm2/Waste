# Municipal Waste Management System

## Overview

This is a full-stack municipal waste management system built with a modern React frontend and Express.js backend. The system provides comprehensive tools for managing waste collection schedules, citizen reports, route optimization, educational content, and resident management for municipal environmental offices.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom municipal color scheme
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **File Uploads**: Multer for handling image uploads
- **API Design**: RESTful API with structured error handling

### Database Schema
The system uses PostgreSQL with the following main entities:
- **Users**: Authentication and role management (admin/resident)
- **Residents**: Citizen registration and management
- **Waste Reports**: Citizen-submitted waste management issues
- **Collection Schedules**: Waste collection planning and tracking
- **Routes**: Route optimization and truck management
- **Educational Content**: Educational materials and quizzes
- **Notifications**: System notifications and alerts

## Key Components

### Dashboard System
- Real-time statistics display
- Active truck tracking
- Completed collections monitoring
- Pending reports overview
- Registered residents count

### Waste Report Management
- Citizen report submission with image upload
- Location tracking with coordinates
- Status tracking (pending, in_progress, resolved)
- Report categorization (uncollected, illegal_dumping, broken_bin, other)

### Collection Scheduling
- Zone-based scheduling system
- Barangay-level organization
- Truck assignment and tracking
- Status monitoring (scheduled, in_progress, completed)

### Route Optimization
- Distance and time estimation
- Collection count tracking
- Truck ID assignment
- Visual route mapping interface

### Educational Portal
- Multi-format content support (articles, videos, quizzes)
- Interactive quiz system with scoring
- Content categorization and management

### Resident Management
- Resident registration and status tracking
- Location-based organization
- Notification system for residents
- Data export capabilities

## Data Flow

1. **User Authentication**: Users authenticate through the system with role-based access
2. **Dashboard Loading**: System fetches real-time statistics and displays overview
3. **Report Submission**: Citizens submit waste reports with optional image uploads
4. **Schedule Management**: Administrators create and manage collection schedules
5. **Route Planning**: System optimizes routes based on collection points and truck availability
6. **Educational Content**: Content is delivered based on user preferences and engagement
7. **Notifications**: System sends alerts and updates to relevant stakeholders

## External Dependencies

### Frontend Dependencies
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/react-***: Headless UI components for accessibility
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight React router
- **class-variance-authority**: Component variant management
- **date-fns**: Date manipulation and formatting

### Backend Dependencies
- **drizzle-orm**: TypeScript ORM for PostgreSQL
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **multer**: File upload handling
- **express**: Web application framework
- **tsx**: TypeScript execution for development

### Development Dependencies
- **vite**: Fast build tool and development server
- **typescript**: Type safety and development experience
- **esbuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Development Environment
- Uses Vite development server for hot module replacement
- TypeScript compilation with strict mode enabled
- PostgreSQL database with Drizzle migrations
- File uploads stored in local uploads directory

### Production Build
- Frontend built using Vite with optimizations
- Backend bundled using esbuild for Node.js
- Static files served from dist/public directory
- Environment variables for database configuration

### Replit Configuration
- Configured for Node.js 20 runtime
- PostgreSQL 16 module enabled
- Auto-scaling deployment target
- Port 5000 mapped to external port 80
- Parallel workflow for development and production

### Database Management
- Drizzle migrations stored in ./migrations directory
- Schema definitions in shared/schema.ts
- Push-based development workflow with `npm run db:push`
- Environment variable configuration for database URL

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 15, 2025. Initial setup