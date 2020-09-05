import React, { Fragment, FunctionComponent } from "react";

interface EditorProps {
  setContent: Function,
  content: string

}
export const Editor: FunctionComponent<EditorProps> = function Editor ({ setContent, content }) {
  console.log(`COntent: ${content}`)
  return (
    <Fragment>
      <p>You can use all <a href="https://www.markdownguide.org/cheat-sheet/">Markdown</a> styles here,
        in addition to HTML code. You can upload images by using the buttons above or by dragging and dropping them.
      </p>
      <p>The first &quot;big&quot; title (#) will specify the page title,
        while <code>desc:Page description</code> can be used to specify page description.
        These values are used for the meta tags (visible to Search engines and when the link is used on social media)
      </p>
      <p>You should take care when editing any HTML code here as it is likely part of the original site
        and you may have an adverse affect on page layout.
        All of the pages will load the global CSS including <a href="https://bulma.io">Bulma</a> styles and the global javascript. You can specify additional styles and scripts as desired.
      </p>
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        className="page-editor-textarea textarea" />
    </Fragment>
  );
};
export default Editor;
