import React from 'react'

import './styles/Button.css'
import 'styles/fonts.css'

function Button(props) {
  return (
    <button
      className={
        (props.className ? props.className + ' ' : '') +
        'font-default Button-base' +
        (props.bold ? ' Button-bold' : ' Button-thin') +
        (props.icon ? ' Button-image' : '')
      }
    >
      {props.children}
      {props.icon && (
        <img className="Button-imgStyle" src={props.icon} alt="" />
      )}
    </button>
  )
}

export default Button
