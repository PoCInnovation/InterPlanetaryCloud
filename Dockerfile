FROM node:16 AS builder

# Create app directory
WORKDIR /app

# Copy dependencies files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn

# Copy source (see .dockerignore)
COPY . .

# Build
RUN yarn build


FROM node:16.19.0-alpine3.17 AS runner

WORKDIR /app

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/.next/standalone ./standalone
COPY --from=builder /app/public ./standalone/public
COPY --from=builder /app/.next/static ./standalone/.next/static

CMD ["node", "./standalone/server.js"]
