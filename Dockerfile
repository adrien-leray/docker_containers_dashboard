FROM ubuntu:latest
LABEL maintainer="Adrien Leray"

RUN apt update
RUN apt install sudo
RUN apt install -my wget gnupg
RUN yes | sudo apt install curl
RUN curl -sL https://deb.nodesource.com/setup_8.x | sudo bash -
RUN yes | sudo apt install nodejs
RUN node -v
RUN npm -v

ADD package.json /app/

WORKDIR /app

RUN npm install

ADD . /app/

EXPOSE 3000
VOLUME /app/
VOLUME /var/run/docker.sock

CMD node server.js