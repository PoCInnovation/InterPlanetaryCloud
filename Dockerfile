# Set the base image
FROM node:16.5-alpine

# Retrieve sources
WORKDIR /app
COPY . /app

# Install dependencies
RUN npm install

# Add env variable
ENV REACT_APP_ALEPH_CHANNEL=TEST

# Expose PORT
EXPOSE 3000

# Declare entrypoint
ENTRYPOINT ["npm"]
CMD ["start"]