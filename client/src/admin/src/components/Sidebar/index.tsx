import React from "react";
import { AdminPanel } from "./AdminPanel";
import UserBox from "./User";


export const Sidebar = ()=>{
    return <div className="sidebar">
        <UserBox/>
        <AdminPanel/>
    </div>
};
export default Sidebar
