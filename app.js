const express = require("express");
const logger = require("morgan");
//const createError = require("http-errors");
const helmet = require("helmet");

const envelopeRouter = require("./routes/envelope");

const app = express();
app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/envelopes", envelopeRouter);

const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
