# Install dependencies only when needed
FROM node:16-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn --frozen-lockfile;


# Rebuild the source code only when needed
FROM node:16-alpine AS builder

WORKDIR /app

# Copy source (see .dockerignore)
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Add env variables
ENV NEXT_PUBLIC_ALEPH_CHANNEL=TEST
ENV NEXTAUTH_URL="http://localhost:8080"
ENV NEXTAUTH_SECRET = $(openssl rand -base64 32)
ENV NEXT_PUBLIC_GITCLONE_DIR="repositories"
ENV NEXT_PUBLIC_GITHUB_CLIENT_ID="your OAuth client id"
ENV NEXT_PUBLIC_GITHUB_CLIENT_SECRET="your OAuth client secret"

RUN yarn build


# Production image, copy all the files and run next
FROM node:16-alpine AS runner

WORKDIR /app

# Add env variables
ENV NODE_ENV=production
ENV NEXTAUTH_URL="http://localhost:8080"
ENV NEXTAUTH_SECRET = $(openssl rand -base64 32)
ENV NEXT_PUBLIC_GITCLONE_DIR="repositories"
ENV NEXT_PUBLIC_GITHUB_CLIENT_ID="your OAuth client id"
ENV NEXT_PUBLIC_GITHUB_CLIENT_SECRET="your OAuth client secret"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8080

ENV PORT 8080

CMD ["node", "server.js"]
