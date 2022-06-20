const express = require("express");
const envelopeRouter = express.Router();

const envelopes = require("../data/envelopeDb");

////routes
//get
envelopeRouter.get("/", (req, res, next) => {
  console.log(envelopes);
  res.send({ envelopes });
});

module.exports = envelopeRouter;
