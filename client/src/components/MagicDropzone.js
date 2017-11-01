import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import { string, func } from 'prop-types'

class MagicDropzone extends Component {
  state = {
    files: [],
    value: ''
  }

  static propTypes = {
    accept: string,
    onDrop: func,
    onLink: func
  }

  static defaultProps = {
    accept: ''
  }

  static onDocumentDragOver = e => {
    // allow the entire document to be a drag target
    if (e.target.getAttribute('type') === 'text') {
      return
    }
    e.preventDefault()
  }

  onDocumentDrop = e => {
    // Only allow for the drop if the item was dropped onto the MagicDropZone.
    if (this.node && this.node.contains(e.target)) {
      return
    }
    if (e.target.getAttribute('type') === 'text') {
      return
    }
    e.preventDefault()
  }

  componentDidMount() {
    document.addEventListener(
      'dragover',
      MagicDropzone.onDocumentDragOver,
      false
    )
    document.addEventListener('drop', this.onDocumentDrop, false)
  }

  componentWillUnmount() {
    document.removeEventListener('dragover', MagicDropzone.onDocumentDragOver)
    document.removeEventListener('drop', this.onDocumentDrop)
  }

  onDragEnter = e => {
    const dt = e.dataTransfer
    if (dt.items) {
      this.setState({ showInput: false })
      return
    }
    if (
      !(
        dt.types &&
        // Sometimes we need to use "contains" instead of "indexOf"
        (dt.types.indexOf
          ? dt.types.indexOf('Files') !== -1
          : dt.types.contains('Files'))
      )
    ) {
      this.setState({ showInput: true })
    } else {
      this.setState({ showInput: false })
    }
  }

  onDragLeave = () => {
    this.setState({
      showInput: false
    })
  }

  onLinkTextChange = e => {
    this.setState({
      showInput: false,
      value: ''
    })

    var re = /(https:\/\/|http:\/\/)((?!http).)*(\.jpg)/gi

    var link = ''
    if (e.dataTransfer) {
      var uriLink = decodeURIComponent(
        e.dataTransfer.getData('text/uri-list')
      ).match(re)

      var htmlLink = e.dataTransfer.getData('text/html').match(re)

      // Have priority of the actual uri.
      if (uriLink) {
        link = uriLink[0]
      } else if (htmlLink) {
        link = decodeURIComponent(
          htmlLink.filter(l => l.indexOf('"') === -1)[0]
        )
      }
    } else {
      // Not sure when this will ever be the case?
      link = decodeURIComponent(e.target.value)
    }

    e.stopPropagation()
    e.preventDefault()
    this.props.onLink(link)
  }

  render() {
    const { accept, onDrop, children } = this.props
    const { value, showInput } = this.state

    const {
      dropZoneStyle,
      hiddenInputContainerStyle,
      inputStyle,
      hiddenInputStyle,
      interceptStyle
    } = styles

    return (
      /*
        I doubt people use emoji in their style names,
        please don't bite me in the butt.
      */
      <Dropzone
        className="__🍆dissable-dropzone-styles🍑__"
        preventDropOnDocument={false}
        accept={accept}
        onDrop={onDrop}
        style={dropZoneStyle}
        multiple={false}
      >
        <div
          style={interceptStyle}
          onDragEnter={this.onDragEnter}
          onDrop={this.onLinkTextChange}
        />
        {children}
        <div style={hiddenInputContainerStyle}>
          <input
            value={value}
            onChange={this.onLinkTextChange}
            onDragLeave={this.onDragLeave}
            type="text"
            style={showInput ? inputStyle : hiddenInputStyle}
          />
        </div>
      </Dropzone>
    )
  }
}

const styles = {
  dropZoneStyle: {
    position: 'relative'
  },
  hiddenInputContainerStyle: {
    opacity: '0',
    position: 'absolute',
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    display: 'flex', // Weird hack to fix input with in chrome.
    flexDirection: 'column'
  },
  inputStyle: {
    opacity: '0',
    position: 'relative',
    height: '100%',
    display: 'block'
  },
  hiddenInputStyle: {
    opacity: '0',
    position: 'relative',
    height: '100%',
    display: 'none'
  },
  interceptStyle: {
    cursor: 'pointer',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    zIndex: '10000'
  }
}

export default MagicDropzone
