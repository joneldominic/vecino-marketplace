# Docker Setup for Vecino Marketplace

This document provides instructions for running the Vecino Marketplace application using Docker.

## Prerequisites

- Docker and Docker Compose installed on your machine
- Git repository cloned locally

## Docker Configuration Files

The project includes the following Docker-related files:

- `.dockerignore` - Specifies files to exclude from Docker builds
- `frontend/Dockerfile.dev` - Development Dockerfile for the frontend
- `frontend/Dockerfile` - Production Dockerfile for the frontend
- `backend/Dockerfile.dev` - Development Dockerfile for the backend
- `backend/Dockerfile` - Production Dockerfile for the backend
- `docker-compose.dev.yml` - Docker Compose file for development environment
- `docker-compose.prod.yml` - Docker Compose file for production environment
- `frontend/nginx.conf` - Nginx configuration for production frontend

## Development Environment

To run the application in development mode:

```bash
# Start all services (frontend, backend, MongoDB, Redis)
npm run docker:dev

# Start all services and rebuild containers
npm run docker:dev:build

# Stop and remove all containers
npm run docker:dev:down

# Run only the database services (MongoDB and Redis)
npm run docker:db
```

In development mode:

- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- MongoDB: localhost:27017
- Redis: localhost:6379

## Production Environment

To run the application in production mode:

```bash
# Start all services in production mode
npm run docker:prod

# Start all services and rebuild containers
npm run docker:prod:build

# Stop and remove all containers
npm run docker:prod:down
```

In production mode:

- Frontend: http://localhost (port 80)
- Backend: Only accessible via internal Docker network
- MongoDB: Not exposed to host
- Redis: Not exposed to host

## Testing the Docker Setup

To verify that the Docker setup is working correctly:

1. Start the development environment:

   ```bash
   npm run docker:dev:build
   ```

2. Once all containers are running, open your browser to http://localhost:3000

3. You should see the test component which demonstrates:

   - Zustand store functionality (dark mode toggle)
   - Authentication state management
   - Backend API communication (test endpoint)

4. Check backend health status:

   ```bash
   curl http://localhost:4000/health
   ```

   This should return a JSON response with the status of MongoDB and Redis services.

5. Test the API endpoint directly:
   ```bash
   curl http://localhost:4000/test
   ```
   This should return a JSON response with a message and timestamp.

## Container Structure

- **Frontend**: React application served by Nginx in production
- **Backend**: NestJS application
- **MongoDB**: Database for storing application data
- **Redis**: Caching service

## Volume Management

The following volumes are created for data persistence:

- `mongodb_data`: MongoDB data files
- `redis_data`: Redis data files

## Networks

All services are connected to the `vecino-network` Docker network, allowing internal communication.
