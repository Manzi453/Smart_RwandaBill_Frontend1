# Quick Reference - Rwanda Bills Backend

## Start Backend

### Local Development
```bash
cd rwandabill
mvn spring-boot:run
```

### Docker
```bash
docker-compose up -d
```

**Backend URL:** `http://localhost:8080/api`

---

## Essential Commands

### Build
```bash
mvn clean install
```

### Test
```bash
mvn test
```

### Package
```bash
mvn clean package
```

### Run Specific Profile
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```

---

## Database Setup

### Create Database
```sql
CREATE DATABASE rwandabill_db;
```

### Connect to Database
```bash
psql -U postgres -d rwandabill_db
```

### Check Tables
```sql
\dt
SELECT * FROM users;
```

---

## API Quick Test

### Health Check
```bash
curl http://localhost:8080/api/auth/health
```

### Sign Up
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName":"Test","email":"test@test.com",
    "telephone":"+250123456789","district":"Kigali",
    "sector":"Gasabo","password":"password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

### Get Current User
```bash
curl -X GET http://localhost:8080/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Configuration

### Database
**File:** `src/main/resources/application.yml`
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/rwandabill_db
    username: postgres
    password: postgres
```

### JWT Secret
```yaml
jwt:
  secret: your-secret-key
  expiration: 86400000  # 24 hours
```

### Server Port
```yaml
server:
  port: 8080
```

---

## Project Structure

```
src/main/java/com/rwandabill/
├── controller/     → REST endpoints
├── service/        → Business logic
├── entity/         → Database models
├── dto/            → Data transfer objects
├── repository/     → Database access
├── security/       → JWT & auth
├── config/         → Spring configuration
└── exception/      → Error handling
```

---

## Key Files

| File | Purpose |
|------|---------|
| `pom.xml` | Dependencies |
| `application.yml` | Configuration |
| `AuthController.java` | Auth endpoints |
| `AuthService.java` | Auth logic |
| `User.java` | User entity |
| `JwtUtil.java` | JWT handling |
| `SecurityConfig.java` | Security setup |

---

## Endpoints Summary

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/auth/signup` | No | Register user |
| POST | `/auth/login` | No | Login user |
| GET | `/auth/health` | No | Health check |
| GET | `/users/me` | Yes | Get current user |
| GET | `/users/{id}` | Yes | Get user by ID |
| GET | `/users/email/{email}` | Yes | Get user by email |

---

## Common Issues

### Port Already in Use
```yaml
server:
  port: 8081  # Change port
```

### Database Connection Failed
- Ensure PostgreSQL is running
- Check credentials in `application.yml`
- Verify database exists

### JWT Secret Too Short
Generate new secret:
```bash
openssl rand -base64 32
```

### CORS Error
Check `RwandabillApplication.java` CORS configuration

---

## Useful Queries

### Check All Users
```sql
SELECT id, email, full_name, role FROM users;
```

### Check User by Email
```sql
SELECT * FROM users WHERE email = 'test@example.com';
```

### Delete User
```sql
DELETE FROM users WHERE email = 'test@example.com';
```

### Check Database Size
```sql
SELECT pg_size_pretty(pg_database_size('rwandabill_db'));
```

---

## Docker Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f backend
```

### Access Database in Docker
```bash
docker exec -it rwandabill_postgres psql -U postgres -d rwandabill_db
```

### Rebuild Images
```bash
docker-compose up -d --build
```

---

## Testing Tools

### Postman
- Import: `Rwanda_Bills_API.postman_collection.json`
- Set `base_url` = `http://localhost:8080/api`
- Set `jwt_token` after login

### cURL
```bash
# All examples in TESTING_GUIDE.md
```

### PowerShell
```powershell
# All examples in TESTING_GUIDE.md
```

---

## Logs

### View Application Logs
```bash
tail -f logs/application.log
```

### Filter Errors
```bash
grep ERROR logs/application.log
```

### Clear Logs
```bash
rm logs/application.log
```

---

## Documentation Files

| File | Content |
|------|---------|
| `README.md` | Project overview |
| `SETUP.md` | Setup instructions |
| `API_DOCUMENTATION.md` | API reference |
| `TESTING_GUIDE.md` | Testing procedures |
| `DEPLOYMENT.md` | Production deployment |
| `BACKEND_SUMMARY.md` | Complete summary |
| `QUICK_REFERENCE.md` | This file |

---

## Next Steps

1. **Setup Database** → `SETUP.md`
2. **Run Backend** → `mvn spring-boot:run`
3. **Test APIs** → `TESTING_GUIDE.md`
4. **Deploy** → `DEPLOYMENT.md`
5. **Implement Features** → Phase 2 (Bills)

---

## Useful Links

- Spring Boot Docs: https://spring.io/projects/spring-boot
- PostgreSQL Docs: https://www.postgresql.org/docs/
- JWT Docs: https://tools.ietf.org/html/rfc7519
- Maven Docs: https://maven.apache.org/

---

## Support

- Check logs: `logs/application.log`
- Read docs: See Documentation Files table
- Test API: Use Postman collection
- Debug: Enable DEBUG logging in `application.yml`

---

**Backend Ready! 🚀**
