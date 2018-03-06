import React from 'react'
import Radium from 'radium'
import request from 'superagent'
import nocache from 'superagent-no-cache'
import { Modal, ModalBody, ModalFooter } from 'reactstrap'

import Button from './Button'
import Styles from './Styles'
import Strings from './Strings'

@Radium
export default class CredentialsModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modal: props.visible
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            modal: newProps.visible
        })
    }

    saveApiKey = (e) => {
        e.preventDefault()
        var self = this
        var apiKey = this.apiKey.value

        var req = request.get('/api/validate')
        req.use(nocache)

        req.query({
            api_key: apiKey
         })

        req.end((err, res) => {
            if (res.body.valid) {
                self.toggle()
                self.props.setCredentials(apiKey)
            } else {
                self.setState({error: Strings.invalid_key})
            }
        })
    }

    logout = (e) => {
        e.preventDefault()
        this.toggle()
        this.props.setCredentials('')
    }

    toggle = () => {
        var temp = !this.state.modal
        this.setState({
            modal: !this.state.modal
        })

        // This is wrong, but... I can't help but feel like there ain't nothing more right, babe
        if (temp == false) {
            this.props.onHidden()
        }
    }

    render() {
        var deleteStyle = {
            backgroundColor: 'transparent',
            backgroundImage: `url(${'/btn_delete.png'})`,
            height: '25px',
            width: '25px',
            backgroundPosition: '0 0',
            backgroundSize: '75px 25px',
            backgroundRepeat: 'no-repeat',
            border: 'none',
            ':hover': {
                backgroundPosition: '-25px 0',
            },
            ':active': {
                backgroundPosition: '-50px 0',
            }
        }

        var title = {
            font: Styles.fontTitle,
            color: Styles.colorTextDark,
            display: 'inline-block',
        }

        var error = {
            color: '#F44336',
            font: Styles.fontDefault,
        }

        return (
            <Modal id={'credentials-modal'} isOpen={this.state.modal} toggle={this.toggle}>
                <div className={'modal-header'}>
                    <div style={title}>{Strings.update_key}</div>
                    <button onClick={this.toggle} style={deleteStyle} />
                </div>
                <ModalBody>
                    <p>{Strings.key_modal_description}</p>
                    <p><a href={'https://console.ng.bluemix.net/catalog/services/visual-recognition/'} target={'_blank'}>{Strings.sign_up}</a></p>
                    {this.state.error ? <p id={'error--api-key-modal--api-key'} style={error}>{this.state.error}</p> : null}
                    <form id={'api-key-form'} role={'form'} action={'#'}>
                        <div className={this.state.error ? 'form-group has-danger' : 'form-group'}>
                            <input
                                style={{marginBottom: '12px'}}
                                id={'input--api-key-modal--api-key'}
                                ref={(apiKey) => { this.apiKey = apiKey }}
                                className={'form-control'}
                                type={'text'}
                                placeholder={''}/>
                        </div>
                    </form>
                </ModalBody>
                <ModalFooter style={{textAlign: 'right'}}>
                    <Button
                        id={'button--api-key-modal--logout'}
                        onClick={this.logout}
                        text={Strings.log_out}
                        style={{marginRight: '20px'}}/>
                    <Button
                        id={'button--api-key-modal--submit'}
                        onClick={this.saveApiKey}
                        kind={'bold'}
                        text={Strings.save_key}/>
                </ModalFooter>
            </Modal>
        )
    }
}
