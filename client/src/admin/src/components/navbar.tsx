import React from "react";

export default function NavBar () {
  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="/admin">
          Admin console
        </a>
        <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="main-navbar">
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </a>

      </div>

      <div className="navbar-menu" id="main-navbar">
        <div className="navbar-start">
          <a className="navbar-item" href="/">
            Site home
          </a>
        </div>
      </div>
    </nav>
  );
}
