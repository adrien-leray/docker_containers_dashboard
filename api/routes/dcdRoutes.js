"use strict";

module.exports = function(app) {
  var dcd = require("../controllers/dcdController");

  // Applicative routes
  app
    .route("/")
    .get((req, res) => {
      res.redirect('/containers');
    });

  app
    .route("/containers")
    .get(dcd.list_all_containers)
    .post(dcd.create_container_json);
  app
    .route("/containers/new")
    .get(dcd.container_form)
    .post(dcd.add_container);

  app.route("/containers/:id").get(dcd.list_container_by_id);
  app.route("/containers/:id/stop").post(dcd.stop_container_by_id);
  app.route("/containers/:id/remove").post(dcd.remove_container_by_id);
  app.route("/images").get(dcd.list_all_images);

  // REST API
  app.route("/api/images").get(dcd.list_all_images_json);
  app.route("/api/containers").get(dcd.list_all_containers_json);
  app.route("/api/containers/:id").get(dcd.list_container_by_id_json);
};
