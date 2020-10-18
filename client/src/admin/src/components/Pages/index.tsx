import React, { useState } from "react";

import "./pages.scss";
import { FileExplorer } from "../FileExplorer";
import { File } from "../FileExplorer/types";
import { PageEditor } from "./editor";

export interface EditInfo {
  parentId: number,
  file?: File
}

export function Pages () {
  const [editInfo, setEditing] = useState<EditInfo|undefined>();
  async function openForEditing (parentId: number, file: File|undefined) {
    if (file) {
      return setEditing({
        parentId,
        file
      });
    }
    return setEditing({ parentId });
  }
  const finishEditing = () => setEditing(undefined);
  if (editInfo) {
    return (
      <div className="pages">
        <PageEditor finishEditing={finishEditing} fileInfo={editInfo} />
      </div>
    );
  }
  return (
    <div className="pages">
      <h1 className="title is-3">Pages</h1>
      <p>You can use this tab to upload, edit and configure publicly viewable pages and assets on the site.</p>
      <div className="notification is-warning">
        <strong>Warning</strong>: File permissions do not apply here. If you have a restricted document, upload it in the documents section.
      </div>
      <FileExplorer root="content" handleEditable={openForEditing} />
    </div>
  );
}
export default Pages;
