// Build file
// This file is executed by Netlify and used to build EJS to static HTML for serving.
const ejs = require("ejs");
const { join } = require("path");
const { readdir, writeFile, stat } = require("fs");
const outputDir = join(__dirname, "public");
const pagesDir = join(__dirname, "src", "pages");
console.log(`EJS: Building pages.`)

readdir(pagesDir, function (err, files) {
	if(err) throw new Error(err);
	for (let fileName of files) {
		stat(join(pagesDir, fileName), function (err, stats) {
			if (stats.isFile()) {
				ejs.renderFile(join(pagesDir, fileName), {}, function (err, str) {
					if (err) {
						return console.error(`Failed to render ${fileName}:\n `,err)
					}
					const outputName = fileName.split(".")[0];
					const outputPath = join(outputDir, `${outputName}.html`)
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
