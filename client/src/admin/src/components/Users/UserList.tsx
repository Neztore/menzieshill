import React, {useEffect, useState} from "react";
import {UserRow} from "./UserRow";
import * as Api from '../../../../../public/js/apiFetch'
import {UserModal} from "./ModifyUser/UserModal";
import {User} from "../../shared/Types";

const GroupsStyle = {
    minWidth: "15em"
};

export function UserList() {
    const [users, setUsers] = useState([]);
    const [modalItem, setModalItem] = useState();


    useEffect(function(){

                (async function doIt() {
                    console.log("Fetching users...");
                    const users = await Api.get("/users")
                    if (users.success) {
                        setUsers(users.users)
                    } else {
                        throw new Error(users.error.message)
                    }
                })();

    }, [modalItem]);
    function saveChanges(newUser: User) {
        // If newUser is false, modal was just closed.
        if (newUser) {
           //TODO: Update user value. Refresh it?
        }
        setModalItem(false)
    }

    return <div>
        {modalItem ? <UserModal user={modalItem} handleDone={saveChanges}/>:""}
        <div className="columns">
            <div className="column is-7 ">
                <table className="table is-hoverable is-fullwidth">
                    <thead>
                    <tr>
                        <th>Username</th>
                        <th>Full name</th>
                        <th style={GroupsStyle}>Groups</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        users.map((u: User)=>
                            <UserRow user={u} key={u.id} handleClick={setModalItem}/>
                        )
                    }



                    </tbody>
                </table>

            </div>


        </div>
    </div>
}
export  default UserList
