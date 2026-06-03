# Deployment Guide

## Overview

This guide covers deploying Explorer AI to various platforms. The application is optimized for Vercel but can also run on other platforms.

## Platform Options

1. **Vercel** (Recommended) - Serverless deployment
2. **Docker** - Containerized deployment
3. **Local Server** - Development or on-premises
4. **Cloud Providers** - AWS, Google Cloud, Azure

## Vercel Deployment (Recommended)

### Prerequisites

- Vercel account (free at vercel.com)
- Git repository (GitHub, GitLab, or Bitbucket)

### Setup Steps

1. **Connect Repository**
   - Go to vercel.com/dashboard
   - Click "Add New..." → "Project"
   - Select your Git provider
   - Choose the repository
   - Click "Import"

2. **Configure Project**
   - Framework Preset: Other
   - Root Directory: `.`
   - Build Command: (Already configured in vercel.json)
   - Install Command: (Already configured in vercel.json)
   - Output Directory: `frontend`

3. **Environment Variables**
   - Set any required environment variables in project settings
   - Available: `VERCEL` (automatically set)

4. **Deploy**
   - Click "Deploy"
   - Vercel automatically builds and deploys your application

### After Deployment

```bash
# Your application will be available at:
# https://your-project.vercel.app
```

### Monitoring

- **Dashboard**: Check deployment status and logs
- **Analytics**: Monitor function calls and edge network
- **Alerts**: Set up notifications for deployment failures

## Docker Deployment

### Build Docker Image

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 8001

# Run backend server
CMD ["python", "backend/server.py"]
```

### Build and Run

```bash
# Build image
docker build -t explorer-ai .

# Run container
docker run -p 8001:8001 explorer-ai

# Or use docker-compose
docker-compose up -d
```

### Docker Compose

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "8001:8001"
    volumes:
      - ./backend/data:/app/backend/data
      - ./backend/chat_history.json:/app/backend/chat_history.json
    environment:
      - PYTHON_UNBUFFERED=1
  nginx:
    image: nginx:latest
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - web
```

## AWS Deployment

### Option 1: AWS Lambda + API Gateway

```bash
# Install AWS CLI
pip install awscli

# Configure credentials
aws configure

# Deploy using Serverless Framework
npm install -g serverless
serverless deploy
```

### Option 2: EC2 Instance

```bash
# SSH into EC2 instance
ssh -i your-key.pem ec2-user@your-instance

# Install dependencies
sudo apt-get update
sudo apt-get install python3-pip

# Clone repository
git clone https://code.swecha.org/as248216/hackathon-project.git
cd hackathon-project

# Install Python requirements
pip install -r requirements.txt

# Run with systemd
sudo cp scripts/explorer-ai.service /etc/systemd/system/
sudo systemctl start explorer-ai
sudo systemctl enable explorer-ai
```

## Google Cloud Platform

### Cloud Run Deployment

```bash
# Install gcloud CLI
curl https://sdk.cloud.google.com | bash

# Authenticate
gcloud auth login

# Create Dockerfile (if not exists)
# See Docker section above

# Deploy to Cloud Run
gcloud run deploy explorer-ai \
  --source . \
  --platform managed \
  --region us-central1 \
  --memory 512Mi \
  --timeout 300s
```

## Microsoft Azure

### App Service Deployment

```bash
# Install Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login
az login

# Create resource group
az group create --name explorer-ai-rg --location eastus

# Create App Service Plan
az appservice plan create \
  --name explorer-ai-plan \
  --resource-group explorer-ai-rg \
  --sku B1 --is-linux

# Deploy
az webapp create \
  --resource-group explorer-ai-rg \
  --plan explorer-ai-plan \
  --name explorer-ai-app \
  --runtime "PYTHON|3.11"
```

## Local Deployment

### Development Server

```bash
# Clone repository
git clone https://code.swecha.org/as248216/hackathon-project.git
cd hackathon-project

# Install dependencies
pip install -r requirements.txt

# Run backend
python backend/server.py

# Open frontend in browser
# http://127.0.0.1:8001
```

### Production Server (Self-Hosted)

