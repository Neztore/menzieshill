import  React from "react";
import {UserRow} from "./UserRow";

const GroupsStyle = {
    minWidth: "15em"
};

export function UserList() {
    return <div className="columns">
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
                <UserRow user={{username: "Test", firstName: "Josh", lastName: "Muir", id: 1, accessGroups:[{name: "Test"}, {name: "Admin"}, {name: "Swmimming"}]}}/>
                <UserRow user={{username: "Test", firstName: "Josh", lastName: "Muir", id: 1, accessGroups:[{name: "Test"}, {name: "Admin"}, {name: "Swmimming"}]}}/>
                <UserRow user={{username: "Test", firstName: "Josh", lastName: "Muir", id: 1, accessGroups:[{name: "Test"}, {name: "Admin"}, {name: "Swmimming"}]}}/>

                </tbody>
            </table>

        </div>


    </div>
}
export  default UserList