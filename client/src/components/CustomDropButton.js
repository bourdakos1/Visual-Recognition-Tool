import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import { string, object } from 'prop-types'

import './styles/CustomDropButton.css'
import 'styles/fonts.css'
import DropButton from 'components/DropButton'

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

  onDrop = () => {
    console.log('dropped!')
  }

  render() {
    return (
      <DropButton accept={this.props.accept} onDrop={this.onDrop}>
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
      </DropButton>
    )
  }
}

export default CustomDropButton
