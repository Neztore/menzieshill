import React, {FunctionComponent} from "react";


export interface IconProps   {
    iconString: string,
    size?: string
}

export const Icon: FunctionComponent<IconProps> = (props) =>{
    return <i className={`icon ${props.iconString} ${props.size ? `is-${props.size}`:""}`}/>
};
export default Icon;