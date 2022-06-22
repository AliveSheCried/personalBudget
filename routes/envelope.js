const express = require("express");
const envelopeRouter = express.Router();

const envelopes = require("../data/envelopeDb");
const { getIndex } = require("../utils/utils");

////////middleware functions------------------------------------------------------------------------------------
/////manage get/put by envelopeId
envelopeRouter.param("id", (req, res, next, id) => {
  const envelope = envelopes.find((envelope) => envelope.id == id);
  if (envelope) {
    req.envelope = envelope;
    next();
  } else {
    //update to call error function?
    res.status(404).send(`Envelope with id:${id} does not exist`);
  }
});

/////getIndex of envelope's id
const getIndexOfEnvelope = (req, res, next) => {
  const envelopeIndex = envelopes.findIndex(
    (envelope) => envelope.id === req.envelope.id
  );
  req.index = envelopeIndex;
  next();
};

////mw copied from stack overflow - checks thats parameters are populated
// const requireParams = params => (req, res, next) => {
//   const reqParamList = Object.keys(req.params);
//   const hasAllRequiredParams = params.every(param =>
//       reqParamList.includes(param)
//   );
//   if (!hasAllRequiredParams)
//       return res
//           .status(400)
//           .send(
//               `The following parameters are all required for this route: ${params.join(", ")}`
//           );

//   next();
// };

// app.get("/some-route", requireParams(["address_line", "zipcode"]), (req, res) => {
//   const { address_line, zipcode } = req.params;
//   if (address_line === "") return res.status(400).send("`address_line` must not be an empty string");

//   // continue your normal request processing...
// });

//////routes-------------------------------------------------------------------------------
////get routes
envelopeRouter.get("/", (req, res, next) => {
  if (envelopes.length === 0) {
    //error handling?
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
  const fromIndex = getIndex(Number(req.params.fromId));
  const toIndex = getIndex(Number(req.params.toId));

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
