# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port (Cloud Run will set PORT env var)
EXPOSE 8080

# Start the application - Cloud Run sets PORT env var to 8080
CMD ["sh", "-c", "npm run preview -- --port $PORT --host 0.0.0.0"]
