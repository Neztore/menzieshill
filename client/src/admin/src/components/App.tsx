import React, { FunctionComponent, useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";

import * as Api from "../../../../public/js/apiFetch";
import { Message } from "../../bulma/Message";
import { UserProvider } from "../context/UserContext";
import { HttpError, User } from "../shared/Types";
import { AdminRoot } from "./Admin";
import { Login } from "./Authentication/Login";
import { Register } from "./Authentication/Register";
import { FileExplorer } from "./FileExplorer";
import { ExplorerWrapper } from "./FileExplorer/ExplorerWrapper";

export const App:FunctionComponent = () => {
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
    if (error.error.status !== 401) {
      return <Message title={`${error.error.status}: Oops! Something went wrong.`} text={error.error.message} colour="danger" />;
    }
  }
  if (!user) {
    return (
      <div>
        <p className="has-text-centered has-text-grey is-size-3">Loading...</p>;
        <p className="has-text-centered is-small">Not loading? Check your network connection or adblocker.</p>
      </div>
    );
  }
  return (
    <UserProvider value={user}>
      <Switch>
        <Route path="/login" exact>
          <Login />
        </Route>
        <Route path="/register" exact>
          <Register />
        </Route>
        <Route path="/archive" exact>
          <ExplorerWrapper
            title="Club archives"
            subtitle="Find old documents and archived content here.">
            <FileExplorer root="archive" />
          </ExplorerWrapper>
        </Route>
        <Route path="/photos" exact>
          <ExplorerWrapper
            title="Photos hub"
            subtitle="Find a variety of pictures from around the club here.">
            <FileExplorer root="photos" />
          </ExplorerWrapper>
        </Route>
        <Route path="/documents" exact>
          <ExplorerWrapper
            title="Documents home"
            subtitle="You can find important policies and documents here.">
            <FileExplorer root="docs" />
          </ExplorerWrapper>

        </Route>
        <Route>
          <AdminRoot />
        </Route>
      </Switch>
    </UserProvider>
  );
};
export default App;
