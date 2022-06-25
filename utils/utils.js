const envelopes = require("../data/envelopeDb");

////////Utility function
const getIndex = (id) => {
  const envelopeIndex = envelopes.findIndex((envelope) => envelope.id === id);
  return Number(envelopeIndex);
};

////////middleware functions------------------------------------------------------------------------------------
/////getIndex of envelope's id
const getIndexOfEnvelope = (req, res, next) => {
  const envelopeIndex = envelopes.findIndex(
    (envelope) => envelope.id === req.envelope.id
  );
  req.index = envelopeIndex;
  next();
};

////Source https://stackoverflow.com/questions/59915006/express-route-check-if-req-params-parameter-is-empty
////middleware to check request query includes all required options

const requireQuery = (queryOptions) => (req, res, next) => {
  const reqQueryList = Object.keys(req.query);
  const hasAllRequiredQuery = queryOptions.every((queryOption) =>
    reqQueryList.includes(queryOption)
  );
  if (!hasAllRequiredQuery)
    return res
      .status(400)
      .send(
        `The following query parameters are all required for this route: ${queryOptions.join(
          ", "
        )}`
      );

  next();
};

////sample usage
// app.get("/some-route", requireParams(["address_line", "zipcode"]), (req, res) => {
//   const { address_line, zipcode } = req.params;
//   if (address_line === "") return res.status(400).send("`address_line` must not be an empty string");

// continue your normal request processing...

////////error handling middleware functions------------------------------------------------------------------------------------

///////exports
module.exports = { getIndex, getIndexOfEnvelope, requireQuery };
