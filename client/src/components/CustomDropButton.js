import React, { Component } from 'react'
import { string, object } from 'prop-types'
import MagicDropzone from 'react-magic-dropzone'

import './styles/CustomDropButton.css'
import 'styles/fonts.css'

class CustomDropButton extends Component {
  state = {
    files: [],
    value: '',
    progress: 0,
    opacity: 0,
    hover: false,
    clearHover: false
  }

  static propTypes = {
    accept: string,
    explanationText: string,
    manualChoiceText: string,
    style: object
  }

  static defaultProps = {
    accept: '',
    explanationText: 'Drag file here to upload',
    manualChoiceText: 'choose your file',
    style: {}
  }

  onDrop = (accepted, rejected, links) => {
    console.log('Accepted: ' + accepted)
    console.log('Rejected: ' + rejected)
    console.log('links: ' + links.length)
    links.forEach(v => {
      console.log(v)
    })
  }

  render() {
    return (
      <MagicDropzone accept={this.props.accept} onDrop={this.onDrop}>
        <div className="CustomDropButton">
          <div className="CustomDropButton-explanation-text font-body2">
            {this.props.explanationText}
          </div>

          <div className="CustomDropButton-manual-choice-text font-body1">
            <span>Or </span>
            <span className="CustomDropButton-manual-choice-link">
              {this.props.manualChoiceText}
            </span>
          </div>
        </div>
      </MagicDropzone>
    )
  }
}

export default CustomDropButton
