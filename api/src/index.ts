/*
  Copyright © Josh Muir 2019.
  Produced for Menzieshill Whitehall Swimming and Water Polo club, a registered charity.
  The unauthorised distribution of this software or any derivative works is strictly prohibited.
 */

// Main API server entry point.
'use strict';
// Deps
import { port, sentryDsn } from '../config';
import express from 'express';
import * as sentry from '@sentry/node';
import {errorGenerator, errorHandler} from './util/';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import auth from './middleware/auth'
import 'reflect-metadata'
import db from './db'
import cors from 'cors'

// Routes
import users from './routes/users'
import groups from './routes/groups'
import posts from './routes/posts'
import events from './routes/events';
import files from './routes/files'

// Set up
const app = express();
sentry.init({ dsn: sentryDsn });
// TODO: Set CORS
app.use(cors({
  origin: ["localhost", "http://localhost", "https://localhost"],
  credentials: true
}));

// Global middleware
app.use(sentry.Handlers.requestHandler());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// Global


// Routes

// Routes NOT requiring auth (or only partly requiring login).
app.use('/users', users);
app.use('/posts', posts);
app.use('/files', files);
app.use('/events', events);

// Routes requiring auth
app.use(auth());
app.use('/groups', groups);



app.get('/', (_req, res) => res.send({
  message: 'API root. No docs are available.',
  status: 200
}));


// Error handling
app.use(sentry.Handlers.errorHandler());
app.use(errorHandler);

// 404
app.use(function (_req, res, _next) {
  res.status(404).send(errorGenerator(404, "Resource not found."))
});


process.on('uncaughtException', err => {
  console.error('There was an uncaught error', err);
  process.exit(1) //mandatory (as per the Node.js docs)
});

db.once('ready', function () {
  app.listen(port, () => console.log(`Menzieshill API starting on ${port}.`));
});

