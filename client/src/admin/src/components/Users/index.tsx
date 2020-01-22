import  React from "react";
import { UserList } from "./UserList";

export function Users() {
    return <div>
        <h1 className="title is-3">User management</h1>
        <UserList/>
    </div>
}
export  default Users