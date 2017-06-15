import React from 'react'
import Radium from 'radium'
import { Link } from 'react-router-dom'
import MarkdownIt from 'markdown-it'

import Button from '../Button'
import Styles from '../Styles'

@Radium
export default class DevsGuide extends React.Component {
    componentWillMount() {
        var md = new MarkdownIt()

        fetch('../README.md').then((response) => {
            return response.text()
        }).then((text) => {
            this.setState({
                markdown: md.render(text)
            }, () => {
                Prism.highlightAll()
            })
        })
    }

    render() {
        return (
            <div dangerouslySetInnerHTML={{__html: this.state.markdown}} />
        )
    }
}
