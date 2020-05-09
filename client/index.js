// Build file
// This file is executed by Netlify and used to build EJS to static HTML for serving.
const ejs = require("ejs");
const { join } = require("path");
const { readdir, writeFile, stat } = require("fs");
const outputDir = join(__dirname, "public", "pages");
const pagesDir = join(__dirname, "src", "pages");
console.log(`EJS: Building pages.`)

// Doesn't affect admin since it's not built with EJS
const apiUrl = process.env.NODE_ENV === "production" ? "https://api.menzieshillwhitehall.co.uk":"http://localhost:3000"
readdir(pagesDir, function (err, files) {
	if(err) throw new Error(err);
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
})

// Plan:
// Move CSS, images & JS to public done
// Move pages to a pages directory done
// Move partials with pages done
// Move Admin output to public/admin or public/dashboard done
// Set up some redirects
// Create 404.html
