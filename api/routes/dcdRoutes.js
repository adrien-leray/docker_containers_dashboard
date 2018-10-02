"use strict";

module.exports = function(app) {
  var dcd = require("../controllers/dcdController");

  // Docker Containers Dashboard Routes
  app
    .route("/containers")
    .get(dcd.list_all_containers)
    .post(dcd.create_container);

  app.route("/images").get(dcd.list_all_images);
};
