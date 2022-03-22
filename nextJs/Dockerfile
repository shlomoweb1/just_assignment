FROM node:16-slim

ENV PORT 3000

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Installing dependencies
COPY /src/package*.json /usr/src/app/
RUN npm install

# Copying source files
COPY /src/ /usr/src/app

EXPOSE 3000

# Running the app
CMD "npm" "run" "dev"