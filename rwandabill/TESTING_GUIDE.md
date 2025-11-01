# Testing Guide - Rwanda Bills Backend

## Prerequisites

- Backend running on `http://localhost:8080/api`
- PostgreSQL database set up
- Postman installed (optional, for API testing)

---

## Method 1: Using Postman

### Setup

1. **Import Collection**
   - Open Postman
   - Click "Import"
   - Select `Rwanda_Bills_API.postman_collection.json`
   - Collection will be imported with all endpoints

2. **Configure Variables**
   - In Postman, go to "Variables" tab
   - Set `base_url` = `http://localhost:8080/api`
   - After login, copy the token and set `jwt_token` variable

### Test Flow

#### 1. Health Check
- **Request:** GET `/auth/health`
- **Expected:** "Backend is running"

#### 2. Sign Up
- **Request:** POST `/auth/signup`
- **Body:**
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
- **Expected Response:** 201 Created with user data

#### 3. Login
- **Request:** POST `/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Expected Response:** 200 OK with JWT token
- **Action:** Copy the token and set `jwt_token` variable in Postman

#### 4. Get Current User
- **Request:** GET `/users/me`
- **Headers:** `Authorization: Bearer {{jwt_token}}`
- **Expected Response:** 200 OK with user details

#### 5. Get User by ID
- **Request:** GET `/users/1`
- **Headers:** `Authorization: Bearer {{jwt_token}}`
- **Expected Response:** 200 OK with user details

#### 6. Get User by Email
- **Request:** GET `/users/email/john@example.com`
- **Headers:** `Authorization: Bearer {{jwt_token}}`
- **Expected Response:** 200 OK with user details

---

## Method 2: Using PowerShell

### Test Health
```powershell
Invoke-WebRequest -Uri "http://localhost:8080/api/auth/health" -Method GET
```

### Test Sign Up
```powershell
$body = @{
    fullName = "Jane Smith"
    email = "jane@example.com"
    telephone = "+250987654321"
    district = "Kigali"
    sector = "Nyarugenge"
    password = "password456"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/signup" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $body

$response.Content | ConvertFrom-Json
```

### Test Login
```powershell
$body = @{
    email = "jane@example.com"
    password = "password456"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/login" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $body

$loginResponse = $response.Content | ConvertFrom-Json
$token = $loginResponse.token
Write-Host "Token: $token"
```

### Test Get Current User
```powershell
$token = "YOUR_JWT_TOKEN_HERE"

$response = Invoke-WebRequest -Uri "http://localhost:8080/api/users/me" `
    -Method GET `
    -Headers @{"Authorization"="Bearer $token"}

$response.Content | ConvertFrom-Json
```

---

## Method 3: Using cURL

### Test Health
```bash
curl http://localhost:8080/api/auth/health
```

### Test Sign Up
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Bob Johnson",
    "email": "bob@example.com",
    "telephone": "+250111222333",
    "district": "Kigali",
    "sector": "Kicukiro",
    "password": "password789"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "bob@example.com",
    "password": "password789"
  }'
```

### Test Get Current User
```bash
TOKEN="your_jwt_token_here"

curl -X GET http://localhost:8080/api/users/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## Method 4: Using Frontend

### Test with React Frontend

1. **Start Frontend**
   ```bash
   cd C:\Users\Admin\IdeaProjects\rwandabill_backend\Frontend
   npm run dev
   ```

2. **Navigate to Sign Up**
   - Go to `http://localhost:5173/signup`
   - Fill in the form
   - Click "Sign Up"
   - Check browser console for response

3. **Navigate to Login**
   - Go to `http://localhost:5173/login`
   - Enter credentials
   - Click "Login"
   - Should redirect to dashboard

4. **Verify Dashboard**
   - After login, should see user dashboard
   - Check browser DevTools Network tab to see API calls

---

## Validation Testing

### Test Invalid Email
```json
{
  "fullName": "Test User",
  "email": "invalid-email",
  "telephone": "+250123456789",
  "district": "Kigali",
  "sector": "Gasabo",
  "password": "password123"
}
```
**Expected:** 400 Bad Request with validation error

### Test Short Password
```json
{
  "fullName": "Test User",
  "email": "test@example.com",
  "telephone": "+250123456789",
  "district": "Kigali",
  "sector": "Gasabo",
  "password": "123"
}
```
**Expected:** 400 Bad Request - "Password must be at least 6 characters"

### Test Duplicate Email
1. Sign up with email: `test@example.com`
2. Try to sign up again with same email
**Expected:** 400 Bad Request - "Email already registered"

### Test Wrong Password
```json
{
  "email": "test@example.com",
  "password": "wrongpassword"
}
```
**Expected:** 401 Unauthorized - "Invalid email or password"

### Test Missing JWT Token
```bash
curl -X GET http://localhost:8080/api/users/me
```
**Expected:** 401 Unauthorized

---

## Database Verification

### Check Users Table
```sql
SELECT * FROM users;
```

### Check User Details
```sql
SELECT id, email, full_name, role, is_active, created_at FROM users WHERE email = 'test@example.com';
```

### Check Password Encryption
```sql
SELECT email, password FROM users LIMIT 1;
```
**Note:** Password should be hashed (bcrypt format: `$2a$...`)

---

## Performance Testing

### Load Testing with Apache Bench
```bash
# Test signup endpoint
ab -n 100 -c 10 -p data.json -T application/json http://localhost:8080/api/auth/signup

# Test login endpoint
ab -n 100 -c 10 -p login.json -T application/json http://localhost:8080/api/auth/login
```

### Monitor Application Logs
```bash
# Watch logs in real-time
tail -f logs/application.log
```

---

## Troubleshooting

### 401 Unauthorized on Protected Endpoints
- **Issue:** Token is invalid or expired
- **Solution:** 
  - Get a new token from login
  - Ensure token is in correct format: `Bearer <token>`
  - Check token expiration (24 hours by default)

### 400 Bad Request on Signup
- **Issue:** Validation failed
- **Solution:**
  - Check all required fields are provided
  - Verify email format
  - Ensure password is at least 6 characters
  - Check for duplicate email

### 500 Internal Server Error
- **Issue:** Server error
- **Solution:**
  - Check application logs
  - Verify database connection
  - Check JWT secret configuration

### Database Connection Error
- **Issue:** Cannot connect to PostgreSQL
- **Solution:**
  - Ensure PostgreSQL is running
  - Verify connection string in `application.yml`
  - Check database credentials
  - Verify database exists: `CREATE DATABASE rwandabill_db;`

---

## Test Checklist

- [ ] Health check returns "Backend is running"
- [ ] Sign up creates new user successfully
- [ ] Duplicate email signup returns error
- [ ] Login returns JWT token
- [ ] Wrong password login returns error
- [ ] Get current user returns authenticated user
- [ ] Get user by ID returns correct user
- [ ] Get user by email returns correct user
- [ ] Missing JWT token returns 401
- [ ] Expired JWT token returns 401
- [ ] Password is encrypted in database
- [ ] User timestamps are set correctly
- [ ] CORS allows frontend requests

---

## Next Steps

After successful testing:
1. Implement Bill Management endpoints
2. Add Payment Processing
3. Create Admin Management features
4. Set up notification system
5. Add comprehensive unit and integration tests
