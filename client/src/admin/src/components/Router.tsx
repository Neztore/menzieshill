import {Route, Switch, Redirect} from "react-router";
import Home from "./Home";
import React from "react";
import Users from "./Users";
import Calendar from "./Calendar";
import AccountPage from "./Account";
import Posts from "./Posts";

export const PanelRouter = ()=> {
    return <Switch>
        <Route exact path="/">
            <Redirect to="/"/>
        </Route>

        <Route exact path="/admin">
            <Home />
        </Route>
        <Route path="/admin/users">
            <Users/>
        </Route>
        <Route path="/admin/calendar">
            <Calendar/>
        </Route>
        <Route path="/admin/posts">
            <Posts/>
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