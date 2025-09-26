# Build stage
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build --no-lint

# Production stage
FROM node:20-alpine

WORKDIR /app

# Копируем только необходимое для запуска
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Ставим только prod-зависимости (next включён в dependencies)
RUN npm ci --omit=dev

EXPOSE 3000
CMD ["npm", "run", "start"]
