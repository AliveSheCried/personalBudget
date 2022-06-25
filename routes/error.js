const express = require("express");
const errorRouter = express.Router();

errorRouter.get("/", (req, res, next) => {
  res.send("custom error handling page");
});

module.exports = errorRouter;
