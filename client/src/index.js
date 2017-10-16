import React from 'react'
import ReactDOM from 'react-dom'

import './styles/normalize.css'
import './styles/colors.css' // Import colors into the project.
import './index.css'
import App from './containers/App'
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
