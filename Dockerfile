FROM node:10.14.0-alpine

ENV DB_HOST=db

COPY . .

RUN npm install
