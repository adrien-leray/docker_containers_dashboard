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
  let status = ""
  if (req.query.status) {
    status = req.query.status;
  }
  docker.listContainers({ all: true }).then(containers => {
    res.render("containers", { containers: containers, status: status });
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
  let logs = "no logs... try to reload page";
  if (req.params.id !== undefined) {
    let container = docker.getContainer(req.params.id);

    var logOpts = {
          stdout: 1,
          stderr: 1,
          tail:100,
          follow:0
    };
    container.logs(logOpts, (err, stream) => {
      console.log(stream);
      // stream.setEncoding('utf8');
      logs = stream;
    })

    container.inspect((err, data) => {

      // console.log(data);

      if (data.Config.Env === null)
        data.Config.Env = []

      if (data.HostConfig.Binds === null)
        data.HostConfig.Binds = []

      let concatPorts = [];
      if (data.HostConfig.PortBindings) {
        let ports = data.HostConfig.PortBindings;
        
        let iterator = Object.keys(ports); 
    
        for (let key of iterator) {
          concatPorts.push(key + " : " + ports[key][0].HostPort);
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
        ports: concatPorts,
        id: req.params.id,
        logs: logs
      });
    });
  }
};

/**
 * Stop container by id
 */
exports.stop_container_by_id = function(req, res) {
  if (req.params.id !== undefined) {
    let container = docker.getContainer(req.params.id);

    container.stop()
      .then(()=> {
        res.redirect('/containers?status=stop');
      });
  }
};

/**
 * Remove container by id
 */
exports.remove_container_by_id = function(req, res) {
  if (req.params.id !== undefined) {
    let container = docker.getContainer(req.params.id);

    container.remove()
    .then(()=> {
      res.redirect('/containers?status=remove');
    });  
  }
};

exports.add_container = (req, res) => {
  let params = req.body;

  // console.log("params =>", req.body);

  let options = {};
  options.HostConfig = {};
  options.HostConfig.Mounts = [];
  options.HostConfig.PortBindings = {};
  options.HostConfig.Binds = [];
  let onImage = false;

  if (req.body.name) {
    options.name = req.body.name; 
  }

  if (req.body.Image) {
    options.Image = req.body.Image;
    onImage = true;
  }

  if (req.body.Memory) {
    if (parseInt(req.body.Memory) > 4) {
      options.HostConfig.Memory = parseInt(req.body.Memory) * Math.pow(10, 6);
    }
  }

  if (req.body.CpuPeriod) {
    options.HostConfig.CpuPeriod = parseInt(req.body.CpuPeriod) * Math.pow(10, 3);
  }

  if (req.body.CpuQuota) {
    options.HostConfig.CpuQuota = parseInt(req.body.CpuQuota) * Math.pow(10, 3);
  }

  if (req.body.Volume) {
    let volumes = req.body.Volume.split(';');
    options.HostConfig.Binds = volumes;
  }

  if (req.body.PortBindings) {
    let splitedPorts = req.body.PortBindings.split(";");
    splitedPorts.forEach(splitedport => {
      let ports = splitedport.split(":");
      options.HostConfig.PortBindings[ports[0]] = [];
      let host = {};
      host["HostPort"] = ports[1];
      options.HostConfig.PortBindings[ports[0]].push(host);
    });
  }

  if (req.body.Env) {
    let envs = req.body.Env.split(";");
    options.Env = envs;
  }

  // console.log("options =>", options);

  if (onImage) {
    docker.createContainer(options)
    .then(container => {
      container.start()
        .then(() => {
          res.redirect('/containers?status=success');
        })
        .catch(() => {
          res.redirect('/containers?status=noRun');
        });
    })
    .catch(error => {
      console.log(error);
      res.redirect('/containers?status=error',);
    });
  } else {
    res.redirect('/containers?status=noImage',);
  }
};

exports.container_form = function(req, res) {
  res.render("container-form", {});
};

/**
 * ---------------------------------------- API ----------------------------------------
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
