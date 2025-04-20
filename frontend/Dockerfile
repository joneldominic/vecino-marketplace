# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json files
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY shared/package*.json ./shared/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build shared package
RUN npm run --workspace=shared build

# Build frontend
RUN npm run --workspace=frontend build

# Production stage
FROM nginx:alpine

# Copy built assets from the build stage
COPY --from=build /app/frontend/dist /usr/share/nginx/html

# Copy nginx config
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 