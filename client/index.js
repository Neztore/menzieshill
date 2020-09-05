// Build file
// This file is executed by Netlify and used to build EJS to static HTML for serving.
const ejs = require("ejs");
const {
  readdir, writeFile, stat, mkdir, watch, unlink
} = require("fs");
const { join } = require("path");


const outputDir = join(__dirname, "public", "pages");
const pagesDir = join(__dirname, "src", "pages");
const partialDir = join(pagesDir, "partials");

// Doesn't affect admin since it's not built with EJS
const apiUrl = process.env.NODE_ENV === "production" ? "https://api.menzieshillwhitehall.co.uk" : "http://localhost:3000";

const watchMode = process.argv[2] === "watch";
console.log(`Building files. Watch mode is ${watchMode ? "enabled" : "disabled"}.`);
function buildFile (fileName, rebuilt) {
  stat(join(pagesDir, fileName), (err, stats) => {
    if (err) {
      if (err.code === "ENOENT") {
        console.log(`File ${fileName} removed`);
        // Remove the EJS
        unlink(join(outputDir, fileName), err => {
          if (err) {
            if (err.code !== "ENOENT") {
              console.error(`Failed to remove dist file: `, err);
            }
          }
        });
        return false;
      }
      console.error(err);
      return false;
    }

    if (stats.isFile()) {
      ejs.renderFile(join(pagesDir, fileName), { ApiUrl: apiUrl }, (err, str) => {
        if (err) {
          return console.error(`Failed to render ${fileName}:\n `, err);
        }
        const outputName = fileName.split(".")[0];
        // for 404 page rewrite it up by 1 directory
        const outputPath = join(outputDir, `${outputName}.html`);
        writeFile(outputPath, str, err => {
          if (err) return console.error(`Failed to create ${outputPath}:\n`, err);
          console.log(`- ${rebuilt ? "Rebuilding" : "Built"} file ${outputName}.html`);
        });
      });
    }
  });
}

function rebuildAll () {
  readdir(pagesDir, async (err, files) => {
    if (err) throw new Error(err);
    await ensureExits(outputDir);
    for (const fileName of files) {
      buildFile(fileName);
    }
  });
}
rebuildAll();

let watchDeb;
// Partial deb is longer as it's "more expensive"
let partialDeb;
if (watchMode) {
  // This builds files twice but usually the second is the one with the edits, so we'll leave it I guess
  // Two builds isn't efficient as possible but it ain't too bad for a temporary hack.

  watch(pagesDir, (eventType, filename) => {
    if (filename && !filename.includes("~")) {
      // if it doesn't exist, stat will catch
      // Temporary
      buildFile(filename, true);
    }
  });

  watch(partialDir, (eventType, filename) => {
    if (!partialDeb) {
      // if it doesn't exist, stat will catch
      console.log(`Partial ${filename} updated. Rebuilding all.`);
      // Set watch deb so that full rebuild does not trigger rebuilds
      watchDeb = setTimeout(() => { watchDeb = null; }, 3000);
      partialDeb = setTimeout(() => { partialDeb = null; }, 5000);
      rebuildAll();
    }
  });
}

function ensureExits (path) {
  return new Promise((resolve, reject) => {
    stat(path, (err, s) => {
      if (err) {
        if (err.code === "ENOENT") {
          mkdir(path, { recursive: true }, err => {
            if (err) reject(err);
            resolve(true);
          });
        } else {
          reject(err);
        }
      } else {
        resolve(true);
      }
    });
  });
}
