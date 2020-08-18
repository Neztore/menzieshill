import React, {FunctionComponent, useEffect, useState} from "react";
import ExplorerLevel from "./ExplorerLevel";
import {Folder} from "./types";
import {getFolder, uploadFiles} from "./api";
import {FileTable} from "./FileTable";
import UploadModal from "./UploadModal";

interface FileExplorerProps {
  root: string,
  handleEditable?: Function
}

interface UploadInfo {
  info: string,
  controller?: AbortController
}

export const FileExplorer: FunctionComponent<FileExplorerProps> = ({root, handleEditable}) => {
  // Hooks
  const [folder, setFolder] = useState<Folder|undefined>();
  const [error, setError] = useState<string|undefined>();
  const [uploadInfo, setUpload] = useState<UploadInfo|undefined>();

  useEffect(function () {
    getInfo(root);
    return undefined
  }, [root])

  // Functions
  async function getInfo(id: string|number) {
    try {
      const folder = await getFolder(id);
      setFolder(folder);
    } catch (e) {
      if (e.http) {
        setError(`${e.http.error.status}: ${e.http.error.message}`)
      } else {
        setError(e.message);
      }
    }
  }

  async function handleUpload (files: FileList) {
    // Not all Browsers support AbortController.
    const controller: AbortController|undefined= AbortController ? new AbortController() : undefined
    setUpload({
      info: files.length > 1 ? `${files.length} files` : files[0].name,
      controller
    })
    if (!folder) {
      throw new Error("Folder is not set!");
    }
    try {
      await uploadFiles(folder.id, files, controller);
    } catch (e) {
      console.error(e);
      setError(e.message);
    }
    getInfo(folder.id);
    setUpload(undefined);
  }

  function discardEvent(e:any) {
    e.stopPropagation();
    e.preventDefault();
    return false;
  }
  function handleDrop(e: React.DragEvent) {
    discardEvent(e);
    const files = e.dataTransfer.files;
    handleUpload(files);
  }

  // See about a way to split this into more files
  // Maybe: Use children?

  // Hide editing features if no access
  // Configuration modal
  // File 'path'
  //   * Server
  //   * Client

  // Integrate using the callback with the file editor
  // Add file name set input
  // Move to new system
  /*
      * API is global?
      * Every file has global JS.
      * Figure out something with Calendar/Posts
   */
  // Test all
  // Move all file browsers? (Probably won't bother with this, for now at least. The other one works!)
  // Rename 'admin' to dashboard?

  // Returns
  if (uploadInfo) {
    function cancelUpload () {
      if (uploadInfo && uploadInfo.controller) {
        uploadInfo.controller.abort();
        setUpload(undefined);
      }
    }
    return <UploadModal info={uploadInfo.info} handleCancel={cancelUpload} />
  }
  if (error) {
    return <div className="has-text-centered has-text-danger">
      <p className="is-size-3 has-text-centered">Oops! something went wrong.</p>
      <p className="has-text-centered">{error}</p>
    </div>
  }
  if (!folder) {
    return <p className="has-text-centered has-text-grey">Loading...</p>
  }
  return (<div className="file-explorer"
               onDrag={discardEvent}
               onDragEnter={discardEvent}
               onDragOver={discardEvent}
               onDrop={handleDrop}
  >
    <ExplorerLevel folderId={folder.id} handleUpload={handleUpload} handleEditable={handleEditable} refresh={getInfo}/>
    <FileTable folder={folder} setFolder={setFolder} handleEditable={handleEditable}/>


  </div>);
};
export default FileExplorer;
