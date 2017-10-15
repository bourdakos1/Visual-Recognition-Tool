import React from 'react'
import ReactDOM from 'react-dom'

import './normalize.css'
import './index.css'
import './color-styles.css' // Import colors into the project.
import App from './App'
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
