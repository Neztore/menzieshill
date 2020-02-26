import React, {useEffect, useState} from "react";
import * as Api from '../../../../js/apiFetch'
import { User } from '../../shared/Types'
import { Message } from "../../../bulma/Message";

const UserBoxStyle = {
    paddingLeft: "1em",
    paddingBottom: "0.2em"
};



export const UserBox = ()=>{
    const [info, setInfo] = useState<any>();

    useEffect(() => {
        (async function() {
            if (!info) {
                const userInfo:User = await Api.get("/users/@me");
                setInfo(userInfo)
            }

        })()
    });
    if (info) {
        if (info.error) {
            if (info.error.status === 401) {
                document.location.href = "/login";
                return ""
            }
            return <Message title={`${info.error.status}: Oops! Something went wrong.`} text={info.error.message} colour="danger"/>
        }
        return <div style={UserBoxStyle}>
            <p className="title is-5">Hello, {info.firstName || `Loading...`}!</p>
            <p className="subtitle is-6">{info.username}</p>

        </div>
    } else {
        return <p>Loading user info...</p>
    }

};
export default UserBox