FROM node:18-slim

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose the port the app runs on
EXPOSE 4000

# Start the application
CMD ["npm", "start"] 