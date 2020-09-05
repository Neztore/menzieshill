// Will later take env variables and provide them to app.
const path = require("path");

const {
  port = 3000,
  authLife = 604800,
  filesLoc = path.join(__dirname, "files"), // where files are stored
  recaptchaToken,
  sentryDsn,
  emailToken
} = process.env;

module.exports = {
  port,
  authLife,
  filesLoc,
  recaptchaToken,
  sentryDsn,
  emailToken
};
