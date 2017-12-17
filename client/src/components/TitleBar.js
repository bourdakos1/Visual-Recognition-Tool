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
        <Link to="/" className="TitleBar-link">
          <img src={logo} className="TitleBar-logo" alt="Logo" />
          <h1 className="TitleBar-h1">
            IBM <span className="TitleBar-span">Cloud</span>
          </h1>
        </Link>

        <h4 className="TitleBar-h4">Docs</h4>
      </div>

      <div className="TitleBar-right">

      </div>
    </div>
    <div className="TitleBar-height-blank" />
  </div>
)

export default TitleBar
