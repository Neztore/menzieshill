import React from "react";
import { Route, Switch } from "react-router";

import { AccountPage } from "./Account";
import { Calendar } from "./Calendar";
import { Home } from "./Home";
import { Pages } from "./Pages";
import { PermCheck } from "./PermCheck";
import { Posts } from "./Posts";
import { Users } from "./Users";

export const PanelRouter = () => (
  <Switch>
    <Route exact path="/">
      <PermCheck requiredPerm="member" errorMessage="This console is for those with edit access, and you current lack 'member' permission.">
        <Home />
      </PermCheck>

    </Route>
    <Route path="/users">
      <PermCheck requiredPerm="admin">
        <Users />
      </PermCheck>

    </Route>
    <Route path="/calendar">
      <PermCheck requiredPerm="manageEvents">
        <Calendar />
      </PermCheck>

    </Route>
    <Route path="/posts">
      <PermCheck requiredPerm="managePosts">
        <Posts />
      </PermCheck>
    </Route>

    <Route path="/pages">
      <PermCheck requiredPerm="manageFiles">
        <Pages />
      </PermCheck>
    </Route>

    <Route path="/account">
      <AccountPage />
    </Route>

    <Route path="/">
      <h2 className="title is-size-3 has-text-centered"><code>404</code> Oops! I couldn&apos;t find what you were looking for.</h2>
      <p className="has-text-centered">Please check the URL and try again. If you followed a link here, please let me know.</p>
    </Route>
  </Switch>
);
export default PanelRouter;
