import React, { Component } from 'react'
import { string, object } from 'prop-types'

import './styles/CustomDropButton.css'
import 'styles/fonts.css'
import MagicDropzone from 'components/MagicDropzone'

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

  onDrop = x => {
    console.log('File: ' + x)
  }

  onLink = x => {
    console.log('Link: ' + x)
  }

  render() {
    return (
      <MagicDropzone
        accept={this.props.accept}
        acceptLinks=".jpg, .jpeg, .png"
        onDrop={this.onDrop}
        onLink={this.onLink}
      >
        <div className="CustomDropButton">
          <div className="CustomDropButton-explanation-text font-bold">
            {this.props.explanationText}
          </div>

          <div className="CustomDropButton-manual-choice-text font-default">
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
