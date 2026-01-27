FROM node:24-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci || npm i

COPY . .

RUN npm run build-prod

FROM nginx:alpine as serve

RUN rm -rf /usr/share/nginx/html/*

COPY config/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/ZenSaper/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
