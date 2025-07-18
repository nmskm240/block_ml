FROM node:22-slim

WORKDIR /workspace
COPY app/package*.json ./

RUN npm install
