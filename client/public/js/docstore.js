// Photos viewer - deliberately intended to be a future replacement for the main file viewer.
const imgExtensions = ["jpeg", "jpg", "gif", "png", "exif", "bmp", "webp", "svg", "apng", "cur", "pjpeg", "pjp", "jfif"];

(function () {
  // Makes it easy to move to LocalStorage based if needed
  let history = [];
  const cache = {};
  let currentFolderId;
  let isGrid = false;
  let modalTarget;

  document.addEventListener("DOMContentLoaded", function () {
    const listParent = document.getElementById("list-table");
    const gridParent = document.getElementById("grid")

    const listData = document.getElementById("list-data")
    const gridData = document.getElementById("grid-data");
    const modal = document.getElementById("img-modal");

    const addFilesButton = document.getElementById("add-files-button");
    const addFolderButton = document.getElementById("add-folder-button");

    const currentFolderText = document.getElementById("current-folder");
    const goBackButton = document.getElementById("go-back-button");
    const listButton = document.getElementById("list-view-button");
    const gridButton = document.getElementById("grid-view-button");

    // Initial
    // TODO: Parse out the "initial" folder from hash/update it also?
    setFolder(window.rootType || "docs")
    setViewType(false, true);

    addFilesButton.onclick = function () {
      const modal = new UploadModal(parent.document.body, currentFolderId, function () {
        setFolder(currentFolderId)
      })
      modal.show()
    }
    addFolderButton.onclick = function () {
      addFolder()
    }
    listButton.onclick = function () {
      setViewType(false);
    }
    gridButton.onclick = function () {
      setViewType(true);
    }




    function setViewType (toGrid, noRefresh) {
      isGrid = toGrid || false;
      if (isGrid) {
        listButton.classList.remove("is-active")
        gridButton.classList.add("is-active")
      } else {
        listButton.classList.add("is-active")
        gridButton.classList.remove("is-active")
      }
      // Will return from cache, meaning view is updated
      !noRefresh && setFolder(currentFolderId)
    }
    goBackButton.onclick = function () {
      if (history.length > 1) {
        history.pop();
        setFolder(history[history.length - 1])
      } else {
        showMessage("Couldn't go back", "You are at the highest folder - couldn't go back.", "danger", 3000);
      }

    }


    function setFolder (newId) {
      console.log("Set folder to " + newId)
      currentFolderId = newId;
      refreshView();
    }
    async function refreshView () {
      const folderInfo = await fetchFolder(currentFolderId);
      if (folderInfo) {
        // Set folder text
        let str = folderInfo.name.replace("_ROOT", "");
        currentFolderText.innerText = `You are in: ${str}`;
        // Add to history
        history.push(folderInfo.id);

        if (isGrid) {
          console.log("It's a grid!")
          showGrid(folderInfo)
        } else {
          showList(folderInfo)
        }
      }

    }
    const getExt = function (str) {
      return str.substring(str.indexOf(".") + 1, str.length);
    }


    function showGrid (folderInfo) {
      // Hide list if shown
      gridParent.style.display = "";
      listParent.style.display = "none";
      // Remove previous list
      removeChildren(gridData)
      if (folderInfo.children.length === 0 && folderInfo.files.length === 0) {
        const noContent = document.createElement("p");
        noContent.className = "has-text-centered";
        noContent.innerText = "There are no items to display.";
        gridData.appendChild(noContent);
      }

      for (let i = 0; i < folderInfo.files.length; i++) {
        const file = folderInfo.files[i];
        const ext = getExt(file.loc);
        console.log(ext);
        if (ext && imgExtensions.includes(ext.toLowerCase())) {
          showGridImage(file);
        } else {
          showGridFile(file);
        }
      }
      for (let i = 0; i < folderInfo.children.length; i++) {
        const folder = folderInfo.children[i];
        showGridFile(folder, true)

      }
    }


    // Create the gallery boxes - this is a pain in plain JS.
    function showGridImage (fileInfo) {
      const col = document.createElement("div");
      col.className = "column is-3 outerBox";
      const img = document.createElement("div");

      const url = `${BaseUrl}/files/${currentFolderId}/${fileInfo.loc}`;
      img.style.backgroundImage = `url('${url}')`;
      img.style.backgroundSize = "cover";
      img.className = "file-box box";
      col.appendChild(img);
      gridData.appendChild(col);

      col.onclick = function (e) {
        e.preventDefault();
        const img = modal.getElementsByTagName("img")[0];
        const box = modal.getElementsByClassName("box")[0];

        const meta = document.getElementById("modal-meta-text");
        const a = document.getElementById("img-link");

        img.style.display = "block";
        box.style.display = "none";

        img.src = url;
        a.href = url;
        const parsed = new Date(fileInfo.created);
        meta.innerText = parseDate(parsed, true);
        modal.className = modal.className + " is-active";
        modalTarget = fileInfo;
      };
    }

    function showGridFile (fileInfo, isFolder) {
      const col = document.createElement("div");
      col.className = "column is-3 outerBox";

      const innerColumns = document.createElement("div");
      innerColumns.className = "columns is-centered is-vcentered";

      const box = document.createElement("div");
      box.className = "box file-box";
      col.appendChild(box);
      box.appendChild(innerColumns);

      const innerCol = document.createElement("div");
      innerCol.className = "column is-6";
      innerColumns.appendChild(innerCol);

      const url = isFolder ? `${BaseUrl}/files/${fileInfo.id}` :`${BaseUrl}/files/${currentFolderId}/${fileInfo.loc}`

      const icon = document.createElement("i");

      const iconClass = isFolder ? "icon-folder-open" : "icon-rocket";
      icon.className = "icon is-large " + iconClass;
      innerCol.appendChild(icon);
      const info = document.createElement("p");
      info.className = "has-text-centered";
      info.innerText = fileInfo.name;
      innerCol.appendChild(info);

      gridData.appendChild(col);

      col.onclick = function (e) {
        e.preventDefault();
        // Modal set-up
        if (isFolder) {
          setFolder(fileInfo.id);
        } else {
          const meta = document.getElementById("modal-meta-text");
          const openButton = document.getElementById("modal-open");

          const img = modal.getElementsByTagName("img")[0];
          const box = modal.getElementsByClassName("box")[0];
          const text = document.getElementById("m-file-text");
          const desc = document.getElementById("m-file-desc");

          img.style.display = "none";
          box.style.display = "block";

          text.innerText = fileInfo.name;

          openButton.href = url;
          const parsed = new Date(fileInfo.created);
          meta.innerText = parseDate(parsed);
          modal.className = modal.className + " is-active";
          modalTarget = fileInfo;
        }

      };
    }



    function showList (folderInfo) {
      // Hide grid if shown
      gridParent.style.display = "none";
      listParent.style.display = "";
      // Remove previous list
      removeChildren(listData)

      if (folderInfo.children.length === 0 && folderInfo.files.length === 0) {
        const noContent = document.createElement("h2");
        noContent.className = "has-text-centered";
        noContent.innerText = "There are no items to display.";
        listData.appendChild(noContent);
      }
      // Generate new list
      for (let file of folderInfo.files) {
        addRow(file, false);
      }
      for (let folder of folderInfo.children) {
        addRow(folder, true);
      }

      function addRow (fileInfo, isFolder) {
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

        if (!isFolder) {
          // It's a file
          const nameLink = document.createElement("a")
          nameLink.appendChild(document.createTextNode(fileInfo.name))
          nameLink.href = `${BaseUrl}/files/${currentFolderId}/${fileInfo.loc}`
          name.appendChild(nameLink)

          // Makes the whole box 'click sensitive'
          name.addEventListener("click", function () {
            document.location.href = `${BaseUrl}/files/${currentFolderId}/${fileInfo.loc}`;
          })

          const arr = fileInfo.loc.split(".")
          if (arr.length > 1) {
            typeString = arr[arr.length - 1].toLowerCase()
          } else {
            typeString = "Unknown"
          }

        } else {
          // Folder
          name.appendChild(document.createTextNode(fileInfo.name))

          name.addEventListener("click", function () {
            setFolder(fileInfo.id)
          })

          typeString = "Folder"
        }

        row.appendChild(name)

        type.appendChild(document.createTextNode(typeString))
        row.appendChild(type)

        const created = document.createElement("td")

        const timeString = parseDate(new Date(fileInfo.created), true);
        created.appendChild(document.createTextNode(timeString))
        row.appendChild(created)

        const editRow = document.createElement("td")
        const editCog = document.createElement("span")
        editCog.className = "icon icon-cog clickable"
        editCog.addEventListener("click", function () {
          const modal = new EditModal(parent.document.body, fileInfo, function (deleted) {
            if (deleted) {
              setFolder(rootType)
            } else {
              setFolder(currentFolderId)
            }
          });
          modal.show()
        })

        editRow.appendChild(editCog)
        row.appendChild(editRow)

        listData.appendChild(row)
      }

    }

    async function addFolder () {
      const folderName = prompt("Please enter a name for the new folder.", "New folder")
      if (folderName) {
        // They didn't click cancel
        const res = await Api.post(`/files/${currentFolderId}`, {
          body: { name: folderName }
        })

        if (res.success) {
          setFolder(currentFolderId)
        } else {
          createErrorMessage(res.error.message)
        }
      } else {
        console.log(`Cancelled folder creation.`)
      }
    }

    async function fetchFolder (folderId) {
      const folder = await Api.get("/files/"+folderId)
      if (folder.error) {
        // Display error
        createErrorMessage(folder.error)
        return false;
      } else {
        return folder
      }

    }

    // Modal
    modal.getElementsByClassName("modal-background")[0].onclick = hideModal;
    modal.getElementsByClassName("modal-close")[0].onclick = hideModal;
    function hideModal () {
      modal.classList.remove("is-active");
    }

  })



  // Exported "Globals"
  return {


  }
})();

