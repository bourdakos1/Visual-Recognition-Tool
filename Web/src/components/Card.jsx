import React from 'react'
import Radium from 'radium'

import Styles from './Styles'

@Radium
export default class Card extends React.Component {
    render() {
        var cardStyle = {
            width: '100%',
            marginBottom:'40px',
            borderRadius: '5px',
            borderColor: '#dedede',
            borderWidth: 'thin',
            borderStyle: 'solid',
            background: 'white',
            padding: '12px',
        }

        return (
            <div style={[cardStyle, this.props.style]}>
                {this.props.children}
            </div>
        )
    }
}
