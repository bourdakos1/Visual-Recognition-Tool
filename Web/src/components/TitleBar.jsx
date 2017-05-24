import React from 'react'
import Radium from 'radium'
import { Link } from 'react-router-dom'

import Button from './Button'
import QRModal from './QRModal'
import Styles from './Styles'
import Strings from './Strings'

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

        //var key = localStorage.getItem('api_key')
        var username = localStorage.getItem('username')
        var password = localStorage.getItem('password')

        return (
            <div style={shadow}>
                <div style={contentWrapper}>
                    <Link to='/' style={logo}><img src={'/watson_color.png'} style={logo}></img></Link>
                    <Link to='/' style={title}>{Strings.visual_recognition_tool}</Link>

                    <div style={right}>
                        <div style={user}>
                            <span style={{cursor: 'pointer'}} >{Strings.key} </span>{username} &nbsp;&nbsp;
                        </div>
                    </div>

                    <Button
                        style={button}
                        id={'button--base--update-api-key'}
                        onClick={this.props.showModal}
                        text={Strings.update_key_button}/>
                </div>
                <QRModal
                    visible={this.state.showQR}
                    onHidden={this.hideQR}/>
            </div>
        )
    }
}
