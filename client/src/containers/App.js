import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import 'containers/App.css'
import LoginPage from 'containers/LoginPage'
import Tooling from 'containers/Tooling'

function RenderPage() {
  // Mock login/logout.
  localStorage.setItem('api_key', '2d7f02e6708f3562a043ebf31159ff849d94d123')
  // localStorage.clear()

  if (
    localStorage.getItem('api_key') == null ||
    localStorage.getItem('api_key') === ''
  ) {
    return <LoginPage />
  } else {
    return <Tooling />
  }
}

function App() {
  return (
    <BrowserRouter>
      <RenderPage />
    </BrowserRouter>
  )
}

export default App
