# Use an official Node.js image.
# node:18-alpine is a good choice for small images. node:18-slim is another option.
FROM node:18-alpine AS builder

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or npm-shrinkwrap.json)
COPY package.json package-lock.json* ./
# If you have an npm-shrinkwrap.json, copy that instead of package-lock.json

# Install all dependencies, including devDependencies needed for build
# Using npm ci is generally recommended for reproducible builds if you have a package-lock.json
RUN npm ci

# Copy the rest of the application source code
# This includes tsconfig.json, src/, config/, etc.
COPY . .

# Build the TypeScript application
# This command should compile TypeScript to JavaScript in the 'dist' directory
RUN npm run build

# --- Production Stage ---
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or npm-shrinkwrap.json)
COPY package.json package-lock.json* ./

# Install production dependencies only
# --ignore-scripts can be added if no post-install scripts are needed for production
RUN npm install --production

# Copy the built application (dist directory) and other necessary files from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
# Copy other necessary directories that are not part of the build but are needed at runtime
# For example, if 'config' files are read from the filesystem at runtime and are not bundled:
COPY --from=builder /usr/src/app/config ./config
# If you have other assets or templates, copy them as well e.g.
# COPY --from=builder /usr/src/app/public ./public

# Application port (should match the one in your app and docker-compose.yml)
# Make this configurable via an ENV variable if it can change
ENV PORT=3000
EXPOSE ${PORT}

# Define the command to run the application
# This will run the 'start' script defined in package.json, e.g., "node dist/app.js"
CMD ["npm", "start"]
