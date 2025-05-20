# Build Stage
FROM node:20.11.1-alpine as build

WORKDIR /app
COPY . .
RUN npm install && npm run build -- --configuration production

# Production Stage
FROM nginx:alpine
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/<nombre-de-tu-app>/ /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
