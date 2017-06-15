import React from 'react'
import Radium from 'radium'
import { Link } from 'react-router-dom'

import Button from '../Button'
import Styles from '../Styles'

@Radium
export default class Base extends React.Component {
    render() {
        var logo = {
            height: '60px',
            float: 'left',
            cursor: 'pointer',
        }

        var titleLink = {
            font: Styles.fontTitle,
            color: Styles.colorTextDark,
            cursor: 'pointer',
            textDecoration: 'none',
            marginRight: '10px',
        }

        var last = {
            marginRight: 'auto',
        }

        var link = {
            font: Styles.fontDefault,
            color: Styles.colorTextLight,
            textDecoration: 'none',
            // float: 'left',
            minWidth: '0px',
            marginLeft: '30px',
            cursor: 'pointer',
            display: 'flex',
            ':hover': {
                color: Styles.colorPrimary
            }
        }

        var shadow = {
            // boxShadow: '0 1px 1px rgba(0, 0, 0, 0.1)',
            background: '#fff',
            height: '65px',
        }

        var contentWrapper = {
            // maxWidth: '1000px',
            width: '100%',
            height: '100%',
            padding: '0 30px 0 20px',
            marginTop: '10px',
            display: 'flex',
            lineHeight: '65px',
            alignItems: 'center',
        }

        var button = {
            display: 'flex',
            flex: 'none'
        }

        return (
            <div>
                <div style={shadow}>
                    <div style={contentWrapper}>
                        <Link to='/docs' style={logo}><img src={'/watson_color.png'} style={logo}></img></Link>
                        <Link to='/docs' style={titleLink}>Watson Vision</Link>

                        <a href='/docs/demo' key='a' style={link}>Demo</a>
                        <a href='/docs/guide' key='b' style={link}>Guide</a>
                        <a href='/docs/guide2' key='c' style={[link, last]}>Guide2</a>

                        <a style={{textDecoration: 'none'}} href='/tool' target='_blank'>
                            <Button
                                style={[button, {padding: '0 35px'}]}
                                onClick={null}
                                text={localStorage.getItem('api_key') == 'undefined'
                                    || localStorage.getItem('api_key') == null
                                    || localStorage.getItem('api_key') == '' ? 'Sign In' : 'Vision Tool'}/>
                        </a>
                    </div>
                </div>
                {this.props.children}
            </div>
        )
    }
}
