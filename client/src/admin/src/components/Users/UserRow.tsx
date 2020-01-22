import React, {FunctionComponent} from "react";

interface Group {
    id: number,
    name: string
}

interface UserRowProps {
    user: {
        firstName: string,
        lastName: string
        id: number,
        username: string,
        accessGroups: Array<Group>
    }
}
const RowStyle = {
    cursor: "pointer"
}

export const UserRow:FunctionComponent<UserRowProps> = (props) => {
    const {
        username,
        firstName,
        lastName,
        accessGroups
    } = props.user;
    return <tr style={RowStyle}>
        <td>{username}</td>
        <td>{firstName} {lastName}</td>
        <td>
            <div className="tags">
                {accessGroups.map((grp)=> <span className="tag  " key={`${grp.id}-${Math.floor(Math.random() * 1000)}`}>{grp.name}</span>)}
            </div>
            </td>

    </tr>


}
export default UserRow