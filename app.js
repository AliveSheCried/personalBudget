const express = require("express");
const logger = require("morgan");
const helmet = require("helmet");

const indexRouter = require("./routes/index");
const envelopeRouter = require("./routes/envelope");
const errorRouter = require("./routes/error");

const app = express();
app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/envelopes", envelopeRouter);
app.use("/error", errorRouter);

const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
