/*
  Copyright © Josh Muir 2019.
  Produced for Menzieshill Whitehall Swimming and Water Polo club, a registered charity.
  The unauthorised distribution of this software or any derivative works is strictly prohibited.
 */

// Main API server entry point.

// Deps
import { port, sentryDsn } from "../config";
import express from "express";
import * as sentry from '@sentry/node';
import { errorHandler } from "./util/errors";
import helmet from 'helmet';
import bodyParser from 'body-parser';

// Routes
import users from './routes/users'

// Set up
const app = express();
sentry.init({ dsn: sentryDsn });



// Global middleware
app.use(sentry.Handlers.requestHandler());
app.use(helmet());
app.use(bodyParser.json());

// Routes
app.use('/users', users);

app.get('/', (_req, res) => res.send({
  message: "API root. No docs are available.",
  status: 200
}));


// Error handling
app.use(sentry.Handlers.errorHandler());
app.use(errorHandler);


process.on('uncaughtException', err => {
  console.error('There was an uncaught error', err);
  process.exit(1) //mandatory (as per the Node.js docs)
});


app.listen(port, () => console.log(`Menzieshill API starting on ${port}.`));
