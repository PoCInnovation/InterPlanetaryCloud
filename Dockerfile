###
# Builder image
###
FROM node:16.5-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json .
COPY yarn.lock .

# Install dependencies
RUN yarn install

# Copy source (see .dockerignore)
COPY . .

# Add env variable
ENV NEXT_PUBLIC_ALEPH_CHANNEL=TEST

# Build source
RUN yarn run build

###
# Production image
###
FROM nginx:1.21.6-alpine as app

WORKDIR /app

# Copy code
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose PORT
EXPOSE 80

# Prefix commands and start production
ENTRYPOINT ["nginx", "-g", "daemon off;"]
