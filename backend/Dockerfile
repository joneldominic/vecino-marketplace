# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY shared/package*.json ./shared/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build shared package
RUN npm run --workspace=shared build

# Build backend
RUN npm run --workspace=backend build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install curl for health checks
RUN apk --no-cache add curl

# Copy package.json files (for production dependencies)
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY shared/package*.json ./shared/

# Install production dependencies only
RUN npm install --omit=dev

# Copy built files from build stage
COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/shared/dist ./shared/dist

# Set environment to production
ENV NODE_ENV=production

# Expose port
EXPOSE 4000

# Set working directory to backend
WORKDIR /app/backend

# Start production server
CMD ["node", "dist/main.js"] 