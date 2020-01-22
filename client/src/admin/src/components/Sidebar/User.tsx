import React, {useEffect, useState} from "react";
import * as Api from '../../../../js/apiFetch'

const UserBoxStyle = {
    paddingLeft: "1em",
    paddingBottom: "0.2em"
};

interface User {
    firstName: string,
    lastName: string,
    username: string
}

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
            return <h2>Error: {info.error.message}</h2>
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