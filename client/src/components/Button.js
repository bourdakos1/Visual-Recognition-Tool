import React from 'react'

import './styles/Button.css'
import 'styles/fonts.css'

const Button = ({ className, bold, icon, children }) => {
  return (
    <button
      className={
        (className ? className + ' ' : '') +
        'font-default Button-base' +
        (bold ? ' Button-bold' : ' Button-thin') +
        (icon ? ' Button-image' : '')
      }
    >
      {children}
      {icon && <img className="Button-imgStyle" src={icon} alt="" />}
    </button>
  )
}

export default Button
