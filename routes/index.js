const express = require("express");
const indexRouter = express.Router();

indexRouter.get("/", (req, res, next) => {
  res.send("Hello World!");
});

module.exports = indexRouter;
