import React from 'react'

import './styles/ThreeDotMenu.css'
import 'styles/fonts.css'
import dots from 'images/btn_dropdown.png'

const ThreeDotMenu = () => {
  function dropdown() {
    document.getElementById('myDropdown').classList.toggle('ThreeDotMenu-show')
  }

  return (
    <div className="ThreeDotMenu-dropdown">
      <button
        onClick={dropdown}
        style={{ backgroundImage: `url('` + dots + `')` }}
        className="ThreeDotMenu-dropbtn"
      />
      <div id="myDropdown" className="ThreeDotMenu-dropdownContent">
        <a className="ThreeDotMenu-aStyle" key="0" href="#">
          Test
        </a>
        <a className="ThreeDotMenu-aStyle" key="1" href="#">
          Update
        </a>
        <div className="ThreeDotMenu-divider"></div>
        <a className="ThreeDotMenu-aStyle ThreeDotMenu-destructive" key="2" href="#">
          Delete
        </a>
      </div>
    </div>
  )
}

export default ThreeDotMenu
