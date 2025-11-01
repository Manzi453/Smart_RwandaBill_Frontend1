# Quick Setup Guide

## Step 1: PostgreSQL Database Setup

### Windows
1. Install PostgreSQL from https://www.postgresql.org/download/windows/
2. During installation, remember the password for the `postgres` user
3. Open pgAdmin (comes with PostgreSQL)
4. Create a new database named `rwandabill_db`

### Or using Command Line
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE rwandabill_db;

# Verify
\l
```

## Step 2: Configure Backend

Edit `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/rwandabill_db
    username: postgres
    password: YOUR_POSTGRES_PASSWORD  # Replace with your password
```

## Step 3: Generate JWT Secret (Optional but Recommended)

For production, generate a strong secret:

```bash
# On Windows (PowerShell)
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# On Mac/Linux
openssl rand -base64 32
```

Update in `application.yml`:
```yaml
jwt:
  secret: YOUR_GENERATED_SECRET
```

## Step 4: Build and Run

```bash
# Navigate to project directory
cd C:\Users\Admin\IdeaProjects\rwandabill_backend\rwandabill

# Build
mvn clean install

# Run
mvn spring-boot:run
```

Expected output:
```
Started RwandabillApplication in X.XXX seconds
```

## Step 5: Test the Backend

### Using PowerShell

#### Test Signup
```powershell
$body = @{
    fullName = "Test User"
    email = "test@example.com"
    telephone = "+250123456789"
    district = "Kigali"
    sector = "Gasabo"
    password = "password123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/api/auth/signup" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $body
```

#### Test Login
```powershell
$body = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/api/auth/login" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $body
```

#### Test Health
```powershell
Invoke-WebRequest -Uri "http://localhost:8080/api/auth/health" -Method GET
```

### Using cURL (if installed)

```bash
# Signup
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

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Health
curl http://localhost:8080/api/auth/health
```

## Step 6: Connect Frontend to Backend

Update the frontend API calls to use the backend. The frontend already has the correct endpoint configured in `AuthContext.tsx`:

```typescript
const response = await fetch('http://localhost:8080/api/auth/login', ...)
```

## Troubleshooting

### PostgreSQL Connection Failed
```
Error: Connection to localhost:5432 refused
```
**Solution**: Ensure PostgreSQL is running
- Windows: Check Services (services.msc) for PostgreSQL service
- Or start PostgreSQL manually

### Database Does Not Exist
```
Error: database "rwandabill_db" does not exist
```
**Solution**: Create the database using pgAdmin or psql

### Port 8080 Already in Use
```
Error: Address already in use
```
**Solution**: Change port in `application.yml`
```yaml
server:
  port: 8081
```

### JWT Secret Too Short
```
Error: The key size of the given key object (X bits) does not meet the minimum 256 bits
```
**Solution**: Generate a proper secret using the command in Step 3

## Next: Update Frontend

Once backend is running, the frontend should automatically work with:
- Signup at `/signup`
- Login at `/login`
- Dashboard access after login

Test the full flow end-to-end!
