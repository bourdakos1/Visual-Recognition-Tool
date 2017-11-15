import React from 'react'

import './styles/ThreeDotMenu.css'
import 'styles/fonts.css'
import dots from 'images/btn_dropdown.png'

const ThreeDotMenu = () => {
  function dropdown() {
    document.getElementById('myDropdown').classList.toggle('show')
  }

  return (
    <div className="dropdown">
      <button
        onClick={dropdown}
        style={{ backgroundImage: `url('` + dots + `')` }}
        className="dropbtn"
      />
      <div id="myDropdown" className="dropdownContent">
        <a className="aStyle aa" key="0" href="#">
          Test
        </a>
        <a className="aStyle ab" key="1" href="#">
          Update
        </a>
        <a className="aStyle ac delete" key="2" href="#">
          Delete
        </a>
      </div>
    </div>
  )
}

export default ThreeDotMenu
