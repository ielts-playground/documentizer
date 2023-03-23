FROM node:18.14.2-alpine

WORKDIR /ielts-playground/documentizer
COPY package*.json ./
RUN npm ci --only=production
COPY src ./
RUN mkdir data

ENTRYPOINT [ "npm", "start" ]