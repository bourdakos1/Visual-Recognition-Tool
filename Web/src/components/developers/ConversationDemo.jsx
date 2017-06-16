import React from 'react'
import Radium, { StyleRoot } from 'radium'
import request from 'superagent'
import { Link } from 'react-router-dom'
import Dropzone from 'react-dropzone'

import Button from '../Button'
import Styles from '../Styles'
import Strings from '../Strings'

@Radium
export default class ConversationDemo extends React.Component {
    render() {
        return (
            <div style={{position: 'fixed', top: '115px', bottom: '0', left: '0', right: '0'}}>
                <iframe style={{padding: '0 330px', outline: 'none', border: 'none', height: '100%', width: '100%'}} src="https://conversation-try-buy.mybluemix.net">
                    <p>Your browser does not support iframes.</p>
                </iframe>
            </div>
        )
    }
}
