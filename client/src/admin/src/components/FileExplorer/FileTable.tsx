import React, {FunctionComponent, useState, Fragment} from "react";
import {Folder, File} from "./types";
import { getExt } from "../../shared/util";
import { parseDate } from "../../../../../public/js";
import {getFolder, BaseUrl} from "./api";

interface FileTableProps {
  folder: Folder,
  setFolder: Function,
  handleEditable?: Function
}
const editable = ["js", "css", "json", "txt", "md", "html", "markdown"]
export const FileTable: FunctionComponent<FileTableProps> = ({folder, setFolder, handleEditable}) => {
  const [error, setError] = useState<string|undefined>();
  function configItem (item: File|Folder) {


  }
  async function changeFolder (newId: number) {
    try {
      const folder = await getFolder(newId);
      setFolder(folder);
    } catch (e) {
      if (e.http) {
        setError(`Failed to get folder: ${e.http.error.message}`)
      } else {
        setError(e.message);
      }
    }
  }
  function openFile(e: React.MouseEvent<HTMLAnchorElement>, file: File) {
    const ext = getExt(file.loc);
    if (ext && editable.includes(ext.toLowerCase()) && handleEditable) {
      e.preventDefault();
      return handleEditable(file);
    }
  }

  // Returns
  if (error) {
    return <p className="has-text-centered has-text-danger">{error}</p>
  }
  return (<Fragment>
    <table className="table is-fullwidth is-hoverable">
    <thead>
      <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Created</th>
        <th><span className="fas fa-cog"/></th>
      </tr>
    </thead>
    <tbody>
      {
        folder.children.map((folder)=> (
          <tr style={{cursor: "pointer"}} key={folder.id}>
            <td onClick={()=>changeFolder(folder.id)}>{folder.name}</td>
            <td>Folder</td>
            <td>{parseDate(folder.created)}</td>
            <td onClick={()=>configItem(folder)}><span className="fas fa-cog"/></td>
          </tr>))
      }

      {
        folder.files.map((file)=> (
            <tr key={file.loc}>
              <td>
                <a
                    href={`${BaseUrl}/files/${folder.id}/${file.loc}`}
                    onClick={(e)=>openFile(e, file)}
                    target="_blank"
                    rel="noreferrer"
                >{file.name === "" ? file.loc : file.name}</a>
              </td>
              <td>{getExt(file.loc) || "Unknown"}</td>
              <td>{parseDate(file.created)}</td>
              <td onClick={()=>configItem(file)}><span className="fas fa-cog"/></td>
            </tr>))
      }
    </tbody>
  </table>
    {
      folder.files.length === 0 && folder.children.length === 0 ?
          <p className="has-text-centered">There are no items to display.</p>
          :
          ""

    }
  </Fragment>);
};

