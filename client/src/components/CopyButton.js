import React from 'react'

import './styles/CopyButton.css'
import 'styles/fonts.css'
import copy from 'images/copy.svg'

const CopyButton = ({ copyValue }) => {
  function copyTextToClipboard() {
    var textArea = document.createElement('textarea')
    textArea.style.position = 'fixed'
    textArea.style.top = 0
    textArea.style.left = 0
    textArea.style.width = '2em'
    textArea.style.height = '2em'
    textArea.style.padding = 0
    textArea.style.border = 'none'
    textArea.style.outline = 'none'
    textArea.style.boxShadow = 'none'
    textArea.style.background = 'transparent'
    textArea.value = copyValue
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }

  return (
    <span>
      <div className="CopyButton-tooltip">
        <button
          className="CopyButton-copy-button"
          onClick={copyTextToClipboard}
        >
          <img className="CopyButton-copy-icon" src={copy} alt="copy" />
          <span className="CopyButton-tooltiptext CopyButton-copy">
            Copy classifier_id
          </span>
          <span className="CopyButton-tooltiptext CopyButton-copied">
            Copied!
          </span>
        </button>
      </div>
    </span>
  )
}

export default CopyButton
