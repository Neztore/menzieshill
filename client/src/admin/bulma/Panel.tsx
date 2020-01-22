import React, {FunctionComponent} from "react";
import Icon, { IconProps } from './Icon'
import {Link} from "react-router-dom";

interface PanelProps {
    heading: string
}

export const Panel:FunctionComponent<PanelProps> = (props)=>{
    return <nav className="panel">
        <p className="panel-heading">
            {props.heading}
        </p>
        {props.children}
    </nav>
};
export interface BlockProps {
    name: string,
    icon: string,
    to: string,
    isActive?: boolean,
}
interface WithHandle extends BlockProps {
    handleClick: React.MouseEventHandler
}

export const PanelBlock:FunctionComponent<WithHandle> = (props)=>{
    return <div onClick={props.handleClick}>
        <Link to={`${props.to}`} className={`panel-block ${props.isActive ? "is-active":""}`}>
            <span><PanelIcon iconString={props.icon}/>{props.name}</span>
        </Link>
    </div>
};

export const PanelTabs:FunctionComponent<PanelProps> = (props)=>{
    return <div className="panel-tabs">
        {props.children}
    </div>
};

export const PanelIcon:FunctionComponent<IconProps> = (props)=>{
    return <span className="panel-icon">
        <Icon iconString={props.iconString}/>
    </span>
}

export default Panel