import React, { useState } from "react";

import "./pages.scss";
import { FileExplorer } from "../FileExplorer";
import { File } from "../FileExplorer/types";
import PageEditor from "./editor";

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
    console.log("new");
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
      <p>I suspect this will be rather complex...</p>
      <FileExplorer root="content" handleEditable={openForEditing} />
    </div>
  );
}
export default Pages;
