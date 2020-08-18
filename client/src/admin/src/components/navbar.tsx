import React from "react";

export default function NavBar () {
  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          <img src="/img/logo.jpg" alt="Logo" />
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
            Home
          </a>
          <a className="navbar-item" href="/contact">
            Contact us
          </a>
          <a className="navbar-item" href="/docs">
            Club policies
          </a>
        </div>
      </div>
    </nav>
  );
}
