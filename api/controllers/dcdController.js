"use strict";

const Docker = require("dockerode");
const stream = require("stream");

/**
 * Docker instance
 */
let docker = new Docker();

/**
 * Get all containers method
 * @param {*} req
 * @param {*} res
 */
exports.list_all_containers = function(req, res) {
  docker.listContainers({ all: true }).then(containers => {
    res.render("containers", { containers: containers });
  });
};

/**
 * Get all images method
 * @param {*} req
 * @param {*} res
 */
exports.list_all_images = function(req, res) {
  docker.listImages().then(images => {
    let allSizes = [];
    images.forEach(image => allSizes.push(image.Size));

    let totalSize = allSizes.reduce((accumulator, image) => {
      return accumulator + image;
    });

    totalSize = (totalSize * (1 * Math.pow(10, -9))).toFixed(2);
    res.render("images", { images: images, totalSize: totalSize });
  });
};

/**
 * Get container by id
 */
exports.list_container_by_id = function(req, res) {
  if (req.params.id !== undefined) {
    let container = docker.getContainer(req.params.id);

    container.inspect((err, data) => {
      let ports = data.NetworkSettings.Ports;
      let concatPorts = [];

      for (var property in ports) {
        if (ports.hasOwnProperty(property)) {
          let key = property;
          let value = "";
          if (ports[property] === null) {
            value = "ø";
          } else {
            value = ports[property];
          }
          concatPorts.push(key + " : " + value);
        }
      }

      res.render("container", {
        container: data,
        createdOn: new Date(data.Created).toDateString(),
        createdTime: new Date(data.Created).toLocaleTimeString(),
        startedOn: new Date(data.State.StartedAt).toDateString(),
        startedTime: new Date(data.State.StartedAt).toLocaleTimeString(),
        finishedOn: new Date(data.State.FinishedAt).toDateString(),
        finishedTime: new Date(data.State.FinishedAt).toLocaleTimeString(),
        ports: concatPorts
      });
    });
  }
};

exports.add_container = (req, res) => {
  let options = req.body;

  console.log(req.body);

  docker.createContainer(options).then(container => {
    console.log("new container created !", container);
  });
};

exports.container_form = function(req, res) {
  res.render("container-form", {});
};

exports.sendLogs = function(socket, io) {
  let splitedPath = socket.handshake.headers.referer.split("/");
  const containerID = splitedPath[4];

  console.log("ID=" + containerID);

  if (containerID !== undefined) {
    let container = docker.getContainer(splitedPath[4]);

    let logStream = new stream.PassThrough();
    logStream.on("data", function(chunk) {
      io.emit("logs", chunk.toString("utf8"));
    });

    container.logs(
      {
        follow: true,
        stdout: true,
        stderr: true
      },
      function(err, stream) {
        if (err) {
          return logger.error(err.message);
        }
        container.modem.demuxStream(stream, logStream, logStream);
        stream.on("end", function() {
          logStream.end("!stop!");
        });

        setTimeout(function() {
          stream.destroy();
        }, 2000);
      }
    );
  }
};

/**
 * API
 */

/**
 * Get container by id return json
 */
exports.list_container_by_id_json = function(req, res) {
  let container = docker.getContainer(req.params.id);

  container.inspect((err, data) => {
    res.json(data);
  });
};

/**
 * Get all json containers method
 * @param {*} req
 * @param {*} res
 */
exports.list_all_containers_json = function(req, res) {
  docker.listContainers({ all: true }).then(containers => {
    res.json(containers);
  });
};

/**
 * Get all images method
 */
exports.list_all_images_json = function(req, res) {
  docker.listImages().then(images => {
    res.json(images);
  });
};

/**
 * Create container
 */
exports.create_container_json = function(req, res) {
  let options = req.body;
  docker.createContainer(options).then(container => {
    res.json(container);
  });
};

exports.get_container_logs = function(req, res) {
  let container = docker.getContainer(req.params.id);

  container.logs((err, data) => {
    res.json(data);
  });
};
