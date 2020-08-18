import React, {FunctionComponent} from "react";
import marked from "marked";

interface PreviewProps {
  content: string
}
export const Preview: FunctionComponent<PreviewProps> = function ({ content}) {
  let highestLevel = 100;
  let title = "No title"
  let description = "Menzieshill Whitehall Swimming and Water Polo club is an amateur sports club in Dundee, Scotland."
  const renderer = {
    heading(text: string, level: number) {
      if (level < highestLevel && text) {
        title = text;
        highestLevel = level;
      }
      return `<h${level}>${text}</h${level}>`
    },
    // We disregard code blocks mainly because they get in the way of rendering pretty HTML blocks.
    // The inline code still works, but the <code> and ``` won't. Neither will a load of spaces.
    code(text: string) {
      return text
    }
  };
  marked.setOptions({
    pedantic: false,
    sanitize: false,
    smartLists: true,
    mangle: true
  });
  // @ts-ignore
  marked.use({renderer})
   const newLines = content.split(new RegExp("(\\r\\n|\\r|\\n)"))
  for (let counter = 0; counter < newLines.length; counter++) {
    const text = (newLines[counter] || "").toLowerCase()
    if (text.startsWith("desc:") || text.startsWith("description:")) {
      const pos = text.indexOf(":");
      const parsed = text.substr(pos + 1);
      description = parsed;
      newLines[counter] = parsed;
      break;
    }
  }
  content = newLines.join("\n");

  const html = marked(content)
  // todo: write global styles?
  function newTab () {
    const newWindow = window.open("", "Page preview");
    if (newWindow) {
      newWindow.document.body.innerHTML = html;
    }
  }
  return (<div>
    <h2 className="is-size-5">{title}</h2>
    <p><strong>Description</strong>: {description}</p>
    <p>While this is the best representation of what the page will look like, the actual layout may differ.</p>
    <div className="content preview" dangerouslySetInnerHTML={{__html: html}} />
    <div className="buttons">
      <button className="button is-success">Save changes</button>
      <button className="button" onClick={newTab}>Open in new tab</button>
      <button className="button is-danger">Discard changes</button>
    </div>
  </div>)
}
export default Preview;
