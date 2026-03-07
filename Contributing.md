# Contributing to FiveBits

Welcome to the FiveBits project! This guide will help you set up your development environment and contribute effectively to the project.

---

## **Table of Contents**
1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Development Workflow](#development-workflow)
4. [Working on Backend](#working-on-backend)
5. [Working on Frontend](#working-on-frontend)
6. [Committing Changes](#committing-changes)
7. [Running Tests](#running-tests)

---

## **Prerequisites**

- **Git** - Version control
- **Docker & Docker Compose** - For containerized development
- **Node.js** (v20+) - If developing frontend locally
- **Java 21** - If developing backend locally
- **Maven** - If building backend locally

Install from:
- Docker: https://www.docker.com/products/docker-desktop
- Node.js: https://nodejs.org/
- Java: https://www.oracle.com/java/technologies/javase/jdk21-archive-downloads.html

---

## **Initial Setup**

### **Step 1: Clone the Repository**
```powershell
git clone https://github.com/your-organization/fivebits.git
cd fivebits
```

### **Step 2: Verify Project Structure**
```
fivebits/
├── docker-compose.yml         # Orchestrates all services
├── DOCKER_SETUP.md            # Docker documentation
├── CONTRIBUTING.md            # This file
├── .gitignore
├── fivebits-backend/          # Spring Boot backend
│   ├── pom.xml
│   ├── Dockerfile
│   ├── src/
│   └── .dockerignore
└── fivebits-frontend/         # React frontend
    ├── package.json
    ├── Dockerfile
    ├── nginx.conf
    ├── src/
    └── .dockerignore
```

### **Step 3: Start Development Environment**
```powershell
# From project root
docker-compose up --build

# This starts:
# - PostgreSQL database (port 5432)
# - Spring Boot backend (port 8080)
# - React frontend with Nginx (port 80)
```

Access the application:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080
- **Database**: localhost:5432 (postgres/64820)

---

## **Development Workflow**

### **Step 1: Create a Feature Branch**
```powershell
git checkout -b feature/your-feature-name

# Good branch naming examples:
# - feature/add-comments-section
# - bugfix/fix-cors-error
# - docs/update-readme
```

### **Step 2: Make Your Changes**
Work in your specific folder (backend or frontend).

### **Step 3: Test Locally**
```powershell
# Keep docker-compose running in one terminal
docker-compose up

# In another terminal, make changes and the services auto-reload
# (Node.js has hot reload, Java might need restart)
```

### **Step 4: Commit Changes**
```powershell
# Stage only your changes
git add fivebits-backend/     # if backend changes
# OR
git add fivebits-frontend/    # if frontend changes

# Commit with clear message
git commit -m "Feature: Add new comment filtering

- Implemented comment filtering by date
- Updated API endpoint to support filter parameters
- Added frontend UI for filter controls"
```

### **Step 5: Push to Remote**
```powershell
git push origin feature/your-feature-name
```

### **Step 6: Create Pull Request**
- Go to GitHub/GitLab
- Click "New Pull Request"
- Select your branch
- Add description of changes
- Request review from team members

---

## **Working on Backend**

### **Backend Structure**
```
fivebits-backend/
├── src/main/java/com/fivebits/fivebits_backend/
│   ├── FivebitsBackendApplication.java    # Spring Boot entry point
│   ├── controller/
│   │   └── CommentsController.java        # REST endpoints
│   ├── model/
│   │   └── Comments.java                  # JPA entity / Database model
│   ├── repository/
│   │   └── CommentsRepository.java        # Database access
│   └── service/
│       └── CommentsService.java           # Business logic
├── src/main/resources/
│   ├── application.properties             # Spring Boot config
│   └── application.example.properties     # Example config
└── pom.xml                                # Maven dependencies
```

### **Backend Development**

**Making Backend Changes:**
```powershell
cd fivebits-backend

# Edit Java files in src/main/java/com/fivebits/fivebits_backend/
# The Docker container will auto-rebuild

# To manually rebuild:
docker-compose build backend
docker-compose restart backend
```

**Adding Database Migrations:**
1. Update model class in `model/Comments.java`
2. Hibernate will auto-create tables (configured in `application.properties`)
3. Changes apply automatically on restart

**Testing Backend:**
```powershell
# Backend runs at http://localhost:8080

# Test API endpoints:
curl http://localhost:8080/api/comments
```

**Common Backend Tasks:**
- Add new endpoint: Edit `CommentsController.java`
- Add new database field: Add property to `Comments.java`
- Add business logic: Edit `CommentsService.java`
- Database queries: Edit `CommentsRepository.java`

---

## **Working on Frontend**

### **Frontend Structure**
```
fivebits-frontend/
├── src/
│   ├── App.js                 # Main app component
│   ├── index.js               # React entry point
│   ├── components/            # Reusable components
│   │   └── comments.jsx
│   ├── pages/                 # Page components
│   │   ├── home.jsx
│   │   ├── about.jsx
│   │   ├── contact.jsx
│   │   └── services.jsx
│   ├── layouts/               # Layout components
│   │   ├── navbar.jsx
│   │   └── footer.jsx
│   ├── assets/                # Images, logos
│   └── styles/                # CSS files
├── public/
│   ├── index.html             # HTML entry point
│   ├── manifest.json
│   └── robots.txt
├── package.json               # Dependencies
├── Dockerfile
├── nginx.conf
└── .dockerignore
```

### **Frontend Development**

**Making Frontend Changes:**
```powershell
cd fivebits-frontend

# Edit React components in src/
# Hot reload works automatically in Docker

# To rebuild frontend:
docker-compose build frontend
docker-compose restart frontend
```

**Installing New Dependencies:**
```powershell
cd fivebits-frontend
npm install package-name

# Update package-lock.json
git add package.json package-lock.json
git commit -m "Add new dependency: package-name"
```

**API Integration:**
- Backend API is at `/api/*` (proxied through Nginx)
- Example: POST to `/api/comments` (not `http://localhost:8080/api/comments`)
- See `src/components/comments.jsx` for example

**Common Frontend Tasks:**
- Add new page: Create file in `src/pages/`
- Add UI component: Create file in `src/components/`
- Style changes: Edit corresponding `.css` file
- Add navigation link: Edit `src/layouts/navbar.jsx`

---

## **Committing Changes**

### **Commit Message Format**
```
<Type>: <Subject>

<Body - optional but recommended>
- Bullet point 1
- Bullet point 2

Fixes #<issue-number> (optional)
```

### **Commit Types**
- `Feature:` - New feature
- `Bugfix:` - Fixed a bug
- `Docs:` - Documentation changes
- `Refactor:` - Code restructuring
- `Style:` - Code style (formatting, etc)
- `Chore:` - Dependencies, config, etc

### **Example Commits**
```powershell
# Backend feature
git commit -m "Feature: Add comment validation

- Validate comment length before saving
- Return error message if validation fails
- Add unit tests for validation"

# Frontend bugfix
git commit -m "Bugfix: Fix comments not loading on page refresh

- Added error handling to fetch request
- Clear cache on component mount
- Improve error messages to user"

# Docker config
git commit -m "Chore: Update Docker compose version

- Updated Node.js to v20.10
- Updated Maven to 3.9.7"
```

### **Only Stage Your Changes**
```powershell
# If you only changed backend:
git add fivebits-backend/

# If you only changed frontend:
git add fivebits-frontend/

# Don't stage unrelated files
git status  # Always check before committing!
```

---

## **Running Tests**

### **Backend Tests**
```powershell
cd fivebits-backend

# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=CommentsControllerTest
```

### **Frontend Tests**
```powershell
cd fivebits-frontend

# Run all tests
npm test

# Run specific test
npm test -- comments.test.js
```

---

## **Code Review Process**

1. **Before pushing**, ensure:
   - ✅ All tests pass
   - ✅ Code follows project conventions
   - ✅ No console errors/warnings
   - ✅ Commit messages are clear

2. **After creating PR:**
   - Wait for team members to review
   - Address feedback and push updates
   - Once approved, merge to main

3. **After merge:**
   - Delete your feature branch
   - Pull latest main to stay updated

---

## **Troubleshooting**

### **Docker Container Won't Start**
```powershell
# Clean up and rebuild
docker-compose down -v
docker system prune -f
docker-compose up --build
```

### **Port Already in Use**
```powershell
# Check what's using the port (example port 80)
netstat -ano | findstr :80

# Kill the process (get PID from above)
taskkill /PID <PID> /F

# Or change ports in docker-compose.yml
```

### **Database Connection Error**
```powershell
# Wait for PostgreSQL to be ready
docker-compose logs postgres

# The logs should show "database system is ready to accept connections"
```

### **Changes Not Reflecting**
```powershell
# Rebuild and restart containers
docker-compose down
docker-compose up --build
```

---

## **Getting Help**

- Check [DOCKER_SETUP.md](DOCKER_SETUP.md) for Docker documentation
- Review existing code in your area
- Ask team members in messaging/meetings
- Check GitHub Issues for known problems

---

## **Summary**

```
1. Clone repo: git clone ...
2. Start services: docker-compose up --build
3. Create branch: git checkout -b feature/...
4. Make changes: Edit files in fivebits-backend/ or fivebits-frontend/
5. Commit: git add <folder> && git commit -m "..."
6. Push: git push origin feature/...
7. Create PR: Submit on GitHub/GitLab
8. Review & Merge: Team reviews and merges
```

**Happy coding! 🚀**
