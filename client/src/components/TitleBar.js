import React from 'react'
import { Link } from 'react-router-dom'

import './styles/TitleBar.css'
import 'styles/fonts.css'
import logo from 'images/watson.svg'
import user from 'images/user.svg'
import Button from 'components/Button'

const TitleBar = ({ apiKey, children }) => (
  <div>
    <div className="TitleBar-status">
      <img src={user} className="TitleBar-user" alt="User" />
    </div>
    <div className="TitleBar-shadow">
      <div className="TitleBar-contentWrapper">
        <Link to="/" className="TitleBar-link">
          <img src={logo} className="TitleBar-logo" alt="Logo" />
          <h1 className="TitleBar-h1">IBM</h1>
          <span className="TitleBar-span">Watson</span>
        </Link>

        <h4 className="TitleBar-h4">Visual Recognition</h4>

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
    <div className="TitleBar-height-blank" />
  </div>
)

export default TitleBar
