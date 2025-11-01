# Rwanda Bills Backend - API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication
Most endpoints require JWT token in the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### 1. Sign Up
Create a new user account.

**Endpoint:** `POST /auth/signup`

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "telephone": "+250123456789",
  "district": "Kigali",
  "sector": "Gasabo",
  "password": "password123"
}
```

**Validation Rules:**
- `fullName`: Required, 2-100 characters
- `email`: Required, valid email format
- `telephone`: Required, 10-20 characters
- `district`: Required
- `sector`: Required
- `password`: Required, minimum 6 characters

**Success Response (201 Created):**
```json
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

**Error Response (400 Bad Request):**
```json
{
  "status": 400,
  "message": "Validation failed",
  "errors": {
    "email": "Email already registered",
    "password": "Password must be at least 6 characters"
  }
}
```

---

### 2. Login
Authenticate user and receive JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200 OK):**
```json
{
  "id": 1,
  "email": "john@example.com",
  "fullName": "John Doe",
  "telephone": "+250123456789",
  "district": "Kigali",
  "sector": "Gasabo",
  "role": "USER",
  "service": null,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2huQGV4YW1wbGUuY29tIiwiaWQiOjEsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDg2NDAwfQ.signature",
  "message": "Login successful"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "status": 401,
  "message": "Invalid email or password"
}
```

---

### 3. Health Check
Check if backend is running.

**Endpoint:** `GET /auth/health`

**Success Response (200 OK):**
```
"Backend is running"
```

---

## User Endpoints

### 1. Get Current User
Retrieve authenticated user's information.

**Endpoint:** `GET /users/me`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200 OK):**
```json
{
  "id": 1,
  "email": "john@example.com",
  "fullName": "John Doe",
  "telephone": "+250123456789",
  "district": "Kigali",
  "sector": "Gasabo",
  "role": "USER",
  "service": null
}
```

**Error Response (401 Unauthorized):**
```json
{
  "status": 401,
  "message": "No authenticated user found"
}
```

---

### 2. Get User by ID
Retrieve user information by ID.

**Endpoint:** `GET /users/{userId}`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
- `userId` (Long): User ID

**Success Response (200 OK):**
```json
{
  "id": 1,
  "email": "john@example.com",
  "fullName": "John Doe",
  "telephone": "+250123456789",
  "district": "Kigali",
  "sector": "Gasabo",
  "role": "USER",
  "service": null
}
```

**Error Response (404 Not Found):**
```json
{
  "status": 404,
  "message": "User not found"
}
```

---

### 3. Get User by Email
Retrieve user information by email.

**Endpoint:** `GET /users/email/{email}`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
- `email` (String): User email

**Success Response (200 OK):**
```json
{
  "id": 1,
  "email": "john@example.com",
  "fullName": "John Doe",
  "telephone": "+250123456789",
  "district": "Kigali",
  "sector": "Gasabo",
  "role": "USER",
  "service": null
}
```

**Error Response (404 Not Found):**
```json
{
  "status": 404,
  "message": "User not found"
}
```

---

## User Roles

The system supports three user roles:

| Role | Description |
|------|-------------|
| `USER` | Regular user, can view their bills and make payments |
| `ADMIN` | Service admin, manages bills for a specific service |
| `SUPER_ADMIN` | Platform admin, manages all services and admins |

---

## Service Types

For admin users, the following service types are available:

| Service | Description |
|---------|-------------|
| `WATER` | Water utility service |
| `SANITATION` | Sanitation service |
| `SECURITY` | Security service |

---

## Error Handling

All errors follow a consistent format:

```json
{
  "status": 400,
  "message": "Error description",
  "errors": {
    "field": "Field-specific error message"
  }
}
```

### Common HTTP Status Codes

| Status | Meaning |
|--------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid JWT token |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## JWT Token Usage

1. **Receive token** from login endpoint
2. **Store token** securely (e.g., httpOnly cookie or secure storage)
3. **Include token** in Authorization header for protected endpoints:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. **Token expires** after 24 hours (configurable in `application.yml`)

---

## Testing with cURL

### Sign Up
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "telephone": "+250123456789",
    "district": "Kigali",
    "sector": "Gasabo",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:8080/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Health Check
```bash
curl http://localhost:8080/api/auth/health
```

---

## Rate Limiting

Currently, no rate limiting is implemented. This should be added for production.

---

## CORS Configuration

The backend allows requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative frontend port)

For production, update CORS settings in `RwandabillApplication.java`.

---

## Next Endpoints to Implement

- [ ] Bill Management (Create, Read, Update, Delete)
- [ ] Payment Processing
- [ ] Admin Management
- [ ] Service Configuration
- [ ] Analytics and Reporting
- [ ] Notification System

---

## Support

For issues or questions, refer to:
- `README.md` - Project overview
- `SETUP.md` - Setup instructions
- Application logs in `logs/` directory
