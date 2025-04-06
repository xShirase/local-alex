FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with clean npm cache
RUN npm cache clean --force && \
    npm install

# Explicitly install uuid (just to be safe)
RUN npm install uuid@9.0.0

# Copy source code
COPY . .

# Expose API port
EXPOSE 3000

# Start the application
CMD ["node", "index.js"] 