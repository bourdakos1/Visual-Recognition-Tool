import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import './styles/TitleBar.css'
import 'styles/fonts.css'
import logo from 'images/watson.svg'
import user from 'images/user.svg'

class TitleBar extends Component {
  state = {
    showLogout: false
  }

  handleClick = () => {
    if (!this.state.showLogout) {
      // attach/remove event handler
      document.addEventListener('click', this.handleOutsideClick, false)
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false)
    }

    this.setState(prevState => ({
      showLogout: !prevState.showLogout
    }))
  }

  handleOutsideClick = e => {
    // ignore clicks on the component itself
    // if (this.node.contains(e.target)) {
    //   return
    // }

    this.handleClick()
  }

  render() {
    const { apiKey, children } = this.props
    return (
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
            <Link to="/" className="TitleBar-overflow-item">
              Docs
            </Link>
            <Link to="/" className="TitleBar-overflow-item">
              API Reference
            </Link>
            <Link
              to="/"
              onClick={this.handleClick}
              className={`TitleBar-overflow-item TitleBar-highlight ${this.state.showLogout
                ? 'TitleBar-highlight-active'
                : ''}`}
            >
              <img src={user} className="TitleBar-user" alt="User" />
            </Link>
            <div
              className={`TitleBar-account-details ${this.state.showLogout
                ? 'TitleBar-account-details-show'
                : 'TitleBar-account-details-hide'}`}
            >
              <div className="TitleBar-section-logout">
                <Link to="/" className="TitleBar-logout">Log Out</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="TitleBar-height-blank" />
      </div>
    )
  }
}

export default TitleBar
