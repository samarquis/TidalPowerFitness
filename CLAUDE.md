# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tidal Power Fitness is a comprehensive fitness management platform built with a Next.js frontend and Express backend. The application supports user authentication, class scheduling, workout tracking, package/credit management, and exercise library features.

**Live Deployments:**
- Frontend: https://tidal-power-frontend.onrender.com
- Backend API: https://tidal-power-backend.onrender.com

## Development Commands

### Frontend (Next.js)
```bash
cd frontend
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm test         # Run Jest tests
```

### Backend (Express/TypeScript)
```bash
cd backend
npm run dev      # Start dev server with nodemon (localhost:5000)
npm run build    # Compile TypeScript to JavaScript
npm start        # Run compiled production code
npm test         # Run Jest tests
```

### Database Management
```bash
cd backend
npm run db:migrate     # Run all migrations
npm run db:seed        # Seed database with initial data
npm run db:reset       # Reset database (drop all tables and re-run migrations)
npm run migrate:001    # Run specific migration
npm run migrate:all    # Run all pending migrations
```

### E2E Testing
```bash
npm run test:e2e       # Run Cypress E2E tests (from root)
```

### Docker Deployment
```bash
docker-compose up -d          # Start all services in detached mode
docker-compose down           # Stop all services
docker-compose logs backend   # View backend logs
```

## Architecture

### Monorepo Structure
This is a monorepo with three main components:
- `/frontend` - Next.js 14 application with TypeScript and Tailwind CSS
- `/backend` - Express API server with TypeScript and PostgreSQL
- `/cypress` - E2E tests (minimal setup currently)

### Authentication & Authorization
- **JWT-based authentication** using HttpOnly cookies.
- **CORS Policy**: The backend has a dynamic CORS policy to handle requests from various origins, including localhost, the deployed frontend, and Vercel preview deployments.
- **Cookie Settings**: Cookies are configured to be secure in production (HTTPS) and lenient in local development (HTTP), allowing for seamless authentication in both environments.
- Backend middleware: `authenticate()` verifies the JWT from the cookie, and `authorize(...roles)` checks for role-based permissions.
- Multi-role support: Users can have multiple roles (`client`, `trainer`, `admin`).

**Key files:**
- `backend/src/middleware/auth.ts` - Authentication/authorization middleware.
- `backend/src/controllers/authController.ts` - Handles login, logout, and setting the HttpOnly cookie.
- `backend/src/utils/jwt.ts` - JWT signing and verification.
- `frontend/src/contexts/AuthContext.tsx` - Frontend auth state management.
- `frontend/src/lib/api.ts` - Centralized API client that automatically includes credentials (cookies).

### Database Architecture
- **PostgreSQL 14+** with connection pooling via `pg` library
- **Connection:** `backend/src/config/db.ts` exports `query()` function for database operations
- **Models:** Located in `backend/src/models/` - each model is a class with static methods
- **Migrations:** Manual SQL files in `backend/database/migrations/`
  - Web-based migration runner at `/admin/migrations` for Render free tier compatibility
  - Run via backend API: `POST /api/admin/migrate` or `npm run migrate:all`

**Core entities:**
- `User` - Multi-role user system (client/trainer/admin)
- `TrainerProfile`, `TrainerAvailability` - Trainer-specific data and scheduling
- `Class` - Scheduled fitness classes with multi-day support
- `Package`, `UserCredit` - Membership packages and credit system (replaces Acuity)
- `Exercise`, `BodyPart` - Exercise library with hierarchical categorization
- `WorkoutTemplate`, `WorkoutSession` - Workout tracking system
- `Cart` - Shopping cart for package purchases

### API Design Patterns
All backend routes follow REST conventions:
```
/api/auth          - Authentication (login, register, profile)
/api/users         - User management
/api/trainers      - Trainer profiles
/api/classes       - Class scheduling
/api/packages      - Membership packages
/api/cart          - Shopping cart
/api/exercises     - Exercise library
/api/workout-templates  - Workout templates
/api/workout-sessions   - Active/completed workouts
/api/availability  - Trainer availability
/api/admin/migrate - Database migrations (admin only)
```

**Route structure:**
- Routes defined in `backend/src/routes/*.ts`
- Controllers in `backend/src/controllers/*Controller.ts`
- Models in `backend/src/models/*.ts`

### Frontend Architecture
- **App Router** (Next.js 14) - all pages in `frontend/src/app/`
- **Context providers:** `AuthContext` for authentication, `CartContext` for shopping cart
- **Centralized API client:** `frontend/src/lib/api.ts` - use `apiClient` for all backend calls
- **Component structure:**
  - Pages: `src/app/*/page.tsx`
  - Reusable components: `src/components/`
  - UI components: `src/components/ui/`

**Important patterns:**
- Use `apiClient` from `@/lib/api` instead of direct `fetch()` calls
- Protect admin routes with role checks using `useAuth()` hook
- Path alias: `@/` maps to `src/` directory

### External Integrations
- **Square:** Payment processing (tokens in environment variables)
- **Acuity Scheduling:** Legacy integration being replaced by internal credit system
- Environment variables configured in `.env` files (see `.env.example`)

## Development Workflow

### Making Database Changes
1. Create a SQL migration file in `backend/database/migrations/`
2. Name it with a numeric prefix (e.g., `004_description.sql`)
3. Run locally: `npm run migrate:all` from backend directory
4. Deploy to production: Use `/admin/migrations` page to run migrations via web UI

