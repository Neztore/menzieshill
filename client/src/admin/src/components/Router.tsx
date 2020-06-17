import {Route, Switch, Redirect} from "react-router";
import Home from "./Home";
import React, {useContext} from "react";
import Users from "./Users";
import Calendar from "./Calendar";
import AccountPage from "./Account";
import Posts from "./Posts";

import PermCheck from "./PermCheck";

export const PanelRouter = ()=> {
    return <Switch>
        <Route exact path="/">
            <Redirect to="/"/>
        </Route>

        <Route exact path="/admin">
            <PermCheck requiredPerm="member" errorMessage="This console is for those with edit access, and you current lack 'member' permission.">
                <Home />
            </PermCheck>

        </Route>
        <Route path="/admin/users">
            <PermCheck requiredPerm="admin">
                <Users/>
            </PermCheck>

        </Route>
        <Route path="/admin/calendar">
            <PermCheck requiredPerm="manageEvents">
                <Calendar/>
            </PermCheck>

        </Route>
        <Route path="/admin/posts">
            <PermCheck requiredPerm="managePosts">
                <Posts/>
            </PermCheck>

        </Route>

        <Route path="/admin/account">
            <AccountPage/>
        </Route>

        <Route path="/">
            <h2 className="title is-size-3 has-text-centered"><code>404</code> Oops! I couldn't find what you were looking for.</h2>
            <p className="has-text-centered">Please check the URL and try again. If you followed a link here, please let me know.</p>
        </Route>
    </Switch>

};
export default PanelRouter