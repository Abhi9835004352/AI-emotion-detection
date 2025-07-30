# backend/Dockerfile
FROM node:20.17.0

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create uploads directory for multer
RUN mkdir -p uploads

# Expose the port your backend runs on
EXPOSE 4000

# Start the application
CMD ["node", "index.js"]