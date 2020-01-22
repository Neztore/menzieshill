import React from "react";
import { Link } from 'react-router-dom'

export default function NavBar() {
    return <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
            <Link className="navbar-item" to="/">
                <img src="/img/logo.jpg"  alt="Logo"/>
            </Link>
            <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="main-navbar">
                <span aria-hidden="true"/>
                <span aria-hidden="true"/>
                <span aria-hidden="true"/>
            </a>

        </div>

        <div className="navbar-menu" id="main-navbar">
            <div className="navbar-start">
                <Link className="navbar-item" to="/">
                    Home
                </Link>
                <Link className="navbar-item" to="">
                    Contact us
                </Link>
                <Link className="navbar-item" to="">
                    Who we are
                </Link>
                <Link className="navbar-item" to="">
                    Club policies
                </Link>
            </div>
            <div className="navbar-end">
                <Link className="navbar-item" to="">
                    My account
                </Link>
            </div>
        </div>
    </nav>

}
