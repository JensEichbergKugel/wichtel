# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable

# Copy dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build Next.js app
RUN pnpm build

# Stage 2: Production image
FROM node:24-alpine AS runner

WORKDIR /app

# Install pnpm
RUN corepack enable

# Copy only necessary files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Optional: Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["pnpm", "start"]
