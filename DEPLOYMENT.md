# Tital Power Fitness - Deployment Guide

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- Ports 3000, 5000, and 5432 available

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TitanPowerFitness
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Build and start all services**
   ```bash
   docker-compose up -d
   ```

4. **Check service health**
   ```bash
   docker-compose ps
   ```

5. **View logs**
   ```bash
   docker-compose logs -f
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health check: http://localhost:5000/health

### Stopping Services

```bash
docker-compose down
```

To remove volumes (database data):
```bash
docker-compose down -v
```

## Production Deployment

### Environment Variables

Update `.env` with production values:

```env
# Strong database password
DB_PASSWORD=<strong-password>

# Secure JWT secret (use: openssl rand -base64 32)
JWT_SECRET=<secure-random-string>

# Production API URL
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api

# Real API credentials (when available)
ACUITY_USER_ID=<your-acuity-user-id>
ACUITY_API_KEY=<your-acuity-api-key>
SQUARE_ACCESS_TOKEN=<your-square-token>
SQUARE_LOCATION_ID=<your-square-location>
SQUARE_ENVIRONMENT=production
```

### SSL/HTTPS Setup

For production, add an nginx reverse proxy:

```yaml
# Add to docker-compose.yml
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
```

### Database Backups

```bash
# Backup
docker exec titanpower-db pg_dump -U postgres titan_power_fitness > backup.sql

# Restore
docker exec -i titanpower-db psql -U postgres titan_power_fitness < backup.sql
```

## Cloud Deployment Options

### AWS (Elastic Beanstalk / ECS)
1. Push Docker images to ECR
2. Deploy using ECS or Elastic Beanstalk
3. Use RDS for PostgreSQL
4. Configure environment variables in AWS Console

### Google Cloud (Cloud Run)
1. Build and push to Google Container Registry
2. Deploy to Cloud Run
3. Use Cloud SQL for PostgreSQL
4. Set environment variables in Cloud Run

### DigitalOcean (App Platform)
1. Connect GitHub repository
2. Configure build settings
3. Use Managed PostgreSQL
4. Set environment variables in dashboard

### Vercel (Frontend) + Railway (Backend)
- **Frontend**: Deploy to Vercel (automatic Next.js detection)
- **Backend**: Deploy to Railway with PostgreSQL addon
- Update `NEXT_PUBLIC_API_URL` to Railway backend URL

## Monitoring

### Health Checks
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000/health`
- Database: `docker exec titanpower-db pg_isready`

### Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

## Scaling

### Horizontal Scaling
```yaml
# In docker-compose.yml
  backend:
    deploy:
      replicas: 3
```

### Load Balancer
Add nginx or use cloud provider's load balancer to distribute traffic across backend replicas.

## Troubleshooting

### Database Connection Issues
```bash
# Check if database is ready
docker exec titanpower-db pg_isready -U postgres

# View database logs
docker-compose logs postgres
```

### Backend Not Starting
```bash
# Check backend logs
docker-compose logs backend

# Verify environment variables
docker exec titanpower-backend env
```

### Frontend Build Errors
```bash
# Rebuild frontend
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

## Security Checklist

- [ ] Change default database password
- [ ] Generate secure JWT secret
- [ ] Enable HTTPS/SSL in production
- [ ] Set up firewall rules
- [ ] Regular database backups
- [ ] Update dependencies regularly
- [ ] Monitor application logs
- [ ] Use secrets management (AWS Secrets Manager, etc.)
