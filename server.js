var express = require("express"),
  app = express(),
  port = process.env.PORT || 3333,
  bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let routes = require("./api/routes/dcdRoutes");
routes(app);

app.set("view engine", "pug");
app.set("views", "./views");

app.listen(port);

console.log("Docker Containers Dashboard REST API server started on: " + port);
