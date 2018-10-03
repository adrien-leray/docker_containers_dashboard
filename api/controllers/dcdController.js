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
    res.render("containers", { containers: containers });
  });
};

/**
 * Get container by id
 */
exports.list_container_by_id = function(req, res) {
  let container = docker.getContainer(req.params.id);

  container.inspect((err, data) => {
    res.render("container", {
      container: data,
      createdOn: new Date(data.Created).toDateString(),
      createdTime: new Date(data.Created).toLocaleTimeString(),
      startedOn: new Date(data.State.StartedAt).toDateString(),
      startedTime: new Date(data.State.StartedAt).toLocaleTimeString(),
      finishedOn: new Date(data.State.FinishedAt).toDateString(),
      finishedTime: new Date(data.State.FinishedAt).toLocaleTimeString()
    });
  });
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
exports.list_all_images = function(req, res) {
  docker.listImages().then(images => {
    res.json(images);
  });
};

/**
 * Create container
 */
exports.create_container = function(req, res) {
  let options = req.body;
  docker.createContainer(options).then(container => {
    res.json(container);
  });
};
