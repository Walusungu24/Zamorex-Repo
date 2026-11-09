FROM node:18-slim

WORKDIR /app

# 1. Copy only package files first
COPY package*.json ./

# 2. Install dependencies (this creates the correct Linux binaries)
RUN npm install --omit=dev

# 3. Copy the rest of your code (your .dockerignore prevents node_modules from being copied)
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]