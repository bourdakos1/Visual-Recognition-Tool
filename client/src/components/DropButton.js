import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import { string, func } from 'prop-types'

import './styles/DropButton.css'

class DropButton extends Component {
  static propTypes = {
    accept: string,
    onDrop: func
  }

  static defaultProps = {
    accept: ''
  }

  render() {
    return (
      <Dropzone
        className="DropButton"
        preventDropOnDocument={false}
        accept={this.props.accept}
        onDrop={this.props.onDrop}
        multiple={false}
      >
        {this.props.children}
      </Dropzone>
    )
  }
}

export default DropButton
