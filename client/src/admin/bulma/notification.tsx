import React from "react";

interface notificationProps {
    hasClose?: boolean,
    children: any
}

export default function (props: notificationProps) {
    return <div className="notification is-warning">
        {props.hasClose ? <button className="delete"/> : ""}
        {props.children}
    </div>
}