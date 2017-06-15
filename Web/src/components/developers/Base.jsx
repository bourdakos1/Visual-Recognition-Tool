import React from 'react'
import Radium from 'radium'
import { Link } from 'react-router-dom'

import Button from '../Button'
import Styles from '../Styles'
import Strings from '../Strings'
import ServiceDropDown from './ServiceDropDown'

@Radium
export default class Base extends React.Component {
    render() {
        var logo = {
            height: '60px',
            float: 'left',
            cursor: 'pointer',
        }

        var titleStrangeBug = {
            font: Styles.fontTitle,
            color: Styles.colorTextDark,
            marginRight: '10px',
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
            color: '#8f8f8f',
            textDecoration: 'none',
            // float: 'left',
            minWidth: '0px',
            marginRight: '30px',
            cursor: 'pointer',
            display: 'flex',
            ':hover': {
                color: '#666666'
            }
        }

        var linkActive = {
            color: Styles.colorPrimary,
            ':hover': {
                color: Styles.colorPrimary
            }
        }

        var shadow = {
            boxShadow: '0 1px 1px rgba(0, 0, 0, 0.1)',
            background: '#fff',
            height: '115px',
        }

        var contentWrapper = {
            // maxWidth: '1000px',
            width: '100%',
            height: '66px',
            padding: '0 30px 0 20px',
            // marginTop: '10px',
            display: 'flex',
            lineHeight: '66px',
            alignItems: 'center',
        }

        var navWrapper = {
            // maxWidth: '1000px',
            width: 'auto',
            height: '49px',
            padding: '0 0px 0 0px',
            display: 'flex',
            lineHeight: '49px',
            alignItems: 'center',
            marginLeft: '30px',
            marginRight: '30px',
            borderTop: '1px solid #f3f3f3'
        }

        var button = {
            display: 'flex',
            flex: 'none'
        }

        var demo = this.props.location.pathname == Strings.DEMO_PATH
        var guide = this.props.location.pathname == Strings.GUIDE_PATH
        var api = false
        var tutorials = false
        var sdk = false

        return (
            <div>
                <div style={shadow}>
                    <div style={contentWrapper}>
                        <Link to='/docs' style={logo}><img src={'/watson_color.png'} style={logo}></img></Link>
                        <Link to='/docs' style={titleLink}>Developers</Link>
                        <span style={[titleStrangeBug, {fontWeight: 'normal', color: Styles.colorTextLight}]}>/</span>
                        <ServiceDropDown style={[titleLink, {fontWeight: 'normal'}, last]}>Vision</ServiceDropDown>

                        <a style={{textDecoration: 'none'}} href='/tool' target='_blank'>
                            <Button
                                style={[button, {padding: '0 35px'}]}
                                onClick={null}
                                text={'Launch Tool'}/>
                        </a>
                    </div>
                    <div style={navWrapper}>
                        <a href='/docs/demo' key='0' style={[link, demo ? linkActive : null]}>Demo</a>
                        <a href='/docs/guide' key='1' style={[link, guide ? linkActive : null]}>Guide</a>
                        <a href='/docs/guide2' key='2' style={[link, api ? linkActive : null]}>API Reference</a>
                        <a href='/docs/guide2' key='3' style={[link, tutorials ? linkActive : null]}>Tutorials</a>
                        <a href='/docs/guide2' key='4' style={[link, sdk ? linkActive : null]}>SDK</a>
                    </div>
                </div>
                {this.props.children}
            </div>
        )
    }
}
