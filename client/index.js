// Build file
// This file is executed by Netlify and used to build EJS to static HTML for serving.
const ejs = require("ejs");
const { join } = require("path");
const { readdir, writeFile, stat, mkdir } = require("fs");
const outputDir = join(__dirname, "public", "pages");
const pagesDir = join(__dirname, "src", "pages");
console.log(`EJS: Building pages.`)

// Doesn't affect admin since it's not built with EJS
const apiUrl = process.env.NODE_ENV === "production" ? "https://api.menzieshillwhitehall.co.uk":"http://localhost:3000"
readdir(pagesDir, async function (err, files) {
	if(err) throw new Error(err);
	await ensureExits(outputDir);
	for (let fileName of files) {
		stat(join(pagesDir, fileName), function (err, stats) {
			if (stats.isFile()) {
				ejs.renderFile(join(pagesDir, fileName), {
					ApiUrl: apiUrl
				}, function (err, str) {
					if (err) {
						return console.error(`Failed to render ${fileName}:\n `,err)
					}
					const outputName = fileName.split(".")[0];
					// for 404 page rewrite it up by 1 directory
					const outputPath = outputName === "404" ? join(outputDir, "..",`${outputName}.html`) : join(outputDir, `${outputName}.html`)
					writeFile(outputPath, str, function (err) {
						if (err) return console.error(`Failed to create ${outputPath}:\n`, err);
						console.log(`Created file ${outputName}.html`);
					});

				} )
			}
		});
	}
});

function ensureExits (path) {
	return new Promise(function (resolve, reject) {
		stat(path, function (err, s) {
			if (err) {
				if (err.code === "ENOENT") {
					mkdir(path, {
						recursive: true
					}, function (err) {
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
	})
}
