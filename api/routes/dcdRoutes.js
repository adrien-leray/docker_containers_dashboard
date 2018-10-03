"use strict";

module.exports = function(app) {
  var dcd = require("../controllers/dcdController");

  // Applicative routes
  app
    .route("/containers")
    .get(dcd.list_all_containers)
    .post(dcd.create_container);
  app.route("/containers/:id").get(dcd.list_container_by_id);

  // REST API
  app.route("/api/images").get(dcd.list_all_images);
  app.route("/api/containers").get(dcd.list_all_containers_json);
  app.route("/api/containers/:id").get(dcd.list_container_by_id_json);
};
