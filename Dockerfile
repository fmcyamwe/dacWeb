
#########
# oldie build stage (changed as using docker-compose)
FROM node:lts-alpine AS develop-stage
WORKDIR /app
COPY package*.json ./
 # shouldnt copy the lock file as creates conflicts...but oh well...
#COPY package.json ./
RUN npm install 
RUN npm install -g @quasar/cli
COPY . .


#umm should NOT copy node_modules methink? tosee

## FROM develop-stage as build-stage
#RUN npm run build
## YEEE builds with quasar build
FROM develop-stage AS build-stage
RUN quasar build

# production stage
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist/spa /usr/share/nginx/html
EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]