```bash
# Install Gunicorn
pip install gunicorn

# Run with Gunicorn
gunicorn --workers 4 --bind 0.0.0.0:8001 backend.server:app

# Or use Waitress
pip install waitress
waitress-serve --port=8001 backend.server:app
```

### Systemd Service

```ini
# /etc/systemd/system/explorer-ai.service
[Unit]
Description=Explorer AI Survival Assistant
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/explorer-ai
Environment="PATH=/var/www/explorer-ai/venv/bin"
ExecStart=/var/www/explorer-ai/venv/bin/python backend/server.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

## SSL/TLS Configuration

### Self-Signed Certificate (Development)

```bash
# Generate certificate
openssl req -x509 -newkey rsa:4096 -nodes \
  -out cert.pem -keyout key.pem -days 365

# Use with Python
# See backend/server.py for HTTPS setup
```

### Let's Encrypt (Production)

```bash
# Install Certbot
sudo apt-get install certbot

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com

# Renew automatically
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

## Backup and Recovery

### Database Backup

```bash
# Backup chat history
cp backend/chat_history.json backup/chat_history.json

# Backup Q&A database
cp backend/data/survival_qa.json backup/survival_qa.json
```

### Automated Backup Script

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups/explorer-ai"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup data files
cp backend/chat_history.json $BACKUP_DIR/chat_history_$TIMESTAMP.json
cp backend/data/survival_qa.json $BACKUP_DIR/survival_qa_$TIMESTAMP.json

# Compress backup
tar -czf $BACKUP_DIR/backup_$TIMESTAMP.tar.gz -C $BACKUP_DIR *.json

# Keep only last 30 days
find $BACKUP_DIR -name "*.json" -mtime +30 -delete

echo "Backup completed: $TIMESTAMP"
```

## Monitoring and Logging

### Application Logs

```python
# Enable logging
from backend.utils import Logger

logger = Logger()
logger.info("Application started")
```

### Log Aggregation

- **ELK Stack**: Elasticsearch, Logstash, Kibana
- **Datadog**: Cloud-based monitoring
- **New Relic**: Application performance monitoring
- **Splunk**: Enterprise logging platform

### Health Checks

```bash
# Check if application is running
curl http://localhost:8001/api/chat -X POST \
  -H "Content-Type: application/json" \
  -d '{"message": "test"}'
```

## Performance Optimization

### Caching

```python
# Cache responses
import functools
import time

@functools.lru_cache(maxsize=128)
def expensive_operation(key):
    # Expensive operation
    return result
```

### Database Optimization

```python
# Load Q&A data once on startup
QA_DATA = load_json(DATA_FILE, [])

# Create indexes
qa_index = {entry['id']: entry for entry in QA_DATA}
```

### Frontend Optimization

- **Minify CSS/JS**: Use minified versions in production
- **Gzip Compression**: Enable in web server
- **CDN**: Serve static files from CDN
- **Lazy Loading**: Load resources on demand

## Scaling

### Horizontal Scaling

- **Load Balancer**: Distribute traffic across multiple servers
- **Database Replication**: Multiple database instances
- **Session Store**: Shared session storage (Redis)

### Vertical Scaling

- **Increase Resources**: More CPU, memory for single server
- **Optimize Code**: Improve algorithm efficiency
- **Cache Strategy**: Reduce database hits

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Port already in use | Change port in config or kill process |
| Module not found | Run `pip install -r requirements.txt` |
| Permission denied | Check file permissions and user privileges |
| Connection refused | Check firewall and routing rules |

### Debug Mode

```python
# Enable debug logging
import logging
logging.basicConfig(level=logging.DEBUG)
```

## Rollback Plan

### Version Control

```bash
# Revert to previous deployment
git checkout <commit-hash>
git push

# Or tag releases
git tag -a v2.0.0 -m "Release version 2.0.0"
git push origin v2.0.0
```

### Database Rollback

```bash
# Restore from backup
cp backup/chat_history_TIMESTAMP.json backend/chat_history.json
```

## Support

For deployment issues:
- Email: `support@explorer-ai.com`
- Documentation: https://explorer-ai.com/docs
- GitHub Issues: Report problems and get help

---

Last Updated: June 2026
