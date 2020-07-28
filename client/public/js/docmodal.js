// Contains the various modals related to the DocStore.
const ParentModal = parent.GlobalModal
class DocModal extends  ParentModal {
  constructor (where) {
    super(where)

    const modalContent = document.createElement("div")
    modalContent.className = `modal-content`
    this.content = modalContent
    this.base.appendChild(modalContent)
  }
}

class PermissionModal extends  DocModal {
  constructor (where, folderInfo) {
    super(where)
    this.folderInfo = folderInfo;
  }
  addContent () {
    const content = document.createElement("div")
    content.className = "notification has-background-white"
    // Since CSS doesn't apply to parent doc
    content.style = "min-height:10vh;"
    this.content.appendChild(content)
    const title = document.createElement("h3")
    title.className = "is-size-4"
    title.innerText = `You do not have access to ${this.folderInfo.name}!`
    content.appendChild(title)

    const hr = document.createElement("hr")
    content.appendChild(hr)

    const subtitle = document.createElement("h2");
    subtitle.className = "subtitle has-text-centered"
    subtitle.appendChild(document.createTextNode(`${window.user ? "You do not have permission to access that folder":"You are not logged in. Please log in or create an account."}`))

    const text = document.createElement("p");
    text.className = "notification is-warning"
    content.appendChild(subtitle)
    text.innerHTML = 'If you are logged in and think you should have access to this folder (for example if you are a club member trying to access club minutes) please contact the <a href="mailto:ppo@menzieshillwhitehall.co.uk">Press and publicity officer</a> to request access.'
    content.appendChild(text)
  }
}


class UploadModal extends DocModal {
  constructor (where, folder, uploaded) {
    super(where)
    this.formdata = new FormData();
    this.parent = folder
    this.uploadedCallback = uploaded
  }
  addContent () {
    const that = this

    const content = document.createElement("div")
    content.className = "container has-background-white doc-modal"
    this.content.appendChild(content)

    // The drop zone - CSS is in global.
    const dropzone = document.createElement("div")
    dropzone.className = "dropzone notification"
    dropzone.ondrop = this.ondrop.bind(this)
    dropzone.ondragover = function () {
      return false
    }

    const text = document.createElement("p")
    text.className = "upload-text"
    text.appendChild(document.createTextNode("Drag files here,"))
    dropzone.appendChild(text)

    const uploadButton = document.createElement("button")
    uploadButton.className = "button"
    uploadButton.textContent = "Or click here to select files."

    const hiddenUpload = document.createElement("input")
    hiddenUpload.type = "file"
    hiddenUpload.hidden = true

    uploadButton.addEventListener("click", function () {
      hiddenUpload.click()
      hiddenUpload.onchange = function() {
        const files = hiddenUpload.files
        for (let f of files) {
          that.addFile(f)
        }
        that.upload()
      }
    })

    dropzone.appendChild(hiddenUpload)

    dropzone.appendChild(uploadButton)

    content.appendChild(dropzone)

  }

  addFile (file) {
    console.log(`Added `, file)
    this.formdata.append("files", file)
  }

  async upload () {
    const dropzone = this.content.getElementsByClassName("dropzone")[0]
    const loader = document.createElement("div")
    const bar = document.createElement("progress")
    bar.className = "progress is-primary"
    bar.max = 100
    loader.appendChild(bar)

    const cancel = document.createElement("button")
    cancel.className = "button is-danger"
    cancel.appendChild(document.createTextNode("Cancel upload."))
    cancel.addEventListener("click", function () {
      this.controller.abort()
      this.remove()
    })

    loader.appendChild(cancel)
    this.content.getElementsByClassName("upload-text")[0].textContent = "Uploading file(s)..."
   dropzone.appendChild(loader)

    try {
      // Cancellation support
      if (AbortController) {
        console.log(`Exists.`)
        this.controller = new AbortController()
      }
      const res = await parent.Api._makeRequest(`/files/${this.parent}/files`, {
        method: "POST",
        body: this.formdata,
        credentials: "include",
        signal: this.controller ? this.controller.signal : undefined
      })
      if (res.success) {
        this.uploadedCallback(true)
        this.remove()
      } else {
        createErrorMessage(res.error.message)
        this.remove()
      }
    } catch (e) {
      console.error(e.message)
      createErrorMessage(e.message)
    }


  }
  ondrop (ev) {
    ev.preventDefault()
    let someAdded = false
    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (var i = 0; i < ev.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[i].kind === 'file') {
          this.addFile(ev.dataTransfer.items[i].getAsFile());
          someAdded = true
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (var c = 0; c < ev.dataTransfer.files.length; c++) {
        this.addFile(ev.dataTransfer.files[c])
        someAdded = true
      }
    }
    this.upload()
  }
}

