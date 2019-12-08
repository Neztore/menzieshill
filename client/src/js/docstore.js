// Code which manages the
const rootType = location.href.split('=')[1].split('&')[0]


class DocStore {
  constructor (baseElement, rootType) {
    this.base = baseElement
    this.openFolder(rootType)
    this.folderCache = {} // Contains a map of FolderId: Files.
  }
  openFile () {

  }
  async openFolder (folderId) {
    // Get new folder info
    const folder = await this.getFolder(folderId)
    this.currentFolder = folderId

    // Display it
    const table = document.createElement("div")
    table.className = "table"
  }

  createRow (where, fileInfo) {

  }
  // Does the HTTP fetch
  async getFolder (id) {
    const folder = await Api.get("/files/"+id)
    if (folder.error) {
      // Display error
      createErrorMessage(`Failed to access folder: ${folder.error.message}`)
    } else {
      this.folderCache[id] = folder
      return folder
    }
  }




}
document.addEventListener("DOMContentLoaded", function () {
  const doc = new DocStore(document.body, rootType)
})
