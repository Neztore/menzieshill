import React, {FunctionComponent, Fragment} from "react";
import FileDropdown from "./FileDropdown";
import {createFolder} from "./api";

interface ExplorerLevelProps {
  folderId: number,
  handleUpload: Function,
  handleEditable?: Function,
  refresh: Function,
  canEdit: boolean
}

export const ExplorerLevel: FunctionComponent<ExplorerLevelProps> = ({handleEditable, handleUpload, folderId, refresh, canEdit}) => {
  async function addFolder () {
    const folderName = prompt("Please enter a name for the new folder.", "New folder")
    if (folderName) {
      // They didn't click cancel
      try {
        await createFolder(folderId, folderName);
        refresh(folderId);
      } catch (e) {
        alert(e.http ? e.http.error.message : e.message);
      }
    } else {
      console.log(`Cancelled folder creation.`)
    }
  }
  return (<div className="level">
    <div className="level-left">
      {canEdit ?
          (<Fragment><div className="level-item">
            <FileDropdown handleEdit={handleEditable} handleUpload={handleUpload} />
          </div>
            <div className="level-item">
              <button className="button" onClick={addFolder}>Add folder</button>
            </div></Fragment>)
          :
          ""
      }
    </div>

    <div className="level-right">
      <div className="level-item">
        <div className="field has-addons">
          <p className="control">
            <button className="button is-active">
              <span>List view</span>
            </button>
          </p>
          <p className="control">
            <button className="button">
              <span>Grid view</span>
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>);
};
export default ExplorerLevel;
