import React, {useState} from "react";
import Editor from "./editor";
import "./pages.scss";
import Preview from "./preview";
import FileExplorer from "../FileExplorer";

enum TabType {
  editor,
  preview
}
export function Pages () {
  const [currentTab, setTab] = useState<TabType>(TabType.editor);
  const [content, setContent] = useState<string>("");
  return (
    <div className="pages">
      <h1 className="title is-3">Pages</h1>
      <p>I suspect this will be rather complex...</p>
      <FileExplorer root="docs"/>
      {/*
        <div className="tabs is-centered">
          <ul>
            <li className={currentTab === TabType.editor ? "is-active":""} onClick={()=>setTab(TabType.editor)}><a>Editor</a></li>
            <li className={currentTab === TabType.preview ? "is-active":""} onClick={()=>setTab(TabType.preview)}><a>Preview</a></li>
          </ul>
        </div>
        {currentTab === TabType.editor ?
            <Editor content={content} setContent={setContent} />: <Preview content={content} />
        }*/}
      </div>
  );
}
export default Pages;
