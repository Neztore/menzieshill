import React, { FunctionComponent } from "react";

// Used when File explorers are being shown outside of the admin
// console, i.e. when being shown to 'members'.
interface ExplorerWrapperProps {
  title: string,
  subtitle: string
}
export const ExplorerWrapper: FunctionComponent<ExplorerWrapperProps> = ({ children, title, subtitle }) => (
  <div className="columns is-centered">
    <div className="column is-10">
      <h1 className="has-text-centered title">{title}</h1>
      <h2 className="has-text-centered subtitle">{subtitle}</h2>
      {children}
    </div>
  </div>

);
export default ExplorerWrapper;
