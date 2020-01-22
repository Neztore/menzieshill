import React, {FunctionComponent} from "react";


export interface IconProps   {
    iconString: string
}

export const Icon: FunctionComponent<IconProps> = (props) =>{
    return <i className={`icon ${props.iconString}`}/>
};
export default Icon;