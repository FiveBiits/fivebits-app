# Contributing to FiveBits

This guide covers everything you need to know to contribute to the FiveBits project effectively. Please read it before making any changes.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Git Workflow](#git-workflow)
- [Branch Naming Convention](#branch-naming-convention)
- [Commit Message Convention](#commit-message-convention)
- [Pull Request Process](#pull-request-process)
- [Project Architecture](#project-architecture)
- [Backend Guidelines](#backend-guidelines)
- [Frontend Guidelines](#frontend-guidelines)
- [Adding a New Feature Checklist](#adding-a-new-feature-checklist)
- [Docker Commands Reference](#docker-commands-reference)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Make sure you have the following installed:

- [Git](https://git-scm.com/downloads)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)
- A code editor (VS Code recommended)

**For local development without Docker (optional):**
- Java 21 (JDK)
- Node.js 18+
- PostgreSQL 16

---

## Initial Setup

```bash
# 1. Clone the repository
git clone <repository-url>
cd FiveBits

# 2. Create your environment file
cp .env.example .env
# Edit .env with your preferred credentials (see next section)

# 3. Build and start all services
docker compose up --build
```

Once running:
| Service | URL |
|---|---|
| Frontend | http://localhost:80 |
| Backend API | http://localhost:8080 |
| PostgreSQL | localhost:5432 |

---

## Environment Configuration

Create a `.env` file in the project root based on `.env.example`:

```env
DB_USERNAME=your_username
DB_PASSWORD=your_password
POSTGRES_DB=fivebits_db
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/fivebits_db
```

> **Important:** Never commit the `.env` file. It is already in `.gitignore`.

---

## Running the Application

| Scenario | Command |
|---|---|
| First run or after code changes | `docker compose up --build` |
| After DB credential or schema changes | `docker compose down -v` then `docker compose up --build` |
| Restart without changes | `docker compose up` |
| Stop all services | `docker compose down` |
| Stop and wipe database | `docker compose down -v` |
| View live logs | `docker compose logs -f` |
| View logs for one service | `docker compose logs -f backend` |

---

## Git Workflow

We follow a **feature-branch workflow**. Never push directly to `main`.

### Step-by-step

```bash
# 1. Make sure you're on main and up to date
git checkout main
git pull origin main

# 2. Create a feature branch
git checkout -b feature/your-feature-name

# 3. Make your changes, then stage and commit
git add .
git commit -m "feat: add booking confirmation email"

# 4. Push your branch
git push origin feature/your-feature-name

# 5. Open a Pull Request on GitHub targeting main

# 6. After PR is merged, clean up
git checkout main
git pull origin main
git branch -d feature/your-feature-name
```

### Staying up to date

If `main` has new commits while you're working on your branch:

```bash
git checkout main
git pull origin main
git checkout feature/your-feature-name
git merge main
# Resolve any conflicts, then continue working
```

---

## Branch Naming Convention

Use the following prefixes:

| Prefix | Purpose | Example |
|---|---|---|
| `feature/` | New feature | `feature/payment-history` |
| `fix/` | Bug fix | `fix/login-redirect` |
| `refactor/` | Code restructuring | `refactor/booking-service` |
| `style/` | UI/CSS changes | `style/dashboard-layout` |
| `docs/` | Documentation | `docs/api-endpoints` |

Keep names short, lowercase, and hyphen-separated.

---

## Commit Message Convention

Follow this format:

```
<type>: <short description>
```

### Types

| Type | When to use |
|---|---|
| `feat` | Adding a new feature |
| `fix` | Fixing a bug |
| `style` | CSS or UI-only changes (no logic) |
| `refactor` | Restructuring code without changing behavior |
| `docs` | Documentation changes |
| `chore` | Config, dependencies, build changes |
| `test` | Adding or updating tests |

### Examples

```
feat: add owner payment dashboard tab
fix: resolve null pointer in booking service
style: update browse page card layout
refactor: extract distance calculation to utility method
docs: add API endpoint table to README
chore: update Spring Boot to 4.0.5
```

### Rules

- Use lowercase
- Use present tense ("add" not "added")
- Keep the first line under 72 characters
- No period at the end

---

## Pull Request Process

1. **Create a descriptive PR title** following the commit convention (e.g., `feat: add issue report resolution flow`)
2. **Fill in the PR description** with:
   - What you changed and why
   - Any new endpoints or pages added
   - Screenshots for UI changes
3. **Make sure your code runs** — `docker compose up --build` should succeed without errors
4. **Request a review** from at least one team member
5. **Address review feedback** before merging
6. **Squash and merge** into `main`

---

## Project Architecture

```
FiveBits/
├── fivebits-backend/                  # Spring Boot REST API
│   └── src/main/java/.../
│       ├── config/                    # SecurityConfig, JwtAuthFilter
│       ├── controller/                # REST endpoints (one per domain)
│       ├── dto/                       # Request/Response objects
│       ├── model/                     # JPA entities
│       ├── repository/                # Spring Data interfaces
│       ├── service/                   # Business logic
│       └── util/                      # Helpers (JwtUtil)
├── fivebits-frontend/                 # React SPA
│   └── src/
│       ├── components/                # Reusable UI elements
│       ├── context/                   # Auth state (AuthContext)
│       ├── layouts/                   # Navbar, Footer
│       ├── pages/                     # Full-page views
│       ├── services/                  # Axios API clients
│       └── styles/                    # CSS files (one per page)
```

### How the layers connect

```
Frontend Page → Service (Axios) → Backend Controller → Service → Repository → PostgreSQL
```

Each domain feature (e.g., bookings) has its own:
- **Model** (entity) → **Repository** (data) → **Service** (logic) → **Controller** (API)
- **DTO pair** (Request + Response)
- **Frontend page/tab** → **API service file** → **CSS file**

---

## Backend Guidelines

### Adding a new API endpoint

1. **Model** — Create or update the JPA entity in `model/`
2. **Repository** — Create a Spring Data interface in `repository/`
3. **DTOs** — Create `XxxRequest.java` and `XxxResponse.java` in `dto/`
4. **Service** — Add business logic in `service/`
5. **Controller** — Expose the endpoint in `controller/`
6. **Security** — If the endpoint should be public, add it to `SecurityConfig.java`

### Conventions

- Use `@RestController` and `@RequestMapping("/api/...")` for controllers
- Return `ResponseEntity<>` from controller methods
- Keep business logic in services, not controllers
- Use DTOs for API input/output — never expose entities directly
- Use Lombok `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor` for DTOs
- Use `@Transactional` for service methods that modify data
- Follow existing package structure — don't create new packages without team discussion

### API path conventions

```
GET    /api/{resource}          # List all
GET    /api/{resource}/{id}     # Get one
POST   /api/{resource}          # Create
PATCH  /api/{resource}/{id}     # Update
DELETE /api/{resource}/{id}     # Delete
```

---

## Frontend Guidelines

### Adding a new page

1. Create the page component in `src/pages/` (e.g., `newPage.jsx`)
2. Create a matching CSS file in `src/styles/` (e.g., `newPage.css`)
3. Add the route in `App.js` — use `<PrivateRoute>` if authentication is required
4. Add a navigation link in `navbar.jsx` if needed

### Adding a new API integration

1. Create or update a service file in `src/services/`
2. Use the existing Axios pattern with JWT token from `localStorage`
3. Call the service from your page component

### Conventions

- Use functional components with hooks
- Use `AuthContext` for authentication state — don't access `localStorage` directly in components
- One CSS file per page, named to match the page
- Use `className` instead of inline styles
- Keep API URLs relative (Axios baseURL handles the host)
- Handle loading and error states in every component that fetches data

---

## Adding a New Feature Checklist

Use this when implementing a new feature end-to-end:

- [ ] Create/update the JPA entity (`model/`)
- [ ] Create/update the repository interface (`repository/`)
- [ ] Create Request and Response DTOs (`dto/`)
- [ ] Implement service logic (`service/`)
- [ ] Create the REST controller (`controller/`)
- [ ] Update `SecurityConfig` if new public endpoints are needed
- [ ] Create/update the frontend API service (`services/`)
- [ ] Build the UI page or dashboard tab (`pages/`)
- [ ] Add styles (`styles/`)
- [ ] Add the route in `App.js`
- [ ] Test with `docker compose up --build`
- [ ] Commit with proper message and open a PR

---

## Docker Commands Reference

```bash
# Build and start everything
docker compose up --build

# Start without rebuilding
docker compose up

# Stop containers
docker compose down

# Stop and delete database volume (fresh start)
docker compose down -v

# Rebuild only one service
docker compose up --build backend
docker compose up --build frontend

# View logs
docker compose logs -f
docker compose logs -f backend
docker compose logs -f postgres

# Open a shell in a running container
docker exec -it fivebits-backend /bin/sh
docker exec -it fivebits-postgres psql -U <username> -d fivebits_db
```

---

## Troubleshooting

### Port already in use

```bash
# Find what's using port 8080 (Windows)
netstat -ano | findstr :8080
# Kill the process
taskkill /PID <pid> /F
```

### Database connection issues

1. Make sure PostgreSQL container is healthy: `docker compose ps`
2. Check your `.env` credentials match what you expect
3. Try a full reset: `docker compose down -v` then `docker compose up --build`

### Frontend not loading

1. Check the frontend container logs: `docker compose logs -f frontend`
2. Make sure port 80 is free
3. Hard refresh the browser (`Ctrl+Shift+R`)

### Backend won't start

1. Check backend logs: `docker compose logs -f backend`
2. Common issue: database not ready — the `depends_on` health check should handle this, but sometimes a restart helps
3. Check for Java compilation errors in the logs

### Changes not reflecting

- **Backend code changes:** Run `docker compose up --build backend`
- **Frontend code changes:** Run `docker compose up --build frontend`
- **Database schema changes:** Run `docker compose down -v` then `docker compose up --build`

---

## Quick Git Reference

```bash
git status                        # What's changed?
git add .                         # Stage all changes
git commit -m "feat: description" # Commit
git push origin branch-name       # Push to remote
git pull origin main              # Get latest main
git log --oneline -10             # Recent history
git stash                         # Temporarily save work
git stash pop                     # Restore saved work
git diff                          # See uncommitted changes
```