"use strict";

let Docker = require("dockerode");

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
    res.json(containers);
  });
};

exports.list_all_images = function(req, res) {
  docker.listImages().then(images => {
    res.json(images);
  });
};

exports.create_container = function(req, res) {
  let options = req.body;
  docker.createContainer(options).then(container => {
    res.json(container);
  });
};
