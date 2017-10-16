import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import Api from './Api'

jest.mock('./Api')

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
})
