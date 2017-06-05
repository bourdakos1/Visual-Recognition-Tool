import React from 'react'
import Radium, { Style } from 'radium'
import request from 'superagent'
import nocache from 'superagent-no-cache'

import Styles from './Styles'
import i18next from 'i18next'

@Radium
export default class LandingPage extends React.Component {
    onBlur = () => {
        this.setState({focus: false})
    }

    onFocus = () => {
        this.setState({focus: true})
    }

    setApiKey = (e) => {
        e.preventDefault()
        var self = this
        var req = request.get('/api/validate')

        //var apiKey = this.apiKey.value
        var username = self.state.key.split(":")[0]
        var password = self.state.key.split(":")[1]

        req.use(nocache)

        req.query({
            //var apiKey = this.apiKey.value
            username: username,
            password: password
         })

        req.end((err, res) => {
            if (res.body.valid) {
                self.props.setCredentials(username, password)
            } else {
                self.setState({error: i18next.t('invalid_key')})
            }
        })
    }

    onTextChange = (e) => {
        this.setState({key: e.target.value})
    }

    render() {
        var buttonStyle = {
            base: {
                position: 'fixed',
                lineHeight: '0px',
                alignSelf: 'center',
                borderRadius: '23px',
                border: 'none',
                height: '46px',
                width: '318px',
                font: Styles.fontHeader,
                padding: '0px 22px 0px 22px',
                color: Styles.colorTextLight,
                background: Styles.colorPrimary,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 2px 2px 0px rgba(0,0,0,.15), 0 0 0 1px rgba(0,0,0,.08)',
                transition: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
                zIndex: '10',

                ':hover': {
                    boxShadow: '0 3px 9px 0px rgba(0,0,0,.2), 0 0 0 1px rgba(0,0,0,.08)',
                    transition: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
                },
                ':focus': {
                    outline: 'none',
                }
            }
        }

        if (this.state.focus) {
            buttonStyle.base.color = Styles.colorTextLight
            buttonStyle.base.background = 'white'
            buttonStyle.base.width = '550px'
            buttonStyle.base.padding = '0px 50px 0px 25px'
        } else {
            buttonStyle.base.color = 'white'
            buttonStyle.base.background = Styles.colorPrimary
            buttonStyle.base.width = '318px'
            buttonStyle.base.padding = '0px 25px 0px 25px'
            buttonStyle.base.whiteSpace = 'nowrap'
            buttonStyle.base.overflow = 'hidden'
            buttonStyle.base.textOverflow = 'ellipsis'
        }

        var keyNone = {
            position: 'fixed',
            left: '50%',
            top: '50%',
            font: Styles.fontHeader,
            fontWeight: 'normal',
            color: 'white',
            transform: 'translate(-225px, -15px)',
            opacity: '0',
            zIndex: '9',
            transition: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        }

        var key = {
            position: 'fixed',
            left: '50%',
            top: '50%',
            font: Styles.fontHeader,
            fontWeight: 'normal',
            color: 'white',
            transform: 'translate(-225px, -60px)',
            opacity: '1',
            zIndex: '11',
            transition: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        }

        var error = {
            borderRadius: '15px',
            border: 'none',
            height: '30px',
            width: 'auto',
            paddingLeft: '7px',
            paddingRight: '7px',
            paddingTop:'6px',
            textAlign:'center',
            color: 'white',
            background: '#F44336',
            position: 'fixed',
            left: '50%',
            top: '50%',
            font: Styles.fontDefault,
            fontWeight: 'normal',
            transform: 'translate(-50%, -60px)',
            opacity: '1',
            zIndex: '11',
            transition: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        }

        var getKey = {
            position: 'fixed',
            left: '50%',
            top: '50%',
            font: Styles.fontDefault,
            transform: 'translate(-50%, 55px)',
            opacity: '1',
            zIndex: '11',
            transition: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        }

        var link = {
            color: Styles.colorTextLight
        }

        if (this.state.focus) {
            link.color = 'white'
        } else {
            link.color = Styles.colorTextLight
        }

        var picsNone = {
            border: 'none',
            cursor: 'pointer',
            background: `url(${'/btn_submit.png'})`,
            backgroundSize: 'contain',
            position: 'fixed',
            height: '40px',
            width: '40px',
            left: '50%',
            top: '50%',
            transform: 'translate(120px, -50%)',
            opacity: '0',
            zIndex: '9',
            transition: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        }

        var pics = {
            border: 'none',
            cursor: 'pointer',
            background: `url(${'/btn_submit.png'})`,
            backgroundSize: 'contain',
            position: 'fixed',
            height: '40px',
            width: '40px',
            left: '50%',
            top: '50%',
            transform: 'translate(232px, -50%)',
            opacity: '1',
            zIndex: '11',
            transition: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        }

        var background = {
            position: 'fixed',
            top: '0',
            bottom: '0',
            left: '0',
            right: '0',
            background: 'white',
            backgroundSize: 'cover',
            backgroundPosition: 'bottom',
        }

        const RGB = Styles.colorPrimary
        var A = '0.8'
        var RGBA = 'rgba('+parseInt(RGB.substring(1,3),16)+','+parseInt(RGB.substring(3,5),16)+','+parseInt(RGB.substring(5,7),16)+','+A+')'

        var skrim = {
            position: 'fixed',
            top: '0',
            bottom: '0',
            left: '0',
            right: '0',
            background: RGBA,
            transition: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        }

        var A = '0'
        var RGBA = 'rgba('+parseInt(RGB.substring(1,3),16)+','+parseInt(RGB.substring(3,5),16)+','+parseInt(RGB.substring(5,7),16)+','+A+')'

        var skrimNone = {
            position: 'fixed',
            top: '0',
            bottom: '0',
            left: '0',
            right: '0',
            background: RGBA,
            transition: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        }

        var title = {
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -90px)',
            font: Styles.fontTitle,
            color: Styles.colorTextDark,
            transition: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        }

