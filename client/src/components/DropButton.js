import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import { string, object } from 'prop-types'

import './styles/DropButton.css'
import 'styles/fonts.css'

class DropButton extends Component {
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

  onDrop = () => {
    console.log('dropped!')
  }

  render() {
    return (
      <Dropzone
        style={this.props.style}
        className="DropButton-dropzone"
        preventDropOnDocument={false}
        accept={this.props.accept}
        onDrop={this.onDrop}
        multiple={false}
      >
        <div className="DropButton-explanation-text font-bold">
          {this.props.explanationText}
        </div>

        <div className="DropButton-manual-choice-text font-default">
          <span>Or </span>
          <span className="DropButton-manual-choice-link">
            {this.props.manualChoiceText}
          </span>
        </div>
      </Dropzone>
    )
  }
}

export default DropButton
