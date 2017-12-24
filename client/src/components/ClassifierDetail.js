import React from 'react'
import { Link } from 'react-router-dom'

import './styles/ClassifierDetail.css'
import 'styles/fonts.css'
import Card from 'components/Card'
import CustomDropButton from 'components/CustomDropButton'
import StatusIndicator from 'components/StatusIndicator'
import LoadingIndicator from 'components/LoadingIndicator'
import ThreeDotMenu from 'components/ThreeDotMenu'
import copy from 'images/copy.svg'
import error from 'images/ic_error_white.svg'

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

  var optionsDefault = [
    { name: 'Test', link: '#' },
    { name: 'Update', link: '#' },
    {}, // Divider.
    { name: 'Delete', link: '#', distructive: true }
  ]

  var optionsTraining = [
    { name: 'Test', link: '#', disabled: true },
    { name: 'Update', link: '#', disabled: true },
    {}, // Divider.
    { name: 'Delete', link: '#', distructive: true }
  ]

  return (
    <div className="ClassifierDetail">
      <Card>
        {status === 'failed' ? (
          <div>
            <div className="ClassifierDetail-failed font-body2">
              <img
                className="ClassifierDetail-failed-icon"
                src={error}
                alt="error"
              />
              <span>Failed</span>
            </div>
            <div className="ClassifierDetail-truncate">
              <div className="ClassifierDetail-name font-title">{name}</div>
            </div>
            <div className="ClassifierDetail-failed-message-header font-body2">
              The classifier could not be trained.
            </div>
            <div className="ClassifierDetail-failed-message font-body1">
              Verify the usage of at least 10 unique training images per class
              and at least 2 classes.
            </div>
          </div>
        ) : (
          <div>
            {!classifierId ||
            classifierId === 'food' ||
            classifierId === 'default' ? (
              <div className="ClassifierDetail-name font-title">{name}</div>
            ) : (
              <div>
                <ThreeDotMenu
                  options={
                    status === 'training' ? optionsTraining : optionsDefault
                  }
                />
                <Link className="ClassifierDetail-link" to={'/' + classifierId}>
                  <div className="ClassifierDetail-name font-title">{name}</div>
                </Link>
              </div>
            )}

            <div className="ClassifierDetail-classifier-id font-body1">
              <div className="ClassifierDetail-classifier-id-text">
                {classifierId}
              </div>

              {classifierId && (
                <span>
                  <div className="ClassifierDetail-tooltip">
                    <button
                      className="ClassifierDetail-copy-button"
                      onClick={copyTextToClipboard}
                    >
                      <img
                        className="ClassifierDetail-copy-icon"
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

            {status === 'training' ? (
              <div className="ClassifierDetail-training">
                <div className="ClassifierDetail-training-text font-body2">
                  Training
                </div>
                <LoadingIndicator />
              </div>
            ) : (
              <CustomDropButton
                accept="image/jpeg, image/png, .jpg, .jpeg, .png"
                explanationText="Drag images here to classify them"
              />
            )}
          </div>
        )}
      </Card>
    </div>
  )
}

export default ClassifierDetail
