# syntax=docker/dockerfile:1
FROM node
WORKDIR /code
COPY package*.json .
RUN npm i
EXPOSE 9000
COPY . .
CMD ["node", "app.js"]