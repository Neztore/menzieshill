import  React from "react";
import { UserList } from "./UserList";

export function Users() {
    console.log("User mount")
    return <div>
        <h1 className="title is-3">User management</h1>
        <p>Use this menu to grant access to files and update the information and permission of website users.</p>
        <p>To grant access to member-only files, grant the <code>Member</code> group. Additional groups can be added by contacting Josh.</p>
        <UserList/>
    </div>
}
export  default Users
