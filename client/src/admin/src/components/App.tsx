import React, { FunctionComponent } from "react";
import { Route, Switch } from "react-router-dom";

import { AdminRoot } from "./Admin";
import { Login } from "./Authentication/Login";
import { Register } from "./Authentication/Register";

export const App:FunctionComponent = () => (
  <Switch>
    <Route path="/login" exact>
      <Login />
    </Route>
    <Route path="/register" exact>
      <Register />
    </Route>
    <Route>
      <AdminRoot />
    </Route>
  </Switch>
);
export default App;
