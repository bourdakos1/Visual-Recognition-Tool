import React from 'react'
import Radium from 'radium'
import { Link } from 'react-router-dom'

import Styles from './Styles'
import i18next from 'i18next'

@Radium
export default class DropDown extends React.Component {
    toggleHover = () => {
        this.setState({hover: false})
    }

    onClick = () => {
        this.setState({hover: true})
    }

    render() {
        var dropbtn = {
            backgroundImage: `url(${'/btn_dropdown.png'})`,
            backgroundColor: 'transparent',
            backgroundPosition: '0 0',
            backgroundSize: '50px 25px',
            backgroundRepeat: 'no-repeat',
            width: '25px',
            height: '25px',
            padding: '0px',
            marginRight: '-5px',
            border: 'none',
            cursor: 'pointer',
            ':hover': {
                backgroundPosition: '-25px 0',
            }
        }

        var dropdown = {
            position: 'relative',
            display: 'inline-block',
        }

        var dropdownContent = {
            borderRadius: '5px',
            display: 'none',
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            backgroundColor: 'white',
            minWidth: '160px',
            boxShadow: '0 0 0 1pt rgba(0,0,0,0.08), 0px 8px 16px 0px rgba(0,0,0,0.2)',
            zIndex: '1',
        }

        var aStyle = {
            font: Styles.fontDefault,
            color: Styles.colorTextDark,
            padding: '12px 16px',
            textDecoration: 'none',
            display: 'block',
            ':hover': {
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
            <div style={[dropdown, {float: 'right'}]}
                onClick={this.onClick}
                onMouseLeave={this.toggleHover}>
                <button className={this.props.className} style={dropbtn}></button>
                <div style={dropdownContent}>
                    <a className='link--classifiers--api-reference' style={[aStyle, aa]} key='0' href='https://www.ibm.com/watson/developercloud/visual-recognition/api/v3/?node#classify_an_image' target='_blank'>{i18next.t('api_reference')}</a>
                    <Link style={{textDecoration: 'none'}} to={'/update_classifier/' + this.props.classifierID}><span className='link--classifiers--update' style={[aStyle, ab]} key='1' href="#">{i18next.t('update')}</span></Link>
                    <a className='link--classifiers--delete' style={[aStyle, ac, {color: '#f44336'}]} key='2' href="#" onClick={this.props.delete}>{i18next.t('delete')}</a>
                </div>
            </div>
        )
    }
}
