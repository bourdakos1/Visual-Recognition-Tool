import React from 'react'
import { Link } from 'react-router-dom'

import './styles/ClassifierDetail.css'
import 'styles/fonts.css'
import Card from 'components/Card'
import CustomDropButton from 'components/CustomDropButton'
import StatusIndicator from 'components/StatusIndicator'
import ThreeDotMenu from 'components/ThreeDotMenu'
import copy from 'images/copy.svg'

const ClassifierDetail = ({ name, classifierId, status }) => {
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
    textArea.value = classifierId
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }

  return (
    <div className="ClassifierDetail">
      <Card>
        {status === 'failed' ? (
          <div>
            <div className="ClassifierDetail-name font-title">{name}</div>
            <br />
            <StatusIndicator status={status} />
            <div className="ClassifierDetail-failed-message font-body2">
              Could not train classifier. Verify there are at least 10 positive
              training images for at least 1 class and at least 10 other unique
              training images.
            </div>
            <div className="ClassifierDetail-failed font-body2">Dismiss</div>
          </div>
        ) : (
          <div>
            {!classifierId ||
            classifierId === 'food' ||
            classifierId === 'default' ? (
              <div className="ClassifierDetail-name font-title">{name}</div>
            ) : (
              <div>
                <ThreeDotMenu />
                <Link className="ClassifierDetail-link" to={'/' + classifierId}>
                  <div className="ClassifierDetail-name font-title">{name}</div>
                </Link>
              </div>
            )}
            <div className="ClassifierDetail-classifier-id font-body1">
              {classifierId}
              {classifierId && (
                <span>
                  <div className="ClassifierDetail-tooltip">
                    <button
                      className="ClassifierDetail-copy-button"
                      onClick={copyTextToClipboard}
                    >
                      <img
                        className="ClassifierDetail-copy"
                        src={copy}
                        alt="copy"
                      />
                      <span className="ClassifierDetail-tooltiptext ClassifierDetail-copy">
                        Copy classifier_id
                      </span>
                      <span className="ClassifierDetail-tooltiptext ClassifierDetail-copied">
                        Copied!
                      </span>
                    </button>
                  </div>
                </span>
              )}
            </div>

            <StatusIndicator status={status} />
            <CustomDropButton
              accept="image/jpeg, image/png, .jpg, .jpeg, .png"
              explanationText="Drag images here to classify them"
            />
          </div>
        )}
      </Card>
    </div>
  )
}

export default ClassifierDetail
