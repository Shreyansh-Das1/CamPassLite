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
- React and Vite *(planned)*

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

`src/main/resources/application.yml`

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

### 4. Run the Database with Docker (Optional)

If you use the provided Docker Compose configuration, start the database with:

```bash
docker compose up -d postgres
```

Check `docker-compose.yml` for the configured database name, credentials, and port. Ensure they match your application configuration.

## API Overview

The backend exposes REST endpoints under `/api`.

| Module | Purpose |
|---|---|
| Authentication | Register users and log in |
| Events | Create and retrieve campus events |
| Event Registration | Register for events and view registrations |
| Registration Cancellation | Cancel an existing registration |

The exact endpoints and required permissions are defined in the controller classes.

Authenticated endpoints require a valid JWT. Access to protected operations depends on the user's role.

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
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/campusevent/
│   │   │       ├── controller/
│   │   │       ├── service/
│   │   │       ├── repository/
│   │   │       ├── entity/
│   │   │       ├── dto/
│   │   │       └── security/
│   │   └── resources/
│   │       └── application.yml
│   └── test/
├── build.gradle
├── settings.gradle
├── docker-compose.yml
└── README.md
```

*Directory names may vary slightly depending on the current implementation.*

## Development Status

CamPassLite is an ongoing learning project.

Current priorities:
- Stabilize backend authentication and event operations.
- Complete the core event CRUD workflow.
- Verify event registration and cancellation.
- Build a React frontend and integrate it with the REST API.

## License

No license has been specified yet. Unless a license is added to the repository, all rights remain with the copyright holder.