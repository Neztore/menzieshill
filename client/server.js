const express = require("express")
const path = require("path")

const app = express()
const port = 80;

const srcPath = path.join(__dirname, "src")

const jsPath = path.join(srcPath, "js")
const cssPath = path.join(srcPath, "css")
const imgPath = path.join(srcPath, "img")
const pagePath = path.join(srcPath, "pages")
const sharedPath = path.join(srcPath, "shared")

app.use('/js', express.static(jsPath))
app.use('/css', express.static(cssPath))
app.use('/img', express.static(imgPath))
app.use('/shared', express.static(sharedPath))


app.get('/', (req, res) =>
res.sendFile(path.join(pagePath, "index.html"))
)

app.get('/swimming', (req, res) =>
  res.sendFile(path.join(pagePath, "swimming.html"))
)

app.get('/waterpolo', (req, res) =>
  res.sendFile(path.join(pagePath, "waterpolo.html"))
)

app.get('/posts/*', (req, res) =>
  res.sendFile(path.join(pagePath, "post.html"))
)

app.get('/archive', (req, res) =>
  res.sendFile(path.join(pagePath, "archive.html"))
)


app.listen(port, () => console.log(`Client listening: port ${port}!`))