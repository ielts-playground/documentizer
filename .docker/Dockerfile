FROM node:18.14.2-alpine

RUN apt-get update && apt-get install -y \
    haskell-platform \
    pandoc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /ielts-playground/documentizer
COPY package*.json ./
RUN npm ci --only=production
COPY src ./
RUN mkdir data

ENTRYPOINT [ "npm", "start" ]