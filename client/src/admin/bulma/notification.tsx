import React from "react";

interface notificationProps {
    hasClose?: boolean,
    children: any,
    colour?: string
}

export default function Notification (props: notificationProps) {
  return (
    <div className={`notification ${props.colour ? `is-${props.colour}` : ""}`}>
      {props.hasClose ? <button className="delete" /> : ""}
        {...props.children}
    </div>
  );
}
