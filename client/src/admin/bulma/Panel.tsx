import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";

import Icon, { IconProps } from "./Icon";

interface PanelProps {
    heading: string,
    colour?: string
}

export const Panel:FunctionComponent<PanelProps> = ({ heading, children, colour }) => (
  <nav className={`panel ${colour ? `is-${colour}` : ""}`}>
    <p className="panel-heading">
      {heading}
    </p>
    {children}
  </nav>
);
export interface BlockProps {
    name: string,
    icon: string,
    to: string,
    isActive?: boolean,
}
interface WithHandle extends BlockProps {
    handleClick: React.MouseEventHandler
}

export const PanelBlock:FunctionComponent<WithHandle> = props => (
  <div onClick={props.handleClick}>
    <Link to={`${props.to}`} className={`panel-block ${props.isActive ? "is-active" : ""}`}>
      <span><PanelIcon iconString={props.icon} />{props.name}</span>
    </Link>
  </div>
);

export const PanelTabs:FunctionComponent<PanelProps> = props => (
  <div className="panel-tabs">
    {props.children}
  </div>
);

export const PanelIcon:FunctionComponent<IconProps> = props => (
  <span className="panel-icon">
    <Icon iconString={props.iconString} />
  </span>
);

export default Panel;
