// Code which manages the
const rootType = location.href.split('=')[1].split('&')[0]
const Api = parent.Api
const BaseUrl = parent.BaseUrl
const removeChildren = parent.removeChildren


class DocStore {
  constructor (baseElement, rootType) {
    this.base = baseElement
    this.openFolder(rootType)
    this.folderCache = {} // Contains a map of FolderId: Files.
    this.selected = []
    this.trail = []

    // Buttons
    const store = this

    const addFiles = document.getElementsByClassName("add-files")[0]
    addFiles.addEventListener("click", function () {
      const modal = new UploadModal(parent.document.body, store.currentFolder || rootType, function () {
        store.openFolder(store.currentFolder)
      })
      modal.show()
    })

    const addFolder = document.getElementsByClassName("add-folder")[0]
    addFolder.addEventListener("click", function () {
      store.addFolder()

    })
  }
  async addFolder () {
    const folderName = prompt("Please enter a name for the new folder.", "New folder")
    if (folderName) {
      // They didn't click cancel
      const parent = this.currentFolder
      const res = await Api.post(`/files/${parent}`, {
        body: { name: folderName }
      })

      if (res.success) {
        this.openFolder(parent)
      } else {
        window.parent.createErrorMessage(res.error.message)
      }
    } else {
      console.log(`Cancelled folder creation.`)
    }
  }

  openFile (loc) {
    window.top.location.href = `${BaseUrl}/files/${this.currentFolder}/${loc}`
  }
  addTrailItem (folder) {
    let str = folder.name.replace("_ROOT", "");

    // Check that the last trail item isn't this folder.
    const last = this.trail[this.trail.length - 1]
    if (last && last.id === folder.id) {
      console.log(`Skip trail: Last matches.`)
      // still update name incase folder name changed
      last.name = folder.name
      this.showTrail()
    } else {
      this.trail.push({n: str, id: folder.id})
      this.showTrail()
    }

  }


  showTrail() {
    const trail = this.base.getElementsByClassName("trail")[0]
    removeChildren(trail)

    const ul = document.createElement("ul")
    trail.appendChild(ul)
    for (let i=0; i<this.trail.length;i++ ) {
      const item = this.trail[i]

      const li = document.createElement("li")
      li.className = "has-text-link"


      li.appendChild(document.createTextNode(item.n))
      ul.appendChild(li)

      const that = this;
      li.addEventListener("click", function () {
        if (item.id !== that.currentFolder) {
          that.trail = that.trail.slice(0, i)
          that.openFolder(item.id)
        }
      })
      ul.lastChild.className = ""
    }
  }
  async openFolder (folderId) {
    const that = this
    const folder = await this.getFolder(folderId)
    this.currentFolder = folder.id

    // Global for util - it's never read.
    window.parent.Global_FolderId = folder.id

    // Display it

    const parent = this.base.getElementsByClassName("data")[0]
    removeChildren(parent)
    if (folder.children.length === 0 && folder.files.length===0) {
      parent.appendChild(document.createTextNode("There are no items to show."))
    }

    const mainCog = document.querySelectorAll("thead th span")[0]
    mainCog.onclick = function () {
      const modal = new EditModal(window.parent.document.body, folder, function (deleted) {
        if (deleted) {
          that.openFolder(rootType)
        } else {
          that.openFolder(that.currentFolder)
        }

      });
      modal.show()
    }

    for (let item of folder.children) {
      this.createRow(parent, item)
    }

    for (let item of folder.files) {
      this.createRow(parent, item)
    }
    this.addTrailItem(folder)
  }


  createRow (where, fileInfo) {
    const row = document.createElement("tr")

    const checkBoxColumn = document.createElement("td")
    row.appendChild(checkBoxColumn)
    const checkbox = document.createElement("input")
    checkbox.disabled = true
    checkbox.type = "checkbox"
    checkbox.className = "checkbox"
    checkBoxColumn.appendChild(checkbox)

    const name = document.createElement("td")

    const type = document.createElement("td")

    let typeString

    const that = this
    if (fileInfo.loc) {
      // It's a file
      const nameLink = document.createElement("a")
      nameLink.appendChild(document.createTextNode(fileInfo.name))
      nameLink.href = `${BaseUrl}/files/${this.currentFolder}/${fileInfo.loc}`
      name.appendChild(nameLink)

      // Makes the whole box 'click sensitive'
      name.addEventListener("click", function () {
        that.openFile(fileInfo.loc)
      })

      const arr = fileInfo.loc.split(".")
      if (arr.length > 1) {
        typeString = arr[arr.length - 1].toLowerCase()
      } else {
        typeString = "Unkown"
      }

    } else {
      // Folder
      name.appendChild(document.createTextNode(fileInfo.name))

      name.addEventListener("click", function () {
        that.openFolder(fileInfo.id)
      })

      typeString = "Folder"
    }

    row.appendChild(name)

    type.appendChild(document.createTextNode(typeString))
    row.appendChild(type)

    const created = document.createElement("td")

    const timeString = new Date(fileInfo.created).toLocaleString()
    const processedTime = timeString.substr(0, 10) + " " + timeString.substr(12, 4) + timeString.substr(20, 2)
    created.appendChild(document.createTextNode(processedTime))
    row.appendChild(created)

    const editRow = document.createElement("td")
    const editCog = document.createElement("span")
    editCog.className = "icon icon-cog clickable"
    editCog.addEventListener("click", function () {
      const modal = new EditModal(parent.document.body, fileInfo, function (deleted) {
        if (deleted) {
          that.openFolder(rootType)
        } else {
          that.openFolder(that.currentFolder)
        }
      });
      modal.show()
    })

    editRow.appendChild(editCog)
    row.appendChild(editRow)

    where.appendChild(row)
  }
  // Does the HTTP fetch
  async getFolder (id) {
    const folder = await Api.get("/files/"+id)
    if (folder.error) {
      // Display error
      parent.createErrorMessage(`Failed to access folder: ${folder.error.message}`)
    } else {
      this.folderCache[id] = folder
      return folder
    }
  }


}
document.addEventListener("DOMContentLoaded", function () {
  const doc = new DocStore(document.getElementsByClassName("docstore-parent")[0], rootType)
})
