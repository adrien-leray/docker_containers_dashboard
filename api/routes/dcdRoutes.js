"use strict";

module.exports = function(app) {
  var dcd = require("../controllers/dcdController");

  // Applicative routes
  app
    .route("/containers")
    .get(dcd.list_all_containers)
    .post(dcd.create_container);

  // REST API

  app.route("/api/images").get(dcd.list_all_images);

  app.route("/api/containers").get(dcd.list_all_containers_json);
};
