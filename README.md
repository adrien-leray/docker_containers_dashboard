DCDJS - Docker Container Dashboard with Javascript

Kitematic like app running into container

The app show images/containers from host machine

# BUILD IMAGE
`docker build -t dcdjs .`

# GET STARTED
## From windows current directory $(pwd) write wrong format, use ${pwd} OR entire path instead
Using powershell:
`docker run -d --name dcd -p 3000:3000 -v //e/Documents/workspace/workspace_docker/docker_containers_dashboard:/app -v /var/run/docker.sock:/var/run/docker.sock dcdjs`
or
`docker run -d --name dcd -p 3000:3000 -v ${pwd}:/app -v /var/run/docker.sock:/var/run/docker.sock dcdjs`

## MacOS (not tested)
`docker run -d --name dcd -p 3000:3000 -v $(pwd):/app -v /var/run/docker.sock:/var/run/docker.sock dcdjs`