# FiveBits Docker Setup

## Quick Start

1. **Prerequisites**: Install Docker and Docker Compose
   - Download from https://www.docker.com/products/docker-desktop

2. **Build and Run All Services**:
   ```bash
   docker-compose up --build
   ```

3. **Access the Application**:
   - Frontend: http://localhost (port 80)
   - Backend API: http://localhost:8080
   - Database: localhost:5432

4. **Stop Services**:
   ```bash
   docker-compose down
   ```

## Services

### PostgreSQL Database
- Container: `fivebits-postgres`
- Port: 5432
- Database: `commentsdb`
- Username: `postgres`
- Password: `64820`

### Spring Boot Backend
- Container: `fivebits-backend`
- Port: 8080
- Built from: `fivebits-backend/Dockerfile`
- Auto-creates tables via Hibernate DDL

### React Frontend (with Nginx)
- Container: `fivebits-frontend`
- Port: 80
- Built from: `fivebits-frontend/Dockerfile`
- API requests proxied to backend

## Useful Commands

**View logs**:
```bash
docker-compose logs -f backend    # View backend logs
docker-compose logs -f frontend   # View frontend logs
docker-compose logs -f postgres   # View database logs
docker-compose logs -f            # View all logs
```

**Access database**:
```bash
docker-compose exec postgres psql -U postgres -d commentsdb
```

**Rebuild containers**:
```bash
docker-compose build --no-cache
```

**Stop all services**:
```bash
docker-compose down -v  # -v also removes volumes
```

## Team Setup

Each team member simply needs to:
1. Clone the repository
2. Ensure Docker and Docker Compose are installed
3. Run `docker-compose up --build`
4. Access the app at http://localhost

No manual database setup required!

## Environment Variables

Backend environment variables are configured in `docker-compose.yml`. To override locally, create a `.env` file in the root directory:

```
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/commentsdb
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=64820
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SERVER_PORT=8080
```
