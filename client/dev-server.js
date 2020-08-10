const express = require("express");
const app = express();
const port = process.env.port || 1234
// Emulates Nginx on production
// This is temporary; I'll be reworking it a bit when I rewrite the whole pages system.

const { join } = require("path");
const publicDir = join(__dirname, "public");
const pagesDir = join(publicDir, "pages");
const { readdir } = require("fs");

app.use(express.static(publicDir));
app.use(express.static(pagesDir));

readdir(pagesDir, {withFileTypes: true}, function (err, files) {
    if (err) throw new Error(err)
    for (let file of files) {
        if (file.isFile()) {
            const name = file.name.substr(0, file.name.indexOf("."))
            app.get(`/${name}`, function (req, res) {
                res.sendFile(join(pagesDir, file.name))

            })
        }
    }

})

app.listen(port, function () {
    console.log(`Menzieshill dev-server listening on port ${port}`);

})
