/*
  Copyright © Josh Muir 2019.
  Produced for Menzieshill Whitehall Swimming and Water Polo club, a registered charity.
  The unauthorised distribution of this software or any derivative works is strictly prohibited.
 */

// Main API server entry point.
"use strict";
// Deps
import { port, sentryDsn } from "../config";
import express from "express";
import * as sentry from '@sentry/node';
import { errorHandler } from "./util/";
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import auth from './middleware/auth'

// Routes
import users from './routes/users'
import groups from './routes/groups'
import posts from './routes/posts'
import events from "./routes/events";

// Set up
const app = express();
sentry.init({ dsn: sentryDsn });



// Global middleware
app.use(sentry.Handlers.requestHandler());
app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());

// Routes

// Routes NOT requiring auth (or only partly requiring login).
app.use('/users', users);
app.use('/posts', posts);

// Routes requiring auth
app.use(auth());
app.use('/groups', groups);
app.use('/events', events);

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
