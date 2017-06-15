import React from 'react'
import Radium from 'radium'
import { Link } from 'react-router-dom'
import MarkdownIt from 'markdown-it'
import markdownItAttrs from 'markdown-it-attrs'

import Button from '../Button'
import Styles from '../Styles'

@Radium
export default class DevsGuide extends React.Component {
    componentWillMount() {
        var md = new MarkdownIt()
        md.use(markdownItAttrs)

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
            <div className='docs-body' style={{ maxWidth: '840px', margin: 'auto'}} dangerouslySetInnerHTML={{__html: this.state.markdown}} />
        )
    }
}
