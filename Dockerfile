# Use Node.js 14 Alpine as the base image for a smaller footprint
FROM node:14-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Set NODE_ENV to production
ENV NODE_ENV=production

# Expose port 3000
EXPOSE 3000

# Set the command to start the application
CMD ["npm", "start"]