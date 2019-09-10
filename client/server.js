const express = require("express")
const path = require("path")

const app = express()
const port = 80

const srcPath = path.join(__dirname, "src")

const jsPath = path.join(srcPath, "js")
const cssPath = path.join(srcPath, "css")
const imgPath = path.join(srcPath, "img")
const pagePath = path.join(srcPath, "pages")

app.use('/js', express.static(jsPath))
app.use('/css', express.static(cssPath))
app.use('/img', express.static(imgPath))

app.get('/', (req, res) =>
res.sendFile(path.join(pagePath, "index.html"))
)

app.listen(port, () => console.log(`Client listening: port ${port}!`))