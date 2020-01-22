const express = require("express")
const path = require("path")

const app = express()
const port = 80;

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
app.use('/admin', express.static(distPath))




// TODO: Move to app.render for caching of generated pages.
// No point in doing it now - will just make development harder.
app.get('/', (req, res) =>
res.render(path.join(pagePath, "index.ejs"))
)

app.get('/admin/*', (req, res) =>
  res.sendFile(path.join(distPath, "index.html"))

)

app.get('/swimming', (req, res) =>
  res.render(path.join(pagePath, "swimming.ejs"))
)

app.get('/waterpolo', (req, res) =>
  res.render(path.join(pagePath, "waterpolo.ejs"))
)

app.get('/posts/*', (req, res) =>
  res.render(path.join(pagePath, "post.ejs"))
)

app.get('/archive', (req, res) =>
  res.render(path.join(pagePath, "archive.ejs"))
)

app.get('/register', (req, res) =>
  res.render(path.join(pagePath, "register.ejs"))
)

app.get('/login', (req, res) =>
  res.render(path.join(pagePath, "login.ejs"))
)


app.listen(port, () => console.log(`Client listening: port ${port}!`))