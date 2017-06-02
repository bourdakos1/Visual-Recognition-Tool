import React from 'react'

import TitleBar from './TitleBar'

export default class Base extends React.Component {
    render() {
        document.body.style.backgroundColor = '#fafafa'
        document.body.style.paddingTop = '66px'

        var content = {
            maxWidth: '1000px',
            width: '100%',
            margin: 'auto',
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