class EditModal extends DocModal {
  constructor (where, fileInfo, changeCb) {
    super(where)
    this.where = where
    this.isFolder = !fileInfo.loc;

    this.info = fileInfo
    this.changeCb = changeCb || function () {
      alert("EditModal has no change callback. Please report this error.")
    }
  }
  // note to self: just use react in future. is this really worth the pain?
  async addContent () {
    const modal = this
    const content = document.createElement("div")
    content.className = "notification has-background-white"
    // Since CSS doesn't apply to parent doc
    content.style = "min-height:10vh;"
    this.content.appendChild(content)
    const title = document.createElement("h3")
    title.className = "is-size-4"
    title.innerText = `Editing ${this.isFolder ? "folder":"file"} \"${this.info.name}\"`
    content.appendChild(title)

    if (this.isFolder) {
      const idText = document.createElement("small")
      idText.className = "is-size-7"
      idText.innerText = ` ID: ${this.info.id}`
      title.appendChild(idText)
    }
    const hr = document.createElement("hr")
    content.appendChild(hr)


    const label = document.createElement("label")
    label.innerText = `Modify ${this.isFolder ? "Folder":"File"} permissions`
    label.className = "label"
    content.appendChild(label)

    // Access group management
    const accessGroupField = document.createElement("div")
    accessGroupField.className = "field is-grouped"

    const dropDownWrapper = document.createElement("div")
    dropDownWrapper.className = "select control"
    const dropDown = document.createElement("select")
    dropDownWrapper.appendChild(dropDown)

    const groups = await Api.getGroups()
    this.allGroups = groups

    for (let grp of groups) {
      if (!groupExists(this.info.accessGroups, grp)) {
        const opt = document.createElement("option")
        opt["data-groupId"] = grp.id
        opt.innerText = grp.name
        dropDown.appendChild(opt)
      }

    }
    const help = document.createElement("p")
    help.className = "help"
    help.innerText = `You can add required groups here. Users require all of the listed groups to view this ${this.isFolder?"Folder":"File"}. This does not apply to admins.`
    content.appendChild(help)

    accessGroupField.appendChild(dropDownWrapper)
    const addButton = document.createElement("button")
    addButton.className = "button is-success"
    addButton.innerText = "Add group"

    addButton.addEventListener("click", function () {
      const selectedId = dropDown.options[dropDown.selectedIndex]
      modal.addGroup(selectedId["data-groupId"])
    })
    accessGroupField.appendChild(addButton)
    content.appendChild(accessGroupField)

    // Generate current area
    const currentGroupContainer = document.createElement("div")
    currentGroupContainer.className = "field is-grouped is-grouped-multiline"
    currentGroupContainer.style = "border: 1px solid hsl(0, 0%, 86%); border-radius: 3px; padding: 2px; padding-left: 0.3em; min-height: 12vh;"
    this.groupContainer = currentGroupContainer

    for (let grp of this.info.accessGroups) {
     this.addGroupTag(grp)
    }

    content.appendChild(currentGroupContainer)
    content.appendChild(document.createElement("hr"))

    // Buttons
    const buttons = document.createElement("div")
    buttons.className = "field is-grouped"

    const renameControl = document.createElement("p")
    renameControl.className = "control"

    const renameButton = document.createElement("button")
    renameButton.innerText = `Rename ${this.isFolder ? "Folder":"File"}`
    renameButton.className = "button"
    renameButton.addEventListener("click", function () {
      modal.rename()
    })
    renameControl.appendChild(renameButton)
    buttons.appendChild(renameControl)

    const deleteControl = document.createElement("p")
    deleteControl.className = "control"

    const deleteButton = document.createElement("button")
    deleteButton.innerText = `Delete ${this.isFolder ? "Folder":"File"}`
    deleteButton.className = "button is-danger"
    deleteButton.addEventListener("click", function () {
      modal.delete()
    })
    deleteControl.appendChild(deleteButton)
    buttons.appendChild(deleteControl)

    content.appendChild(buttons)
  }

