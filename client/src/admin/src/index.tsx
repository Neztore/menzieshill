import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import '../../css/global.css'
import '../../css/bulma.min.css'
import NavBar from './components/navbar'
import ErrorBoundary from "./components/ErrorBoundary";
import {BrowserRouter as Router} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import PanelRouter from "./components/Router";
// @ts-ignore
if (module.hot) {
    // @ts-ignore
    module.hot.accept()
}

const base = (
    <Router>
        <ErrorBoundary>
            <NavBar/>
            <div className="columns">
                <div className="column is-3">
                    <Sidebar/>
                </div>
                <div className="column" style={{marginRight: "0.5em"}}>
                    <PanelRouter/>
                </div>
            </div>

        </ErrorBoundary>
    </Router>
);

ReactDOM.render(
   base,
    document.getElementById('root'),
);