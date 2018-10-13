var express = require("express"),
  app = express(),
  bodyParser = require("body-parser");

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

const http = require("http").Server(app);

const dcd = require("./api/controllers/dcdController");

let routes = require("./api/routes/dcdRoutes");
routes(app);

app.set("view engine", "pug");
app.set("views", "./views");

http.listen(3000, () =>
  console.log("✨  Server started at http://localhost:3000")
);
