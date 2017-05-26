import React from 'react'
import Radium from 'radium'
import { Link } from 'react-router-dom'

import Button from './Button'
import QRModal from './QRModal'
import Styles from './Styles'
import i18next from 'i18next'

@Radium
export default class TitleBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showQR: false
        }
    }


    showQR = () => {
        this.setState({
            showQR: true
        })
    }

    hideQR = () => {
        this.setState({
            showQR: false
        })
    }

    render() {
        var logo = {
            height: '60px',
            float: 'left',
            cursor: 'pointer',
        }

        var title = {
            font: Styles.fontTitle,
            color: Styles.colorTextDark,
            flex: 'none',
            marginRight: 'auto',
            cursor: 'pointer',
            textDecoration: 'none',
        }

        var right = {
            font: Styles.fontDefault,
            color: Styles.colorTextLight,
            minWidth: '0px',
            marginLeft: '20px',
            display: 'flex',
        }

        var shadow = {
            zIndex: '1000',
            boxShadow: '0 1px 1px rgba(0, 0, 0, 0.1)',
            position: 'fixed',
            top: '0px',
            left: '0px',
            right: '0px',
            background: '#fff',
            height: '65px',
        }

        var contentWrapper = {
            maxWidth: '1000px',
            width: '100%',
            height: '100%',
            margin: 'auto',
            display: 'flex',
            lineHeight: '65px',
            alignItems: 'center',
        }

        var user = {
            whiteSpace:'nowrap',
            overflow:'hidden',
            textOverflow:'ellipsis',
        }

        var button = {
            display: 'flex',
            flex: 'none'
        }

        var key = localStorage.getItem('api_key')

        return (
            <div style={shadow}>
                <div style={contentWrapper}>
                    <Link to='/' style={logo}><img src={'/watson_color.png'} style={logo}></img></Link>
                    <Link to='/' style={title}>{i18next.t('visual_recognition_tool')}</Link>

                    <div style={right}>
                        <div style={user}>
                            <span style={{cursor: 'pointer'}} onClick={this.showQR}>{i18next.t('key')} </span>{key.slice(0, 1)}<span id='key' style={{fontSize: '0em'}}>{key.slice(1, -3)}</span>{key.slice(-3)} &nbsp;&nbsp;
                        </div>
                    </div>

                    <Button
                        style={button}
                        id={'button--base--update-api-key'}
                        onClick={this.props.showModal}
                        text={i18next.t('update_key_button')}/>
                </div>
                <QRModal
                    visible={this.state.showQR}
                    onHidden={this.hideQR}/>
            </div>
        )
    }
}
