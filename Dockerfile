
#########
# build stage
FROM node:lts-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install 
RUN npm install -g @quasar/cli
COPY . .

## FROM develop-stage as build-stage
#RUN npm run build
## YEEE builds with quasar build
RUN quasar build

# production stage
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist/spa /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]