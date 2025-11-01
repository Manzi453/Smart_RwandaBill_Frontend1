# Deployment Guide - Rwanda Bills Backend

## Local Development Setup

### Prerequisites
- Java 17+
- Maven 3.6+
- PostgreSQL 12+

### Steps

1. **Clone/Setup Project**
   ```bash
   cd C:\Users\Admin\IdeaProjects\rwandabill_backend\rwandabill
   ```

2. **Configure Database**
   ```sql
   CREATE DATABASE rwandabill_db;
   ```

3. **Update Configuration**
   - Edit `src/main/resources/application.yml`
   - Set database credentials
   - Generate strong JWT secret

4. **Build**
   ```bash
   mvn clean install
   ```

5. **Run**
   ```bash
   mvn spring-boot:run
   ```

6. **Verify**
   ```bash
   curl http://localhost:8080/api/auth/health
   ```

---

## Docker Deployment

### Prerequisites
- Docker installed
- Docker Compose installed

### Quick Start

```bash
# Navigate to project directory
cd C:\Users\Admin\IdeaProjects\rwandabill_backend\rwandabill

# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop containers
docker-compose down
```

### What Gets Started
- PostgreSQL database on port 5432
- Spring Boot backend on port 8080
- Automatic database initialization

### Verify Deployment
```bash
curl http://localhost:8080/api/auth/health
```

### Access Database
```bash
docker exec -it rwandabill_postgres psql -U postgres -d rwandabill_db
```

---

## Production Deployment

### Prerequisites
- Server with Java 17+ runtime
- PostgreSQL database
- Reverse proxy (Nginx/Apache)
- SSL certificate

### Environment Variables

Create `.env` file:
```env
SPRING_DATASOURCE_URL=jdbc:postgresql://db-host:5432/rwandabill_db
SPRING_DATASOURCE_USERNAME=db_user
SPRING_DATASOURCE_PASSWORD=secure_password
JWT_SECRET=very-long-secure-random-key-at-least-256-bits
JWT_EXPIRATION=86400000
SPRING_PROFILES_ACTIVE=prod
```

### Build for Production

```bash
# Build jar
mvn clean package -DskipTests

# Output: target/rwandabill-backend-1.0.0.jar
```

### Run on Server

```bash
# Copy jar to server
scp target/rwandabill-backend-1.0.0.jar user@server:/opt/rwandabill/

# SSH into server
ssh user@server

# Run application
java -jar /opt/rwandabill/rwandabill-backend-1.0.0.jar
```

### Systemd Service (Linux)

Create `/etc/systemd/system/rwandabill.service`:

```ini
[Unit]
Description=Rwanda Bills Backend
After=network.target

[Service]
Type=simple
User=rwandabill
WorkingDirectory=/opt/rwandabill
EnvironmentFile=/opt/rwandabill/.env
ExecStart=/usr/bin/java -jar rwandabill-backend-1.0.0.jar
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable rwandabill
sudo systemctl start rwandabill
sudo systemctl status rwandabill
```

### Nginx Configuration

```nginx
upstream rwandabill_backend {
    server localhost:8080;
}

server {
    listen 443 ssl http2;
    server_name api.rwandabill.com;

    ssl_certificate /etc/ssl/certs/your-cert.crt;
    ssl_certificate_key /etc/ssl/private/your-key.key;

    location /api {
        proxy_pass http://rwandabill_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name api.rwandabill.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Database Backup & Recovery

### Backup PostgreSQL

```bash
# Backup database
pg_dump -U postgres -h localhost rwandabill_db > backup.sql

# Backup with compression
pg_dump -U postgres -h localhost -Fc rwandabill_db > backup.dump
```

### Restore Database

```bash
# Restore from SQL file
psql -U postgres -h localhost rwandabill_db < backup.sql

# Restore from compressed dump
pg_restore -U postgres -h localhost -d rwandabill_db backup.dump
```

### Automated Backups (Linux Cron)

```bash
# Add to crontab
0 2 * * * pg_dump -U postgres rwandabill_db | gzip > /backups/rwandabill_$(date +\%Y\%m\%d).sql.gz
```

---

## Monitoring & Logging

### Application Logs

```bash
# View logs
tail -f logs/application.log

# Filter by level
grep ERROR logs/application.log
grep WARN logs/application.log
```

### Database Monitoring

```sql
-- Check active connections
SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;

-- Check slow queries
SELECT query, calls, mean_time FROM pg_stat_statements ORDER BY mean_time DESC;

-- Check table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) 
FROM pg_tables ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Health Checks

```bash
# Regular health check
curl http://localhost:8080/api/auth/health

# With monitoring tools
watch -n 5 'curl -s http://localhost:8080/api/auth/health'
```

---

## Security Checklist

- [ ] Change default JWT secret
- [ ] Use HTTPS/SSL in production
- [ ] Enable database authentication
- [ ] Set up firewall rules
- [ ] Configure CORS properly
- [ ] Enable request logging
- [ ] Set up rate limiting
- [ ] Regular security updates
- [ ] Database backups automated
- [ ] Monitor error logs
- [ ] Use environment variables for secrets
- [ ] Implement API key management

---

## Performance Tuning

### JVM Settings

```bash
# Increase heap memory
java -Xmx2g -Xms1g -jar rwandabill-backend-1.0.0.jar

# Enable GC logging
java -Xmx2g -Xms1g \
  -XX:+PrintGCDetails \
  -XX:+PrintGCDateStamps \
  -Xloggc:gc.log \
  -jar rwandabill-backend-1.0.0.jar
```

### Database Connection Pool

Edit `application.yml`:
```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
```

### Caching

Add Redis for caching:
```yaml
spring:
  redis:
    host: localhost
    port: 6379
```

---

## Scaling

### Horizontal Scaling

1. **Load Balancer Setup**
   - Configure Nginx/HAProxy
   - Point to multiple backend instances

2. **Database Replication**
   - Set up PostgreSQL replication
   - Configure read replicas

3. **Session Management**
   - Use Redis for distributed sessions
   - Configure session store

### Vertical Scaling

- Increase server resources (CPU, RAM)
- Optimize JVM settings
- Tune database parameters

---

## Troubleshooting

### Application Won't Start
```bash
# Check logs
tail -f logs/application.log

# Verify database connection
psql -U postgres -h localhost -d rwandabill_db

# Check port availability
netstat -an | grep 8080
```

### High Memory Usage
```bash
# Check heap usage
jps -l
jmap -heap <pid>

# Increase heap size
java -Xmx4g -jar rwandabill-backend-1.0.0.jar
```

### Database Connection Errors
```bash
# Test connection
psql -U postgres -h db-host -d rwandabill_db

# Check connection pool
SELECT * FROM pg_stat_activity;
```

---

## Rollback Procedure

1. **Stop current version**
   ```bash
   systemctl stop rwandabill
   ```

2. **Restore database backup**
   ```bash
   pg_restore -d rwandabill_db backup.dump
   ```

3. **Deploy previous version**
   ```bash
   cp rwandabill-backend-1.0.0.jar /opt/rwandabill/
   systemctl start rwandabill
   ```

4. **Verify**
   ```bash
   curl http://localhost:8080/api/auth/health
   ```

---

## Support & Documentation

- README.md - Project overview
- SETUP.md - Local setup
- API_DOCUMENTATION.md - API reference
- TESTING_GUIDE.md - Testing procedures
