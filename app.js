var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cassandra = require("cassandra-driver");
const fs = require("fs");

// Routes
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var connectRoute = require("./routes/connect_routes");

// cassandra start
const config = { username: "cassandra", password: "cassandra", contactPoint: "cassandra.us-west-2.amazonaws.com", localDataCenter: "us-west-2", keyspace: "", port: 9042 };
let authProvider = new cassandra.auth.PlainTextAuthProvider(config.username, config.password);

let client = new cassandra.Client({
  contactPoints: [`${config.contactPoint}:${config.port}`],
  authProvider: authProvider,
  localDataCenter: config.localDataCenter,
  // keyspace:config.keyspace,
  sslOptions: {
    // ca: [fs.readFileSync("path_to_filecassandra/sf-class2-root.crt", "utf-8")],
    host: "cassandra.us-west-2.amazonaws.com",
    rejectUnauthorized: true,
  },
});
client.connect().then(function () {
  console.log("Connected to cluster with %d host(s): %j", client.hosts.length, client.hosts.keys());
  client.hosts.forEach(function (host) {
    console.log(host.address, host.datacenter, host.rack, host.isUp(), host.canBeConsideredAsUp());
  });
});

// cassandra end

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/connect", connectRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
