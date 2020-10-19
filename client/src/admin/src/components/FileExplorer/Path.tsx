import React, { FunctionComponent } from "react";

import { Folder } from "./types";

interface FolderPathProps {
  folder: Folder,
  setFolderId: Function
}

export const FolderPath: FunctionComponent<FolderPathProps> = ({ folder, setFolderId }) => {
  if (!folder.path) {
    return (
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <li className="is-active">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="#">{cleanName(folder.name)}</a>
        </li>
      </nav>
    );
  }
  function cleanName (folderName: string) {
    return folderName.replace("_ROOT", "");
  }

  return (
    <nav className="breadcrumb" aria-label="breadcrumbs">
      <ul>
        {
      folder.path.map(i => (
        <li className={i.id === folder.id ? "is-active" : ""}>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a
            href="#"
            onClick={() => setFolderId(i.id)}>{cleanName(i.name)}
          </a>
        </li>
      ))
    }
      </ul>
    </nav>
  );
};
export default FolderPath;
