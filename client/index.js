// Build file
// This file is executed by Netlify and used to build EJS to static HTML for serving.
const ejs = require("ejs");
const { join } = require("path");
const outputDir = join(__dirname, "public");

