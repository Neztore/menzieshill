const express = require("express")
const path = require("path")

const app = express()
const port = process.env.port || 80;

app.set('view engine', 'ejs');

const srcPath = path.join(__dirname, "src")

const jsPath = path.join(srcPath, "js")
const cssPath = path.join(srcPath, "css")
const imgPath = path.join(srcPath, "img")
const pagePath = path.join(srcPath, "pages")
const sharedPath = path.join(srcPath, "shared")

const distPath = path.join(__dirname, "dist")

app.use('/js', express.static(jsPath))
app.use('/css', express.static(cssPath))
app.use('/img', express.static(imgPath))
app.use('/shared', express.static(sharedPath))
app.use('/admin', express.static(distPath));




// TODO: Move ot Netlify & Create a new "Build step" using EJS
// Consider: Netlify CMS or some similar CMS.

// No point in doing it now - will just make development harder.
const simpleFiles = ["swimming", "waterpolo", "open-water", "archive", "photos", "register", "login", "contact", "terms", "docs", "welcome", "history", "kit", "land-training"];
for (let file of simpleFiles) {
	app.get(`/${file}`, (req, res) =>
		res.render(path.join(pagePath, `${file}.ejs`))
	)
}
app.get('/', (req, res) =>
res.render(path.join(pagePath, "index.ejs"))
)

app.get('/admin/*', (req, res) =>
  res.sendFile(path.join(distPath, "index.html"))

)

app.get('/posts/*', (req, res) =>
  res.render(path.join(pagePath, "post.ejs"))
)

app.get('/*', (req, res) =>
    res.status(404).render(path.join(sharedPath, "404.ejs"))
)


app.listen(port, () => console.log(`Client listening: port ${port}!`))
