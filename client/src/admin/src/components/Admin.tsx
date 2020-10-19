import React, { FunctionComponent, useContext } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import UserContext from "../context/UserContext";
import { PanelRouter } from "./Router";
import { Sidebar } from "./Sidebar";

const leftStyle = {
  backgroundColor: "#fbfbfb",
  height: "100vh"
};
export const AdminRoot:FunctionComponent = () => {
  const user = useContext(UserContext);

  // AdminRoot is only rendered for actual admin routes, so this works.
  if (!user) {
    console.log("redir!");
    return <Redirect to="/login" />;
  }
  return (

    <Switch>
      <Route>
        <div className="columns">
          <div className="column is-3 fullHeight" style={leftStyle}>
            <Sidebar />
          </div>
          <div className="column admin-right" style={{ marginRight: "0.5em" }}>
            <PanelRouter />
          </div>
        </div>
      </Route>
    </Switch>
  );
};
export default AdminRoot;
