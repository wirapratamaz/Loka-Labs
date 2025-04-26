FROM oven/bun:1.2 as base

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the application
RUN bun run build

# Production image
FROM oven/bun:1.2-slim

WORKDIR /app

# Copy built artifacts and node_modules from base image
COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY package.json ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000

# Expose the port
EXPOSE 4000

# Set the command to run
CMD ["bun", "start"] 