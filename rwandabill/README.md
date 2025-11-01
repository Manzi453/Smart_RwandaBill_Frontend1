# Rwanda Bills Backend

Spring Boot backend for the Rwanda Bills Management System with PostgreSQL database.

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL 12+
- Git

## Setup Instructions

### 1. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE rwandabill_db;
```

The application will automatically create tables on first run due to `ddl-auto: update` in `application.yml`.

### 2. Environment Configuration

Edit `src/main/resources/application.yml` and update:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/rwandabill_db
    username: postgres
    password: postgres  # Change to your PostgreSQL password

jwt:
  secret: your-secret-key-change-this-in-production-with-a-strong-key-at-least-256-bits-long
  expiration: 86400000  # 24 hours
```

### 3. Build the Project

```bash
mvn clean install
```

### 4. Run the Application

```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080/api`

## API Endpoints

### Authentication

#### Sign Up
```
POST /api/auth/signup
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "telephone": "+250123456789",
  "district": "Kigali",
  "sector": "Gasabo",
  "password": "password123"
}

Response (201 Created):
{
  "id": 1,
  "email": "john@example.com",
  "fullName": "John Doe",
  "telephone": "+250123456789",
  "district": "Kigali",
  "sector": "Gasabo",
  "role": "USER",
  "service": null,
  "message": "User registered successfully"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response (200 OK):
{
  "id": 1,
  "email": "john@example.com",
  "fullName": "John Doe",
  "telephone": "+250123456789",
  "district": "Kigali",
  "sector": "Gasabo",
  "role": "USER",
  "service": null,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful"
}
```

#### Health Check
```
GET /api/auth/health

Response (200 OK):
"Backend is running"
```

## Project Structure

```
src/main/java/com/rwandabill/
├── RwandabillApplication.java      # Main application class
├── controller/
│   └── AuthController.java         # Authentication endpoints
├── service/
│   └── AuthService.java            # Business logic
├── entity/
│   ├── User.java                   # User entity
│   ├── UserRole.java               # Role enum
│   └── ServiceType.java            # Service enum
├── dto/
│   ├── LoginRequest.java           # Login DTO
│   ├── SignupRequest.java          # Signup DTO
│   └── AuthResponse.java           # Auth response DTO
├── repository/
│   └── UserRepository.java         # Database access
├── security/
│   └── JwtUtil.java                # JWT token handling
└── exception/
    └── GlobalExceptionHandler.java # Exception handling
```

## Features

- ✅ User Registration (Signup)
- ✅ User Login with JWT Token
- ✅ Password Encryption (BCrypt)
- ✅ Input Validation
- ✅ CORS Configuration
- ✅ Global Exception Handling
- ✅ Logging

## Next Steps

- [ ] Implement JWT authentication filter
- [ ] Add role-based access control (RBAC)
- [ ] Create Bill entity and endpoints
- [ ] Implement payment processing
- [ ] Add notification system
- [ ] Create admin management endpoints
- [ ] Add comprehensive testing

## Security Notes

⚠️ **Important for Production:**

1. Change the JWT secret to a strong, random key (at least 256 bits)
2. Use environment variables for sensitive data
3. Enable HTTPS
4. Implement rate limiting
5. Add request logging and monitoring
6. Use a secrets manager for credentials

## Troubleshooting

### PostgreSQL Connection Error
- Ensure PostgreSQL is running
- Verify database credentials in `application.yml`
- Check if database `rwandabill_db` exists

### Port Already in Use
- Change `server.port` in `application.yml` to another port (e.g., 8081)

### JWT Secret Too Short
- Generate a strong secret: `openssl rand -base64 32`
- Update in `application.yml`

## License

MIT License
