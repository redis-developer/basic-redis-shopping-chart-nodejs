FROM node:lts-alpine as vue-build
WORKDIR /app
COPY ./client/package.json ./
RUN npm install
COPY ./client/ .
RUN npm run build

FROM node:lts-alpine AS server-build
WORKDIR /app
COPY ./server/package.json ./
RUN npm install
COPY ./server .
COPY --from=vue-build /app/dist ./dist
EXPOSE 3000
CMD ["node", "./src/index.js"]
