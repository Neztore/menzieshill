import React, { Fragment, FunctionComponent, useState } from "react";

import { parseDate } from "../../../../../public/js";
import { getExt } from "../../shared/util";
import { ConfigModal } from "./ConfigModal";
import { BaseUrl, getFolder } from "./api";
import { File, Folder } from "./types";

interface FileTableProps {
  folder: Folder,
  setFolder: Function,
  handleEditable?: Function,
  canEdit: boolean
}
const editable = ["js", "css", "json", "txt", "md", "html", "markdown"];
export const FileTable: FunctionComponent<FileTableProps> = ({
  folder, setFolder, handleEditable, canEdit
}) => {
  const [error, setError] = useState<string|undefined>();
  const [configTarget, setConfigTarget] = useState<File|Folder|null>(null);
  function configItem (item: File|Folder) {
    if (canEdit) {
      setConfigTarget(item);
    }
  }
  function configDone (changed: boolean) {
    if (changed) {
      changeFolder(folder.id).catch(console.error);
    }
    setConfigTarget(null);
  }
  async function changeFolder (newId: number) {
    try {
      const fold = await getFolder(newId);
      setFolder(fold);
    } catch (e) {
      if (e.http) {
        setError(`Failed to get folder: ${e.http.error.message}`);
      } else {
        setError(e.message);
      }
    }
  }
  // eslint-disable-next-line consistent-return
  function openFile (e: React.MouseEvent<HTMLAnchorElement>, file: File) {
    const ext = getExt(file.loc);
    if (ext && editable.includes(ext.toLowerCase()) && handleEditable && canEdit) {
      e.preventDefault();
      return handleEditable(folder.id, file);
    }
  }

  // Returns
  if (error) {
    return <p className="has-text-centered has-text-danger">{error}</p>;
  }
  return (
    <Fragment>
      {configTarget ? <ConfigModal target={configTarget} handleDone={configDone} /> : ""}
      <table className="table is-fullwidth is-hoverable">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Created</th>
            <th><span className="fas fa-cog" /></th>
          </tr>
        </thead>
        <tbody>
          {
        folder.children.map(fold => (
          <tr key={fold.id}>
            <td onClick={() => changeFolder(fold.id)} style={{ cursor: "pointer" }}>{fold.name}</td>
            <td>Folder</td>
            <td>{parseDate(fold.created)}</td>
            <td onClick={() => configItem(fold)}><span className="fas fa-cog" /></td>
          </tr>
        ))
      }

          {
        folder.files.map(file => (
          <tr key={file.loc}>
            <td>
              <a
                href={`${BaseUrl}/files/${folder.id}/${file.loc}`}
                onClick={e => openFile(e, file)}
                target="_blank"
                rel="noreferrer">{file.name === "" ? file.loc : file.name}
              </a>
            </td>
            <td>{getExt(file.loc) || "Unknown"}</td>
            <td>{parseDate(file.created)}</td>
            <td onClick={() => configItem(file)}><span className="fas fa-cog" /></td>
          </tr>
        ))
      }
        </tbody>
      </table>
      {
      folder.files.length === 0 && folder.children.length === 0
        ? <p className="has-text-centered">There are no items to display.</p>
        : ""

    }
    </Fragment>
  );
};
export default FileTable;
