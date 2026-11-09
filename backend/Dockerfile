FROM node:18-slim

WORKDIR /app

# Install build tools for native modules (bcrypt)
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]