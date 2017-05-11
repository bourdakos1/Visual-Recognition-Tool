import React from 'react'

import TitleBar from './TitleBar'

export default class Base extends React.Component {
    render() {
        var content = {
            maxWidth: '1000px',
            width: '100%',
            margin: 'auto'
        }

        return (
            <div>
                <TitleBar showModal={this.props.showModal}/>
                <div style={content}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}
