import React, {
  ChangeEvent, FunctionComponent, useEffect, useState
} from "react";

import { EditModal } from "../../../../bulma/EditModal";
import {deleteFile, deleteFolder, editFile, editFolder} from "../api";
import { File, Folder } from "../types";
import { AccessGroupEditor } from "./AccessGroupEditor";

interface ConfigModalProps {
  target: Folder|File,
  handleDone: Function
}
/*
    Required properties:
      - Groups
      - Rename
      - Delete
 */

export const ConfigModal:FunctionComponent<ConfigModalProps> = ({ target, handleDone }) => {
  const {
    accessGroups,
    name
  } = target;
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [updatedName, setName] = useState<string>(name);

  useEffect(() => {
    setName(name);
  }, [target]);
  let str = "";
  let small:string = "";
  let updateUrl;
  const isFolder: boolean = "id" in target;
  if (isFolder) {
    const folder = target as Folder;
    str = "Folder";
    small = `Id: ${folder.id}`;
    updateUrl = `/files/${folder.id}`;
  } else {
    str = "File";
    const file = target as File;
    small = `(${file.loc})`;
    updateUrl = `/files/par/files/${file.loc}`;
  }
  const title = `Editing ${target.name}`;
  async function handleSubmit () {
    // Submit new file name
    if (updatedName !== target.name) {
      setSubmitting(true);
      try {
        if (isFolder) {
          const fold = target as Folder;
          await editFolder(fold.id, updatedName);
        } else {
          const file = target as File;
          await editFile(file.loc, updatedName);
        }
      } catch (e) {
        console.error(e);
        console.error(e.http.error.message);
        alert(`Failed to edit file. Is file name valid?\n${e.http.error.message}`);
      }

      setSubmitting(false);
      handleDone(true);
    }
  }
  async function deleteItem () {
    const sure = confirm("Are you sure you want to delete this?");
    if (!sure) return;
    if (isFolder) {
      const fold = target as Folder;
      await deleteFolder(fold.id);
    } else {
      const file = target as File;
      await deleteFile(file.loc);
    }
    handleDone(true);
  }
  function handleChange (e: ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  return (
    <EditModal close={() => handleDone(false)} save={handleSubmit} isSubmitting={isSubmitting} title={title} delete={deleteItem}>
      <p className="has-text-centered"><small>{small}</small></p>
      <br/>
      <label htmlFor="item-name" className="label">{str} name</label>
      <input className="input" type="text" placeholder="Item name" name="name" id="item-name" value={updatedName} onChange={handleChange} />
      <AccessGroupEditor groups={accessGroups} updateUrl={updateUrl} />
    </EditModal>
  );
};
export default ConfigModal;
