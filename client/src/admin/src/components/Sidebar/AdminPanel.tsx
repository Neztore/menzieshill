import React, { FunctionComponent } from "react";
import { NavLink } from "react-router-dom";

interface AdminBlockProps {
    to: string,
    name: string,
    exact?: boolean,
}

const AdminItem: FunctionComponent<AdminBlockProps> = ({ to, name, exact }) => (
  <li>
    <NavLink exact={exact} to={to} activeClassName="is-active">
      {name}
    </NavLink>
  </li>
);

function logOut () {

}

export const AdminPanel:FunctionComponent = () => (
  <aside className="menu sidebar-menu">
    <p className="menu-label">
      General
    </p>
    <ul className="menu-list">
      <AdminItem to="/" name="Home" exact />
      <AdminItem to="/users" name="Users" />
      <AdminItem to="/calendar" name="Calendar" />
      <AdminItem to="/posts" name="Posts" />
    </ul>
    <p className="menu-label">
      Files
    </p>
    <ul className="menu-list">
      <li>
        <a href="/photos">Photos</a>
      </li>
      <li>
        <a href="/docs">Documents</a>
      </li>
      <li>
        <a href="/archive">File archive</a>
      </li>
      <AdminItem to="/pages" name="Pages" />
    </ul>
    <p className="menu-label">
      Account
    </p>
    <ul className="menu-list">
      <AdminItem to="/account" name="My account" />
      <li>
        <a onClick={logOut}>Log out</a>
      </li>
    </ul>
  </aside>
);
export default AdminPanel;
