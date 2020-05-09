import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import '../../../public/css/global.css'
import '../../../public/css/bulma.min.css'
import '../admin.css'
import NavBar from './components/navbar'
import ErrorBoundary from './components/ErrorBoundary'
import { BrowserRouter as Router } from 'react-router-dom'

import Sidebar from './components/Sidebar'
import PanelRouter from './components/Router'
// @ts-ignore
if (module.hot) {
	// @ts-ignore
	module.hot.accept()
}
const leftStyle = {backgroundColor: "#fbfbfb", height:"100vh"};
const base = (
	<Router>
		<ErrorBoundary>
			<NavBar />
			<div className='columns'>
				<div className='column is-3 fullHeight' style={leftStyle}>
					<Sidebar />
				</div>
				<div className='column admin-right' style={{ marginRight: '0.5em' }}>
					<PanelRouter />
				</div>
			</div>

		</ErrorBoundary>
	</Router>
);

ReactDOM.render(
	base,
	document.getElementById('root')
);
