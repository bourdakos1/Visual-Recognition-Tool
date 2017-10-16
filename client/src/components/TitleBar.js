import React from 'react'
import { Link } from 'react-router-dom'

import './styles/TitleBar.css'
import 'styles/fonts.css'
import logo from 'images/watson_color.png'
import Button from 'components/Button'

const TitleBar = ({ apiKey, children }) => {
  return (
    <div>
      <div className="TitleBar-shadow TitleBar-height">
        <div className="TitleBar-contentWrapper">
          <Link to="/" className="TitleBar-logo">
            <img src={logo} className="TitleBar-logo" alt="Logo" />
          </Link>

          <Link to="/" className="TitleBar-title font-title">
            {children}
          </Link>

          <div className="TitleBar-api-key font-default">
            <button className="TitleBar-key-button">
              <span role="img" aria-label="Key">
                🔑
              </span>
            </button>

            {apiKey.slice(0, 1)}
            <span id="TitleBar-key-middle">{apiKey.slice(1, -3)}</span>
            {apiKey.slice(-3)}
          </div>

          <Button className="TitleBar-button">Update key</Button>
        </div>
      </div>
      <div className="TitleBar-height" />
    </div>
  )
}

export default TitleBar
