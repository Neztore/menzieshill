const express = require("express");

const app = express();
const port = process.env.port || 1234;
// Emulates Nginx on production

const { readdir } = require("fs");
const { join } = require("path");

const publicDir = join(__dirname, "..", "frontend");

app.use(express.static(publicDir));
app.use("/admin", express.static(join(__dirname, "public", "admin")));
app.use(express.static(join(publicDir, "admin")));/*
readdir(pagesDir, { withFileTypes: true }, (err, files) => {
  if (err) throw new Error(err);
  for (const file of files) {
    if (file.isFile()) {
      const name = file.name.substr(0, file.name.indexOf("."));
      app.get(`/${name}`, (_req, res) => {
        console.log("c");
        res.sendFile(join(pagesDir, file.name));
      });
    }
  }
}); */
app.get("/admin/*", (_, res) => {
  res.sendFile(join(__dirname, "public", "admin", "index.html"));
});
app.listen(port, () => {
  console.log(`Menzieshill dev-server listening on port ${port}`);
});
