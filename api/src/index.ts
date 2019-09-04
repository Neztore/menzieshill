/*
  Copyright © Josh Muir 2019.
  Produced for Menzieshill Whitehall Swimming and Water Polo club, a registered charity.
  The unauthorised distribution of this software or any derivative works is strictly prohibited.
 */

// Main API server entry point.

// Deps
const { port, sentryDsn } = require("../config");
import express from "express";
const sentry = require('@sentry/node');
const { errorHandler } = require("./util/errors");

// Set up
const app = express();
sentry.init({ dsn: sentryDsn });

// Global middleware
app.use(sentry.Handlers.requestHandler());


app.get('/', (_req, res) => res.send({
  message: "API root. No docs are available.",
  status: 200
}));


// Error handling
app.use(sentry.Handlers.errorHandler());
app.use(errorHandler);



app.listen(port, () => console.log(`Menzieshill API starting on ${port}.`));
