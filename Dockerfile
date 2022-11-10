FROM node:lts-alpine

# install simple http server for serving static content
RUN npm install -g http-server vite

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# build app for production with minification
RUN vite build

EXPOSE 8080
CMD [ "http-server", "--proxy", "http://192.168.1.52:3500", "dist" ]