  addGroupTag (grp) {
    const modal = this
    const outer = document.createElement("div")
    outer.className = "control"

    const tags = document.createElement("div")
    tags.className = "tags has-addons"
    outer.appendChild(tags)

    const tag = document.createElement("span")
    tag.innerText = grp.name
    tag.className = "tag is-primary"
    tags.appendChild(tag)

    const deleteTag = document.createElement("a")
    deleteTag.className = "tag is-delete"
    tags.appendChild(deleteTag)
    this.groupContainer.appendChild(outer)
    deleteTag.addEventListener("click", function () {
      modal.removeGroup(grp.id)
    })
  }
  // Gets a new name. Repeats twice if initial is invalid.
  async rename (time) {
    if (time > 3) {
      return false
    }
    let msg = time ? "Invalid name. Please enter a new name. Must be more than 3 characters and not include some symbols.":`Enter new name for ${this.isFolder ? "folder":"file"}.`

    const newName = prompt(msg,this.info.name)
    if (newName) {
      // Validation
      if (isValidName(newName)) {
        const rename = await this.save({
          name: newName
        })
        if (rename.error) {
          console.error(rename.error.message)
          this.rename(time ? time + 1 : 1)
        } else {
          this.changeCb()
          this.remove()
        }
      } else {
        this.rename(time ? time + 1 : 1)
      }
    }
  }

  async removeGroup (groupId) {
    const sendArr = []
    const arr = this.info.accessGroups
    for (let item of arr) {
      if (item.id !== groupId) {
        sendArr.push(item.id)
      } else {
      }
    }
    const res = await this.save({accessGroups: sendArr})
    if (res.error) {
      createErrorMessage(res.error.message)
    } else {
      // Do some refresh magic.
      const newModal = new EditModal(this.where, res.folder || res.file, this.changeCb)
      newModal.show()
      this.remove()
    }
  }
  async addGroup (grpId) {
    const groups = this.info.accessGroups
    const sendArray = []
    for (let item of groups) {
      sendArray.push(item.id)
    }
    sendArray.push(grpId)
    const res = await this.save({accessGroups: sendArray})
    if (res.error) {
      console.error(res.error.message)
      createErrorMessage(res.error.message)
      this.remove()
    } else {
      this.addGroupTag(this.allGroups.find(g=>g.id === grpId))
      this.info = res.file || res.folder
    }

  }

  async delete () {
    let url = this.isFolder ? `/files/${this.info.id}`:`/files/${this.info.loc}`
    const res = await Api.delete(url);
    if (res.error) {
      console.error(res.error)
      createErrorMessage("You cannot delete a folder which is not empty. This is a feature which will be added at a later date.")
    } else {
      this.changeCb(true)
      this.remove()
    }
  }
  save (newValues) {
    if (this.isFolder) {
      newValues.id = this.info.id
    } else {
      newValues.loc = this.info.loc
    }

    let url = this.isFolder ? `/files/${this.info.id}` : `/files/parent/files/${this.info.loc}`

    return Api.patch(url, {
      body: newValues
    })
  }


}
function  groupExists (list, group) {
  for (let grp of list) {
    if (grp.id === group.id) {
      return true
    }
  }
  return false
}
