import React from 'react'
import Radium from 'radium'
import { Modal, ModalBody } from 'reactstrap'
import QRCode from 'qrcode.react'

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

        var textStyles = {
            base: {
                color: Styles.colorTextDark,
                font: Styles.fontDefault,
                maxWidth: '550px',
                letterSpacing: '.01rem',
                fontWeight: '400',
                fontStyle: 'normal',
                lineHeight: '1.58',
                letterSpacing: '-.003em',
            },
            header2: {
                color: Styles.colorTextDark,
                font: Styles.fontHeader,
                letterSpacing: '-.02em',
                fontWeight: '700',
                fontStyle: 'normal',
                fontSize: '24px',
                marginLeft: '-1.5px',
                lineHeight: '1.22',
                letterSpacing: '-.018em',
            }
        }

        return (
            <Modal id={'credentials-modal'} isOpen={this.state.modal} toggle={this.toggle}>
                <div className={'modal-header'}>
                    <div style={title}></div>
                    <button onClick={this.toggle} style={deleteStyle} />
                </div>
                <ModalBody>
                    <div style={{width: '300px', margin: 'auto', marginTop: '30px', marginBottom: '30px'}} >
                        <QRCode size={300} value={localStorage.getItem('api_key')} />
                    </div>
                </ModalBody>
            </Modal>
        )
    }
}
