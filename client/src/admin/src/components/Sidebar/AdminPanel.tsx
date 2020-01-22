import React, {useState, FunctionComponent} from "react";
import {Panel, PanelBlock} from "../../../bulma/Panel";
import { BlockProps } from '../../../bulma/Panel'

interface AdminBlockProps extends BlockProps{
    handleClick: Function,
    current: string
}

const AdminBlock:FunctionComponent<AdminBlockProps> = (props) => {
    //useCurrentItem("Home", true);
    return (<PanelBlock isActive={props.name === props.current} {...props} handleClick={()=>props.handleClick(props.name)}/>)
};

export const AdminPanel:FunctionComponent = () => {
    const [currentItem, setCurrentItem] = useState("Home");
    function clicked(n:string) {
        setCurrentItem(n)
    }

    return <Panel heading="Admin console">
        <AdminBlock icon="fas fa-home" name="Home" to="/admin" handleClick={clicked} current={currentItem}/>
        <AdminBlock icon="fas fa-users" name="Users" to="/admin/users" handleClick={clicked} current={currentItem}/>
        <AdminBlock icon="fas fa-calendar" name="Calendar" to="/admin/calendar" handleClick={clicked} current={currentItem}/>
        <AdminBlock icon="fas fa-comment" name="Posts" to="/admin/posts" handleClick={clicked} current={currentItem}/>

    </Panel>
};
export default AdminPanel