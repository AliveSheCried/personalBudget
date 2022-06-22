const envelopes = require("../data/envelopeDb");

const getIndex = (id) => {
  const envelopeIndex = envelopes.findIndex((envelope) => envelope.id === id);
  return Number(envelopeIndex);
};

module.exports = { getIndex };
