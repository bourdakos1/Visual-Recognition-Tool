import React from 'react'
import Radium from 'radium'
import { Link } from 'react-router-dom'

import Styles from '../Styles'
import Strings from '../Strings'

@Radium
export default class DropDown extends React.Component {
    toggleHover = () => {
        this.setState({hover: false})
    }

    onClick = () => {
        this.setState({hover: true})
    }

    render() {
        var dropdownContent = {
            borderRadius: '5px',
            display: 'none',
            position: 'absolute',
            top: '-6px',
            left: '-16px',
            backgroundColor: 'white',
            minWidth: '160px',
            boxShadow: '0 0 0 1pt rgba(0,0,0,0.08), 0px 8px 16px 0px rgba(0,0,0,0.2)',
            zIndex: '1',
        }

        var aSelected = {
            color: Styles.colorPrimary,
            opacity: '1.0',
            ':hover': {
                opacity: '1.0',
                backgroundColor: '#f9f9f9'
            }
        }

        var aStyle = {
            font: Styles.fontDefault,
            fontSize: '14px',
            color: Styles.colorTextDark,
            padding: '12px 16px',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            display: 'block',
            opacity: '0.65',
            ':hover': {
                opacity: '0.9',
                backgroundColor: '#f9f9f9'
            }
        }

        // This is really dumb...
        var aa = {
            ':hover': {
                borderRadius: '5px 5px 0px 0px',
            }
        }

        var ab = {
            ':hover': {
                borderRadius: '0px',
            }
        }

        var ac = {
            ':hover': {
                borderRadius: '0px 0px 5px 5px',
            }
        }

        if (this.state.hover) {
            dropdownContent.display = 'block'
        }

        return (
            <span
                style={[this.props.style, {position: 'relative'}]}
                onClick={this.onClick}
                onMouseLeave={this.toggleHover}>
                {this.props.children}<i style={{float: 'right', color: 'rgba(0, 0, 0, 0.54)'}} className="material-icons">arrow_drop_down</i>
                <div style={dropdownContent}>
                    <a style={[aStyle, aa, this.props.service == '/conversation' ? aSelected : null]} key='0' href={this.props.basePath + "/conversation"}>
                        Conversation
                        {this.props.service == '/conversation' ?
                            <i style={{float: 'right', color: Styles.colorPrimary, fontSize: '14px'}} className="material-icons">check</i> :
                            null
                        }
                    </a>
                    <a style={[aStyle, ab]} key='1' href="#">Discovery</a>
                    <a style={[aStyle, ab, this.props.service == '/vision' ? aSelected : null]} key='2' href={this.props.basePath + "/vision"}>
                        Vision
                        {this.props.service == '/vision' ?
                            <i style={{float: 'right', color: Styles.colorPrimary, fontSize: '14px'}} className="material-icons">check</i> :
                            null
                        }
                    </a>
                    <a style={[aStyle, ab]} key='3' href="#">Speech To Text</a>
                    <a style={[aStyle, ab]} key='4' href="#">Translation</a>
                    <a style={[aStyle, ab]} key='5' href="#">Text To Speech</a>
                    <a style={[aStyle, ab]} key='6' href="#">Natural Language Understanding</a>
                    <a style={[aStyle, ab]} key='7' href="#">Document Conversion</a>
                    <a style={[aStyle, ab]} key='8' href="#">Personality Insights</a>
                    <a style={[aStyle, ac]} key='9' href="#">Tone Analyzer</a>
                </div>
            </span>
        )
    }
}
