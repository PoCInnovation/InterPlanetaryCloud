FROM node:16-alpine

WORKDIR /app

# Copy source (see .dockerignore)
COPY . .

# Install dependencies
RUN yarn --frozen-lockfile

RUN yarn build

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
RUN mv next.config.js .next/standalone/
RUN mv public .next/standalone/
RUN mv .next/static .next/standalone/.next/

WORKDIR /app/.next/standalone

ENV PORT 8080

CMD ["node", "server.js"]
