const express = require("express");
const envelopeRouter = express.Router();

const envelopes = require("../data/envelopeDb");

////middleware
//manage get/put by envelopeId
envelopeRouter.param("id", (req, res, next, id) => {
  const envelope = envelopes.find((envelope) => envelope.id == id);
  if (envelope) {
    req.envelope = envelope;
    next();
  } else {
    res.status(404).send();
  }
});

//getIndex of envelope's id
const getIndexOfEnvelope = (req, res, next) => {
  const envelopeIndex = envelopes.findIndex(
    (envelope) => envelope.id === req.envelope.id
  );
  req.index = envelopeIndex;
  next();
};

//////routes
////get routes
envelopeRouter.get("/", (req, res, next) => {
  res.send({ envelopes });
});

envelopeRouter.get("/:id", (req, res, next) => {
  res.send(req.envelope);
});

////post - create budget envelope
envelopeRouter.post("/", (req, res, next) => {
  const envelopeId = Math.floor(Math.random() * 1000);
  const newEnvelope = {
    id: envelopeId,
    name: req.body.name,
    budget: req.body.budget,
    used: req.body.used,
  };
  envelopes.push(newEnvelope);
  res.status(200).send("Envelope successfully added");
});

////delete budget envelope
envelopeRouter.delete("/:id", (req, res, next) => {
  const envelopeIndex = envelopes.findIndex(
    (envelope) => envelope.id === req.envelope.id
  );
  envelopes.splice(envelopeIndex, 1);
  res.status(200).send("Envelope deleted");
});

////updates
//spend
envelopeRouter.put("/:id", getIndexOfEnvelope, (req, res, next) => {
  envelopes[req.index].budget = +req.query.budget;
  envelopes[req.index].used = +req.query.used;

  res.send(
    `Envelope ${envelopes[req.index].name} updated.  Budget: ${
      envelopes[req.index].budget
    } Used: ${envelopes[req.index].used}`
  );
});

//transfer
envelopeRouter.put("/transfer/:fromId/:toId", (req, res, next) => {
  //instead of middleware above, new external helper fucntion to find index
  //then check fromId has the funds to transfer
  //if true transfer
  //if false error (throw error?  create error handling mw.)
});

module.exports = envelopeRouter;
