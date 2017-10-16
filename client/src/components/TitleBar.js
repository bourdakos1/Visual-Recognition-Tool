import React from 'react'
import { Link } from 'react-router-dom'

import 'components/TitleBar.css'
import 'styles/fonts.css'
import logo from 'images/watson_color.png'
import Button from 'components/Button'

function TitleBar() {
  var key = localStorage.getItem('api_key')
  return (
    <div>
      <div className="TitleBar-shadow TitleBar-height">
        <div className="TitleBar-contentWrapper">
          <Link to="/" className="TitleBar-logo">
            <img src={logo} className="TitleBar-logo" alt="Logo" />
          </Link>

          <Link to="/" className="TitleBar-title font-title">
            Visual Recognition Tool
          </Link>

          <div className="TitleBar-api-key font-default">
            <button className="TitleBar-key-button">
              <span role="img" aria-label="Key">
                🔑
              </span>
            </button>

            {key.slice(0, 1)}
            <span id="TitleBar-key-middle">{key.slice(1, -3)}</span>
            {key.slice(-3)}
          </div>

          <Button className="TitleBar-button">Update key</Button>
        </div>
      </div>
      <div className="TitleBar-height" />
    </div>
  )
}

export default TitleBar
