import React, {FunctionComponent, useEffect, useState} from "react";
import {HttpError, User} from '../shared/Types'
import Sidebar from "./Sidebar";
import PanelRouter from "./Router";
import {UserProvider} from "../context/UserContext";
import * as Api from "../../../../public/js/apiFetch";
import {Message} from "../../bulma/Message";

const leftStyle = {backgroundColor: "#fbfbfb", height:"100vh"}
export const App:FunctionComponent = () => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<HttpError|undefined>();
    useEffect(() => {
        (async function() {
            const userInfo:User|HttpError = await Api.get("/users/@me");
            if ("error" in userInfo) {
                if (userInfo.error.status === 401) {
                    document.location.href = "/login";
                }
                setError(userInfo);
            } else {
            setUser(userInfo)
        }
        })()
    }, []);
    if (error) {
        if (error.error.status === 401) {
            return <p>Redirecting...</p>
        } else {
            return <Message title={`${error.error.status}: Oops! Something went wrong.`} text={error.error.message} colour="danger"/>
        }
    }
    return <UserProvider value={user}>
        <div className='columns'>
            <div className='column is-3 fullHeight' style={leftStyle}>
                <Sidebar />
            </div>
            <div className='column admin-right' style={{ marginRight: '0.5em' }}>
                <PanelRouter />
            </div>
        </div>

    </UserProvider>



}
export default App