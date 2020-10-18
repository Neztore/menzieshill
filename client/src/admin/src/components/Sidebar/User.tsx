import React, { FunctionComponent, useContext } from "react";

import UserContext from "../../context/UserContext";

const UserBoxStyle = {
  paddingLeft: "1em",
  paddingBottom: "0.2em"
};
//
export const UserBox: FunctionComponent = () => {
  const info = useContext(UserContext);

  if (info) {
    return (
      <div style={UserBoxStyle}>
        <p className="title is-5">Hello, {info.firstName || `Loading...`}!</p>
        <p className="subtitle is-6">{info.username}</p>

      </div>
    );
  }
  return <p>Loading user info...</p>;
};
export default UserBox;
