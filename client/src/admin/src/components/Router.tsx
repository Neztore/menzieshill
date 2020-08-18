import React from "react";
import { Redirect, Route, Switch } from "react-router";

import AccountPage from "./Account";
import { Calendar } from "./Calendar";
import Home from "./Home";
import Pages from "./Pages";
import PermCheck from "./PermCheck";
import Posts from "./Posts";
import Users from "./Users";

export const PanelRouter = () => (
  <Switch>
    <Route exact path="/">
      <Redirect to="/" />
    </Route>

    <Route exact path="/admin">
      <PermCheck requiredPerm="member" errorMessage="This console is for those with edit access, and you current lack 'member' permission.">
        <Home />
      </PermCheck>

    </Route>
    <Route path="/admin/users">
      <PermCheck requiredPerm="admin">
        <Users />
      </PermCheck>

    </Route>
    <Route path="/admin/calendar">
      <PermCheck requiredPerm="manageEvents">
        <Calendar />
      </PermCheck>

    </Route>
    <Route path="/admin/posts">
      <PermCheck requiredPerm="managePosts">
        <Posts />
      </PermCheck>
    </Route>

    <Route path="/admin/pages">
      <PermCheck requiredPerm="manageFiles">
        <Pages />
      </PermCheck>
    </Route>

    <Route path="/admin/account">
      <AccountPage />
    </Route>

    <Route path="/">
      <h2 className="title is-size-3 has-text-centered"><code>404</code> Oops! I couldn't find what you were looking for.</h2>
      <p className="has-text-centered">Please check the URL and try again. If you followed a link here, please let me know.</p>
    </Route>
  </Switch>
);
export default PanelRouter;
