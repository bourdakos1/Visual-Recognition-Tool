import React from 'react'
import ReactDOM from 'react-dom'

import 'styles/normalize.min.css'
import 'styles/colors.css' // Import colors into the project.
import 'styles/index.css'
import App from 'containers/App'
import registerServiceWorker from 'registerServiceWorker'

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
