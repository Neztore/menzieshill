import React, {FunctionComponent} from "react";
import { User } from '../../shared/Types'


interface UserRowProps {
    user: User,
    handleClick: Function
}
const RowStyle = {
    cursor: "pointer"
}

export const UserRow:FunctionComponent<UserRowProps> = (props) => {
    const {
        username,
        firstName,
        lastName,
        groups
    } = props.user;



    return <tr style={RowStyle} onClick={()=>props.handleClick(props.user)}>
        <td>{username}</td>
        <td>{firstName} {lastName}</td>
        <td>
            <div className="tags">
                {groups.map((grp)=> <span className="tag  " key={`${grp.id}-${Math.floor(Math.random() * 1000)}`}>{grp.name}</span>)}
            </div>
            </td>

    </tr>


}
export default UserRow