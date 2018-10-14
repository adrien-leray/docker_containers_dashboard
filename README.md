DCDJS - Docker Container Dashboard with Javascript

Kitematic like app running into container.
The app show images/containers from host machine

# RUN Dashboard locally
__required:__
- node & npm
- nodemon
__run:__
- `npm install`
- `nodemon server.js`

# GET STARTED

## BUILD IMAGE
`docker build -t dcdjs .`

## From windows current directory $(pwd) write wrong format, use ${pwd} OR entire path instead
Using powershell:
`docker run -d --name dcd -p 3000:3000 -v <your-path>:/app -v /var/run/docker.sock:/var/run/docker.sock dcdjs`
OR current directory
`docker run -d --name dcd -p 3000:3000 -v ${pwd}:/app -v /var/run/docker.sock:/var/run/docker.sock dcdjs`

## MacOS (not tested)
`docker run -d --name dcd -p 3000:3000 -v $(pwd):/app -v /var/run/docker.sock:/var/run/docker.sock dcdjs`