### Adding New API Endpoints
1. Create/update route file in `backend/src/routes/`
2. Create controller in `backend/src/controllers/`
3. Add model methods in `backend/src/models/` if database interaction needed
4. Register route in `backend/src/app.ts`
5. Add corresponding method to `frontend/src/lib/api.ts`

### Testing Strategy
- Backend: Jest with ts-jest (`npm test` in backend directory)
- Frontend: Jest with React Testing Library (`npm test` in frontend directory)
- E2E: Cypress (minimal setup currently)

### Common Gotchas
- **TypeScript config:** Backend uses CommonJS (`type: "commonjs"` in package.json), frontend uses ES modules
- **CORS:** The backend has a dynamic CORS policy in `backend/src/app.ts` to handle multiple origins.
- **Cookies:** The backend sets HttpOnly cookies with settings that vary between production and development environments.
- **Password hashing:** Uses `bcrypt`.
- **Migration system:** Designed for Render free tier (no direct DB access), runs via web endpoint.
- **Multi-role system:** Database has both `role` (VARCHAR, legacy) and `roles` (TEXT[], new) columns during transition period.

### Admin Setup
After deploying to production:
1. Register a user account via the frontend
2. Connect to PostgreSQL database
3. Run: `UPDATE users SET roles = ARRAY['admin'] WHERE email = 'your-email@example.com';`
4. Logout and login to see admin features

## Project Conventions

### Code Style
- TypeScript for all new code (both frontend and backend)
- Async/await for asynchronous operations
- Controller methods should return via `res.json()` or `res.status().json()`
- Frontend components use functional components with hooks

### Error Handling
- Backend: Return appropriate HTTP status codes (400, 401, 403, 404, 500)
- Frontend: API client returns `{ data, error }` structure
- Use try-catch blocks in controllers and async functions

### Security Notes
- **CRITICAL:** Never commit `.env` files with real credentials
- JWT_SECRET must be set in production (no fallback allowed)
- Input validation needed on all controller endpoints (technical debt item)
- **XSS protection**: JWTs are stored in HttpOnly cookies, which helps to mitigate XSS attacks.

## Key Dependencies

**Backend:**
- express - Web framework
- pg - PostgreSQL client
- jsonwebtoken - JWT authentication
- bcrypt - Password hashing
- square - Payment processing
- ts-node, nodemon - Development tooling

**Frontend:**
- next - React framework (v14)
- react - UI library (v19)
- tailwindcss - Styling (v4)
- TypeScript - Type safety

## Planning & Protocol

This project uses a **Single Record of Truth** philosophy for planning and progress tracking.

### 1. The Project Status File
- **File**: `PROJECT_STATUS.md` in the root directory.
- **Purpose**: Contains the current roadmap, active session tasks, known bugs, and a historical log of sessions.
- **Rule**: ALWAYS update `PROJECT_STATUS.md` before starting work and after completing a session.
- **Avoid Artifacts**: Do not create separate `task.md`, `implementation_plan.md`, or `walkthrough.md` files in temporary brain directories unless specifically requested for a large-scale architectural review. Prefer consolidating all planning into `PROJECT_STATUS.md`.

### 2. Session Management
- **Start Session**: Review "Active Session" and "Master TODO" in `PROJECT_STATUS.md` (or use `/next`).
- **End Session**: Move completed "Active Session" items to "Session History" and update the "Master TODO" (or use `/eod`).

## Documentation Files
- `PROJECT_STATUS.md` - Single source of truth for Roadmap, TODOs, Bugs, and History
- `CLAUDE.md` - Current project architecture and development instructions
- `README.md` - Technical setup and overview
- `.agent/workflows/` - Automated workflows for session management

---

## Trainer Workflow (2025-12-06)

### Overview
Outlines the trainer workflow for the website: account setup, profile creation, class management, workout programming, client tracking, and in-class logging.

### Trainer Actions
1. **Account Setup**: Create account, log in.
2. **Trainer Profile**: Fill out bio, contact info, profile photo.
3. **Class Management**: Create class (name, description, days), publish sessions (dates, time, cost, capacity).
4. **Workout Programming**: Create/assign workouts (timed, sets/reps, mixed), add exercises, rest timer, weight tracking.
5. **Class Dashboard**: View signups, past workout records, preload previous data for recurring exercises.
6. **In-Class Logging**: Log workouts in real-time, start rest timers, sync data to client dashboard.
7. **Post-Class Features**: View attendees, access client workout history, track progress. Clients review logged workouts.

### Key Features Summary
- Account & profile setup
- Class creation/scheduling
- Workout programming
- Real-time workout logging
- Client progress tracking/history
- Dashboards for classes, clients, programs

---

## Client Workflow (2025-12-06)

### Overview
Outlines the client workflow: account creation, purchasing packages, signing up for classes, viewing dashboards.

### Client Actions
1. **Account Setup**: Create account, log in.
2. **Dashboard Features**: View credits/tokens, packages, calendar, class details.
3. **Personal Dashboard**: Badges, attendance, credits/purchases, progress tracking, attendance reports.
4. **Trainer Directory**: View trainers, bios, contact trainers.

### Workflow Steps
- Login
- Research/purchase packages
- Credits added
- Sign up for classes (calendar, select, sign up, use tokens)
- Post-purchase: updated calendar, remaining tokens, continue or exit

### Example Flow
- Buy package (5 credits), sign up for class, calendar updates, tokens reduced

### Special Cases
- Multiple attendees: sign up multiple people, tokens deducted per attendee

### Key Features Summary
- Account creation/login
- Dashboard: credits, packages, calendar, progress
- Class sign-up with tokens
- Attendance reports
- Trainer directory
- Multi-attendee support
