const express = require("express");
const envelopeRouter = express.Router();

///import static data
const envelopes = require("../data/envelopeDb");
///import utility and middleware functions
const {
  getIndex,
  getIndexOfEnvelope,
  requireQuery,
} = require("../utils/utils");

////////middleware functions------------------------------------------------------------------------------------
/////manage get/put by envelopeId
envelopeRouter.param("id", (req, res, next, id) => {
  const envelope = envelopes.find((envelope) => envelope.id == id);
  if (envelope) {
    req.envelope = envelope;
    next();
  } else {
    res.status(404).send(`Envelope with id:${id} does not exist`);
  }
});

//////routes----------------------------------------------------------------------------------------------------
////get routes
envelopeRouter.get("/", (req, res, next) => {
  if (envelopes.length === 0) {
    res.send("There are no budget envelopes to display.");
  } else {
    res.send({ envelopes });
  }
});

envelopeRouter.get("/:id", (req, res, next) => {
  res.send(req.envelope);
});

////post - create budget envelope
envelopeRouter.post("/", (req, res, next) => {
  const envelopeId = Math.floor(Math.random() * 1000);
  if (
    !req.body.hasOwnProperty("budgetName") ||
    !req.body.hasOwnProperty("budget") ||
    !req.body.hasOwnProperty("used")
  ) {
    //error?
    res
      .status(404)
      .send(
        `Please provide valid data: body must include a budget name, budget amount and amount used`
      );
  } else {
    const newEnvelope = {
      id: envelopeId,
      name: req.body.budgetName,
      budget: req.body.budget,
      used: req.body.used,
    };
    envelopes.push(newEnvelope);
    res.status(200).send("Envelope successfully added");
  }
});

////delete budget envelope
envelopeRouter.delete("/:id", (req, res, next) => {
  envelopes.splice(req.index, 1);
  res.status(200).send("Envelope deleted");
});

////updates
//spend
envelopeRouter.put(
  "/:id",
  requireQuery(["budget", "used"]),
  getIndexOfEnvelope,
  (req, res, next) => {
    const { budget, used } = req.query;
    if (budget != +budget || used != +used) {
      res
        .status(400)
        .send("Query parameters 'budget' and 'used' must be positive numbers");
    }
    envelopes[req.index].budget = +budget;
    envelopes[req.index].used = +used;
    res.send(
      `Envelope ${envelopes[req.index].name} updated.  Budget: ${
        envelopes[req.index].budget
      } Used: ${envelopes[req.index].used}`
    );
  }
);

//transfer
envelopeRouter.put("/transfer/:fromId/:toId", (req, res, next) => {
  const { fromId, toId } = req.params;
  const fromIndex = getIndex(Number(fromId));
  const toIndex = getIndex(Number(toId));

  let envelopeBalance = envelopes[fromIndex].budget - envelopes[fromIndex].used;

  if (envelopeBalance > 0) {
    envelopes[fromIndex].budget = 0;
    envelopes[toIndex].budget += envelopeBalance;
    console.log(envelopes);
  } else {
    res.send("no funds to transer");
  }
});

module.exports = envelopeRouter;
