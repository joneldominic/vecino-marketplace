# Vecino Marketplace

A local marketplace platform built with React, Vite, NestJS, MongoDB, and Redis.

## Project Structure

This is a monorepo containing:

- `frontend/`: React + Vite + Zustand + TanStack Query frontend
- `backend/`: NestJS + MongoDB + Redis backend
- `shared/`: Shared types and utilities using Zod

## Prerequisites

- Node.js 18+
- MongoDB
- Redis
- Docker & Docker Compose (optional)

## Getting Started

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd vecino-marketplace
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   # Then edit .env with your configuration
   ```

4. Start the development services (MongoDB and Redis):

   ```bash
   docker-compose up -d mongodb redis
   ```

5. Start the backend:

   ```bash
   npm run start:backend
   ```

6. In a new terminal, start the frontend:

   ```bash
   npm run start:frontend
   ```

7. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000/api
   - API Documentation: http://localhost:4000/api/docs

## Development Workflow

This project uses Task Master for managing development tasks:

- View available tasks: `npm run list`
- Find the next task to work on: `task-master next`
- Mark a task as completed: `task-master set-status --id=<task-id> --status=done`

## Running Tests

```bash
npm test
```

## Building for Production

```bash
npm run build:frontend
npm run build:backend
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
