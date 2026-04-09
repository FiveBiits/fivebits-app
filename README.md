# FiveBits — Boarding Place Discovery & Management System

A full-stack web application that helps Sri Lankan university students find, book, and manage boarding places — while giving boarding owners the tools to list, track, and manage their properties efficiently.

> **CS1040 Semester 2 Project — University of Moratuwa, 2026**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router 7, Leaflet Maps, Axios |
| Backend | Spring Boot 4, Spring Security, Spring Data JPA |
| Database | PostgreSQL 16 |
| Auth | JWT (HS256) with role-based access control |
| Deployment | Docker Compose (frontend + backend + database) |

---

## Features

**For Students**
- Browse and search boarding places with filters (university, price range)
- View boarding place locations on an interactive map
- Distance calculation from boarding place to university
- Book boarding places and track booking status
- Make payments for boarding fees and utility bills
- Report maintenance issues and track resolution

**For Boarding Owners**
- Register and manage boarding place listings with images
- Review, confirm, or cancel booking requests
- Track revenue and payment history
- Respond to and resolve tenant issue reports
- Dashboard with key business metrics

**General**
- JWT-based authentication with role separation (Student / Owner)
- Top boarding place recommendations based on student preferences
- Pre-seeded data for 20 Sri Lankan universities with coordinates
- Responsive UI across devices

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- Git

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd FiveBits
```

### 2. Create a `.env` file

Copy the example and fill in your credentials:

```bash
cp .env.example .env
```

```env
DB_USERNAME=your_username
DB_PASSWORD=your_password
POSTGRES_DB=fivebits_db
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/fivebits_db
```

### 3. Build and run

```bash
docker compose up --build
```

### 4. Access the application

| Service | URL |
|---|---|
| Frontend | http://localhost:80 |
| Backend API | http://localhost:8080 |
| PostgreSQL | localhost:5432 |

---

## Project Structure

```
FiveBits/
├── docker-compose.yml
├── .env.example
├── fivebits-backend/          # Spring Boot REST API
│   ├── src/main/java/com/fivebits/fivebits_backend/
│   │   ├── config/            # Security & JWT filter
│   │   ├── controller/        # REST endpoints
│   │   ├── dto/               # Request/response objects
│   │   ├── model/             # JPA entities
│   │   ├── repository/        # Data access layer
│   │   ├── service/           # Business logic
│   │   └── util/              # JWT utilities
│   └── src/main/resources/
│       ├── application.properties
│       └── data.sql           # University seed data
├── fivebits-frontend/         # React SPA
│   └── src/
│       ├── components/        # Reusable UI (maps, route guards)
│       ├── context/           # Auth state management
│       ├── layouts/           # Navbar, Footer
│       ├── pages/             # Page-level views
│       ├── services/          # API client modules
│       └── styles/            # CSS files
```

---

## API Overview

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | Public | Register a new student or owner |
| POST | `/api/auth/login` | Public | Authenticate and receive JWT |
| GET | `/api/places` | Public | List all boarding places |
| POST | `/api/places` | Owner | Create a new listing |
| PATCH | `/api/places/{id}` | Owner | Update a listing |
| DELETE | `/api/places/{id}` | Owner | Delete a listing |
| POST | `/api/bookings` | Student | Create a booking request |
| PUT | `/api/bookings/{id}/confirm` | Owner | Confirm a booking |
| PUT | `/api/bookings/{id}/cancel` | Auth | Cancel a booking |
| GET | `/api/universities` | Public | List all universities |
| POST | `/api/issues` | Student | Report a maintenance issue |
| POST | `/api/payments` | Auth | Record a payment |
| GET | `/api/dashboard/student` | Student | Student dashboard stats |
| GET | `/api/dashboard/owner` | Owner | Owner dashboard stats |

---

## Docker Commands Reference

| Scenario | Command |
|---|---|
| First run or code changes | `docker compose up --build` |
| Database credential/schema changes | `docker compose down -v` then `docker compose up --build` |
| Restart without changes | `docker compose up` |
| Stop all containers | `docker compose down` |
| View logs | `docker compose logs -f` |

---

## Team — FiveBits

| Index No | Name |
|---|---|
| 240347J | Kawya W.W.D. |
| 240615F | Sewwandi P.D.Y. |
| 240058A | Bandara V.M.V.A. |
| 240721C | Wijenayake W.M.P.S. |
| 240005K | Abegunawardhana A.D. |

---

## License

This project is developed for academic purposes as part of CS1040, University of Moratuwa.