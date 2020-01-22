import React from "react";
import { AdminPanel } from "./AdminPanel";
import { UserBox } from "./User";

const SidebarStyle = {
    marginLeft: "0.2em"
};

export const Sidebar = ()=>{
    return <div style={SidebarStyle}>
        <UserBox/>
        <AdminPanel/>
    </div>
};
export default Sidebar