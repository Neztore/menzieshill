import React, {useEffect, useState} from "react";
import * as Api from '../../../../js/apiFetch'
import { User } from '../../shared/Types'

const UserBoxStyle = {
    paddingLeft: "1em",
    paddingBottom: "0.2em"
};

import { Message } from "../../../bulma/Message";

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