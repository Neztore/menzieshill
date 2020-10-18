import React, { FunctionComponent, useEffect, useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import * as Api from "../../../../public/js/apiFetch";
import { Message } from "../../bulma/Message";
import { UserProvider } from "../context/UserContext";
import { HttpError, User } from "../shared/Types";
import { PanelRouter } from "./Router";
import { Sidebar } from "./Sidebar";

const leftStyle = {
  backgroundColor: "#fbfbfb",
  height: "100vh"
};
export const AdminRoot:FunctionComponent = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<HttpError|undefined>();
  useEffect(() => {
    (async function checkLogin () {
      console.log("Admin.tsx: GET /@me");
      const userInfo:User|HttpError = await Api.get("/users/@me");
      if ("error" in userInfo) {
        setError(userInfo);
      } else {
        setUser(userInfo);
      }
    }());
  }, []);
  if (error) {
    if (error.error.status === 401) {
      return <Redirect to="/login" />;
    }
    return <Message title={`${error.error.status}: Oops! Something went wrong.`} text={error.error.message} colour="danger" />;
  }
  if (!user) {
    return <p>Loading...</p>;
  }
  return (
    <UserProvider value={user}>
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
    </UserProvider>
  );
};
export default AdminRoot;
