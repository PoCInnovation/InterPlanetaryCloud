FROM node:16-alpine

WORKDIR /app

# Install dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn --frozen-lockfile;

# Copy source (see .dockerignore)
COPY . .

# Add env variables
ENV NEXT_PUBLIC_ALEPH_CHANNEL=TEST
ENV NEXTAUTH_URL="http://localhost:8080"
ENV NEXTAUTH_SECRET = $(openssl rand -base64 32)
ENV NEXT_PUBLIC_GITCLONE_DIR="repositories"
ENV NEXT_PUBLIC_GITHUB_CLIENT_ID="your OAuth client id"
ENV NEXT_PUBLIC_GITHUB_CLIENT_SECRET="your OAuth client secret"

RUN yarn build

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
RUN mv next.config.js .next/standalone/
RUN mv public .next/standalone/
RUN mv .next/static .next/standalone/.next/

WORKDIR /app/.next/standalone

EXPOSE 8080

ENV PORT 8080

CMD ["node", "server.js"]
