import React from 'react'
import { Link } from 'react-router-dom'

import './styles/TitleBar.css'
import 'styles/fonts.css'
import logo from 'images/watson.svg'
import user from 'images/user.svg'

const TitleBar = ({ apiKey, children }) => (
  <div>
    <div className="TitleBar-shadow">
      <div className="TitleBar-left">
        <Link to="/" className="TitleBar-link-logo">
          <img src={logo} className="TitleBar-logo" alt="Logo" />
        </Link>
        <div className="TitleBar-text-wrapper">
          <Link to="/" className="TitleBar-link">
            <h1 className="TitleBar-h1">
              IBM <span className="TitleBar-span">Watson</span>
            </h1>
          </Link>

          <h4 className="TitleBar-h4">Visual Recognition</h4>
        </div>
      </div>

      <div className="TitleBar-right">
        <Link to="/" className="TitleBar-overflow-item">Docs</Link>
        <Link to="/" className="TitleBar-overflow-item">API Reference</Link>
        <Link to="/" className="TitleBar-overflow-item TitleBar-highlight">
          <img src={user} className="TitleBar-user" alt="User" />
        </Link>
      </div>
    </div>
    <div className="TitleBar-height-blank" />
  </div>
)

export default TitleBar
