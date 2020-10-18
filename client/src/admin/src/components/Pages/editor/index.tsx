/* eslint jsx-a11y/no-noninteractive-element-interactions: "off",
jsx-a11y/anchor-is-valid: "off", jsx-a11y/click-events-have-key-events: "off"
 */
import React, {
  Fragment, FunctionComponent, useEffect, useState
} from "react";

import { getExt } from "../../../shared/util";
import { editContentFile, getFile, uploadFiles } from "../../FileExplorer/api";
import { EditInfo } from "../index";
import { Editor } from "./EditInput";
import { Preview } from "./preview";

enum TabType {
  editor,
  preview
}
interface PageEditorProps {
  finishEditing: Function,
  fileInfo: EditInfo
}
export const PageEditor: FunctionComponent<PageEditorProps> = function PageEditor ({ fileInfo, finishEditing }) {
  const [currentTab, setTab] = useState<TabType>(TabType.editor);
  const [content, setContent] = useState<string|null>(null);
  const [name, setName] = useState<string>(fileInfo.file ? fileInfo.file.name : "");
  async function handleSave () {
    if (content === null) {
      throw new Error("Cannot save: No content!");
    } else if (fileInfo.file) {
      // PATCH
      await editContentFile(fileInfo.file.loc, content, name);
    } else if (content) {
      // POST
      // todo: add naming
      const ext = getExt(name) ? "" : ".md";
      const file = new File([content], `${name}${ext}`, { type: "text/plain" });
      await uploadFiles(fileInfo.parentId, [file]);
    }
    finishEditing();
  }

  useEffect(() => {
    (async function getInfo () {
      if (content === null) {
        // Fetch file info, if exists
        if (fileInfo.file) {
          const cont = await getFile(fileInfo.file.loc);
          if (cont) return setContent(cont);
        }
        return setContent("");
      }
      return undefined;
    }());
    return undefined;
  });
  if (content !== null) {
    return (
      <Fragment>
        <div className="columns">
          <div className="column is-6">
            <div className="field">
              <label className="label">File name</label>
              <input className="input" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="File name" />
            </div>
          </div>
        </div>
        <div className="tabs is-centered">
          <ul>
            <li className={currentTab === TabType.editor ? "is-active" : ""} onClick={() => setTab(TabType.editor)}>
              <a>Editor</a>
            </li>
            <li className={currentTab === TabType.preview ? "is-active" : ""} onClick={() => setTab(TabType.preview)}>
              <a>Preview</a>
            </li>
          </ul>
        </div>
        {currentTab === TabType.editor
          ? <Editor content={content} setContent={setContent} /> : <Preview content={content} />}

        <div className="buttons">
          <button className="button is-success" type="button" onClick={handleSave}>Save changes</button>
          <button className="button is-danger" type="button" onClick={() => finishEditing()}>Discard changes</button>
        </div>
      </Fragment>
    );
  }
  return <p className="has-text-grey has-text-centered">Loading file information...</p>;
};
export default PageEditor;
