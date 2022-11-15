const express = require("express");
const connectRoute = express.Router();

//get

connectRoute.route("/").get((req, res) => {
  res.send("Hello World ! ...");
});

 module.exports=connectRoute;
