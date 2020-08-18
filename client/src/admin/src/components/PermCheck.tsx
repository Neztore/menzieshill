import React, { FunctionComponent, useContext } from "react";

import Message from "../../bulma/Message";
import UserContext from "../context/UserContext";
import { PermString } from "../shared/Types";

interface PermCheckProps {
    requiredPerm: PermString,
    errorMessage?: string
}

export const PermCheck:FunctionComponent<PermCheckProps> = ({ children, requiredPerm, errorMessage }) => {
  const user = useContext(UserContext);
  if (!user) return <p className="has-text-centered">Loading...</p>;
  const { perms } = user;
  if (perms && (perms[requiredPerm] || perms.admin)) {
    return (
      <div>
        {children}
      </div>
    );
  }
  return (
    <div className="columns is-mobile is-centered">
      <div className="column is-8">
        <Message
          title="Error: You do not have access to that resource."
          text={errorMessage || `You lack permission "${requiredPerm}" so cannot access this page. If you believe you should have access, please contact a site administrator.`}
          colour="danger" />
      </div>
    </div>
  );
};
export default PermCheck;