        var logo = {
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -190px)',
            height: '80px',
            zIndex: '-10',
        }

        return(
            <div id='landing-page' style={background}>
                <img src='/watson_color_landing.png' style={logo}></img>
                <div style={title}>{i18next.t('visual_recognition_tool')}</div>

                <div style={this.state.focus ? skrim : skrimNone}/>

                <Style scopeSelector='.myInputs::-webkit-input-placeholder' rules={{
                    transition: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
                    color: 'white',
                    textAlign: 'center',
                    opacity: '1',
                }} />
                <Style scopeSelector='.myInputs:focus::-webkit-input-placeholder' rules={{
                    transition: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
                    opacity: '0',
                }} />

                <Style scopeSelector='.myInputs::-moz-placeholder' rules={{
                    transition: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
                    color: 'white',
                    textAlign: 'center',
                    opacity: '1',
                }} />
                <Style scopeSelector='.myInputs:focus::-moz-placeholder' rules={{
                    transition: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
                    opacity: '0',
                }} />

                <Style scopeSelector='.myInputs::-ms-input-placeholder' rules={{
                    transition: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
                    color: 'white',
                    textAlign: 'center',
                    opacity: '1',
                }} />
                <Style scopeSelector='.myInputs:focus::-ms-input-placeholder' rules={{
                    transition: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
                    opacity: '0',
                }} />

                {this.state.error && this.state.focus ?
                    <div id='error--landing-page--api-key' style={error}>
                        {i18next.t('invalid_key')}
                    </div> :
                    null
                }

                <form onSubmit={this.setApiKey}>
                    <input type='text'
                        id='input--landing-page--api-key'
                        className='myInputs'
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        style={buttonStyle.base}
                        placeholder={i18next.t('api_key')}
                        onChange={this.onTextChange}/>
                    <button
                        style={this.state.focus ? pics : picsNone}
                        id='button--landing-page--api-key'
                        onMouseDown={this.setApiKey}/>
                </form>

                <div style={getKey}>
                    <a
                        id='link--landing-page--api-key'
                        href='https://console.dys0.bluemix.net/catalog/services/visual-recognition-dedicatedsoftbankdev/'
                        target='_blank'
                        style={link}>
                        {i18next.t('sign_up')}
                    </a>
                </div>
            </div>
        )
    }
}
