import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import '../../../public/css/global.css'
import '../../../public/css/bulma.min.css'
import '../admin.css'
import NavBar from './components/navbar'
import ErrorBoundary from './components/ErrorBoundary'
import { BrowserRouter as Router } from 'react-router-dom'

import App from "./components/App";
// @ts-ignore
if (module.hot) {
	// @ts-ignore
	module.hot.accept()
}
;
const appBase = (
	<Router>
		<ErrorBoundary>
			<NavBar />
			<App/>

		</ErrorBoundary>
	</Router>
);

ReactDOM.render(
	appBase,
	document.getElementById('root')
);
