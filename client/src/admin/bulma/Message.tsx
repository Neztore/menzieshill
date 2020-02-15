import React, {FunctionComponent} from "react";


export interface MessageProps   {
    colour?: "danger"|"warning"|"primary",
    title:string,
    text:string,
    delete?: React.MouseEventHandler
}

//const MessageStyle = {};

export const Message: FunctionComponent<MessageProps> = (props) =>{
    return (<article className={`message ${props.colour ? `is-${props.colour}`: ""}`}>
        <div className="message-header">
            <p>{props.title}</p>
            {props.delete ? <button onClick={props.delete} className="delete" aria-label="delete"/>:""}
        </div>
        <div className="message-body">
            {props.text}
        </div>
    </article>)
};
export default Message;