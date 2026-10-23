# CamPassLite

A lightweight **Campus Event Management System** built with Spring Boot and PostgreSQL. CamPassLite simplifies campus event management by providing a REST API for creating, viewing, and managing events, with authentication and role-based access control.

The project is a simplified version of the original CamPass system, focused on core backend functionality and a manageable full-stack implementation.

## Features

- **Event Management:** Create and view campus events.
- **Authentication:** User registration and login using JWT-based authentication.
- **Role-Based Access Control:** Separate permissions for students, organizers, and administrators.
- **Event Registration:** Allow students to register for events and manage their registrations.
- **Registration Management:** View registered events and cancel registrations.
- **RESTful API:** Structured HTTP endpoints for frontend integration.
- **PostgreSQL Database:** Persistent storage for users, events, and registrations.

> **Project scope:** CamPassLite prioritizes essential campus event management functionality. Advanced features such as QR-based ticketing and check-in are outside the current scope.

## Tech Stack

### Backend
- Java 17
- Spring Boot
- Spring Web MVC
- Spring Data JPA
- Spring Security
- JWT authentication
- BCrypt password hashing
- Gradle

### Database
- PostgreSQL

### Frontend
- React 19
- Vite
- Tailwind CSS
- React Router

### Development Tools
- Git and GitHub
- Docker Compose *(optional for local database setup)*

## Architecture

The backend follows a layered architecture:

```text
Client / Frontend
       |
       v
 REST Controllers
       |
       v
   Services
       |
       v
 Repositories
       |
       v
   PostgreSQL
```

- **Controllers:** Handle HTTP requests and responses.
- **Services:** Contain application logic and coordinate operations.
- **Repositories:** Access and manage database entities through Spring Data JPA.
- **DTOs:** Transfer request and response data between the API and client.
- **Security:** Protects endpoints using JWT authentication and role-based authorization.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Java 17 or compatible JDK
- PostgreSQL
- Git
- An IDE such as IntelliJ IDEA or VS Code

Docker is optional if you prefer running PostgreSQL in a container.

### 1. Clone the Repository

```bash
git clone https://github.com/Shreyansh-Das1/CamPassLite.git
cd CamPassLite
```

### 2. Configure PostgreSQL

Create a PostgreSQL database named `CEM` and configure your database credentials in:

`backend/src/main/resources/application.yml`

Example configuration:

```yaml
spring:
  application:
    name: CamPassLite

  datasource:
    url: jdbc:postgresql://localhost:5432/CEM
    driver-class-name: org.postgresql.Driver
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}

  jpa:
    hibernate:
      ddl-auto: update

jwt:
  secret: ${JWT_SECRET}
  expiration: 86400000
```

Set `DB_USERNAME`, `DB_PASSWORD`, and `JWT_SECRET` in your environment before starting the application.

**Note:** Use a sufficiently long, randomly generated JWT secret. Keep credentials and secrets out of version control. The `update` setting is intended for development; production deployments should use a controlled database migration strategy.

### 3. Run the Backend

From the repository root, change into the backend directory first:

```bash
cd backend
```

On Windows:

```powershell
.\gradlew.bat bootRun
```

On Linux or macOS:

```bash
./gradlew bootRun
```

Once started, the backend will be available at:

```text
http://localhost:8080
```

### 4. Run the Frontend

The React + Tailwind frontend lives in the `frontend/` directory. It proxies `/api` requests to `http://localhost:8080`.

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. To build for production:

```bash
npm run build
```

### 5. Run the Database with Docker (Optional)

If you use the provided Docker Compose configuration (located in `backend/`), start the database with:

```bash
cd backend
docker compose up -d postgres
```

Check `docker-compose.yml` for the configured database name, credentials, and port. Ensure they match your application configuration.

### 6. Creating Organizer and Admin Accounts

New accounts registered through the UI are always `STUDENT`. To try the organizer or admin experience, register an account in the app and then promote it directly in PostgreSQL:

```bash
docker exec campass-db psql -U shrey -d CEM -c "UPDATE users SET role='ORGANIZER' WHERE email='organizer@campus.edu';"
docker exec campass-db psql -U shrey -d CEM -c "UPDATE users SET role='ADMIN' WHERE email='admin@campus.edu';"
```

Log out and log back in afterwards so the frontend reloads the new role.

> The default `application.yml` uses `ddl-auto: create`, so the schema (and all data) is recreated every time the backend restarts.

## API Overview

The backend exposes REST endpoints under `/api`.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new student account |
| `POST` | `/api/auth/login` | Public | Log in and receive a JWT |
| `GET` | `/api/auth/me` | Authenticated | Get the current user's profile and role |
| `GET` | `/api/event/getappr` | Authenticated | List approved events |
| `POST` | `/api/event/create` | `ORGANIZER` | Create an event |
| `PUT` | `/api/event/{id}/approval` | `ADMIN` | Approve or cancel an event |
| `PUT` | `/api/registration/reserve` | `STUDENT` | Reserve a seat (body: numeric event id) |
| `GET` | `/api/registration/registered` | `STUDENT` | List the current user's registrations |
| `DELETE` | `/api/registration/cancel` | `STUDENT` | Cancel a registration (body: numeric event id) |

Authenticated endpoints require a valid JWT in the `Authorization: Bearer <token>` header.

## User Roles

| Role | Responsibility |
|---|---|
| `STUDENT` | Browse events and manage event registrations |
| `ORGANIZER` | Create and manage events |
| `ADMIN` | Perform administrative operations, including event approval where enabled |

The precise permissions depend on the security rules implemented by the backend.

## Project Structure

```text
CamPassLite/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/campusEvent/campus_event/
│   │   │   │       ├── controller/
│   │   │   │       ├── dto/
│   │   │   │       ├── entity/
│   │   │   │       ├── relations/
│   │   │   │       ├── repository/
│   │   │   │       ├── security/
│   │   │   │       └── service/
│   │   │   └── resources/
│   │   │       └── application.yml
│   │   └── test/
│   ├── build.gradle
│   ├── settings.gradle
│   ├── gradlew
│   ├── gradlew.bat
│   ├── gradle/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── HELP.md
│   └── ER Diagram.png
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── utils/
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── .gitignore
└── README.md
```

## Development Status

CamPassLite is an ongoing learning project.

Completed:
- JWT authentication with role-based access control.
- Event creation, approval and cancellation.
- Event registration and cancellation.
- React + Tailwind frontend covering student, organizer and admin workflows.

Next steps:
- Add a "my events" endpoint for organizers (currently tracked client-side).
- Add pending-event listing and an approval queue for admins.
- Replace `ddl-auto: create` with migrations for persistent data.

## License

No license has been specified yet. Unless a license is added to the repository, all rights remain with the copyright holder.