FROM node:18-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build-prod

FROM nginx:alpine as serve

COPY --from=build /app/dist/ZenSaper /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
