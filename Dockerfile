FROM node:10.14.0-alpine

COPY . .

RUN npm install
