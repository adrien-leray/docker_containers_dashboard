FROM node:latest
LABEL maintainer="Adrien Leray"

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
VOLUME /app/
VOLUME /var/run/docker.sock

CMD [ "npm", "start" ]
