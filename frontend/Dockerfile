FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install && npm rebuild lightningcss

COPY . .

EXPOSE 3000
