import React, { Component } from 'react'

import './styles/ThreeDotMenu.css'
import 'styles/fonts.css'
import dots from 'images/btn_dropdown.png'

class ThreeDotMenu extends Component {
  state = {
    showDropDown: false
  }

  handleClick = () => {
    if (!this.state.showDropDown) {
      // attach/remove event handler
      document.addEventListener('click', this.handleOutsideClick, false)
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false)
    }

    this.setState(prevState => ({
      showDropDown: !prevState.showDropDown
    }))
  }

  handleOutsideClick = e => {
    // Ignore clicks on the dropdown itself.
    if (this.dropdownContent.contains(e.target)) {
      return
    }

    this.handleClick()
  }

  // dropdown = e => {
  //   e.target.nextSibling.classList.toggle('ThreeDotMenu-show')
  // }

  render() {
    return (
      <div className="ThreeDotMenu-dropdown">
        <button
          onClick={this.handleClick}
          style={{ backgroundImage: `url('` + dots + `')` }}
          className="ThreeDotMenu-dropbtn"
        />
        <div
          className={`ThreeDotMenu-dropdownContent ${this.state.showDropDown &&
            'ThreeDotMenu-show'}`}
          ref={input => {
            this.dropdownContent = input
          }}
        >
          <a
            className="ThreeDotMenu-aStyle ThreeDotMenu-disabled"
            key="0"
            href="#"
          >
            Test
          </a>
          <a
            className="ThreeDotMenu-aStyle ThreeDotMenu-disabled"
            key="1"
            href="#"
          >
            Update
          </a>
          <div className="ThreeDotMenu-divider" />
          <a
            className="ThreeDotMenu-aStyle ThreeDotMenu-destructive"
            key="2"
            href="#"
          >
            Delete
          </a>
        </div>
      </div>
    )
  }
}

export default ThreeDotMenu
