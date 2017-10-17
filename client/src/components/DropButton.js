import React, { Component } from 'react'

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
    model: object.isRequired,
    title: string
  }

  static defaultProps = {
    model: {
      id: 0
    },
    title: 'Your Name'
  }

  render() {
    return <div />
  }
}

export default DropButton
