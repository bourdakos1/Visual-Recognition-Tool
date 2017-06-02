import React from 'react'
import Radium from 'radium'
import { Link } from 'react-router-dom'

import Button from './Button'
import Styles from './Styles'

@Radium
export default class Demo extends React.Component {
    render() {
        var logo = {
            height: '60px',
            float: 'left',
            cursor: 'pointer',
        }

        var title = {
            font: Styles.fontTitle,
            color: Styles.colorTextDark,
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

        var active = {
            color: Styles.colorPrimary,
        }

        var shadow = {
            // boxShadow: '0 1px 1px rgba(0, 0, 0, 0.1)',
            background: '#fff',
            height: '65px',
        }

        var section = {
            borderTop: '1px solid #d3d3d3',
            display: 'flex',
            justifyContent: 'center', /* align horizontal */
            alignItems: 'center', /* align vertical */
            position: 'fixed',
            bottom: '120px',
            left: '0',
            right: '0',
            top: '85px',
            paddingRight: '300px',
            // backgroundColor: Styles.colorPrimary,
        }

        var results = {
            borderLeft: '1px solid #d3d3d3',
            width: '300px',
            position: 'fixed',
            bottom: '120px',
            right: '0',
            top: '85px',
            // backgroundColor: Styles.colorPrimary,
        }

        var contentWrapper = {
            // maxWidth: '1000px',
            width: '100%',
            height: '100%',
            padding: '0 30px 0 20px',
            marginTop: '10px',
            marginBottom: '10px',
            display: 'flex',
            lineHeight: '65px',
            alignItems: 'center',
        }

        var user = {
            whiteSpace:'nowrap',
            overflow:'hidden',
            textOverflow:'ellipsis',
        }

        var button = {
            display: 'flex',
            flex: 'none'
        }

        var apibutton = {
            font: Styles.fontHeader,
            fontWeight: '200',
            padding: '10px 40px 10px 40px',
            height: 'auto',
            borderRadius: '100px',
        }

        var content = {
            maxWidth: '1000px',
            width: '100%',
            margin: 'auto',
        }

        var sdk = {
            width: '80px',
            height: '80px',

            padding: '0',
            margin: '0',

            overflow: 'hidden',
            textIndent: '101%',
            whiteSpace: 'nowrap',
            margin: '5px 20px',
            display: 'block',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            opacity: '.8',
            ':hover': {
                opacity: '1',
            }
        }

        var sdkActive = {
            opacity: '1',
            border: '2px solid #F9F9FB',
            outline: '2px solid' + Styles.colorPrimary,
        }

        var bar = {
            position: 'fixed',
            bottom: '0',
            left: '0',
            right: '0',
            margin: '1.5em 0 0',
            padding: '1em',
            background: '#F9F9FB',
            borderTop: '1px solid #d3d3d3',
        }

        var node = {
            backgroundImage: 'url(/demo_photos/1.jpg)',
            backgroundSize: 'auto 80px',
        }

        var swift = {
            backgroundImage: 'url(/demo_photos/2.jpg)',
            backgroundSize: 'auto 80px',
        }

        var android = {
            backgroundImage: 'url(/demo_photos/3.jpg)',
            backgroundSize: '80px auto',
        }

        var python = {
            backgroundImage: 'url(/demo_photos/4.jpg)',
            backgroundSize: '80px auto',
        }

        var java = {
            backgroundImage: 'url(/demo_photos/5.jpg)',
            backgroundSize: 'auto 80px',
        }

        var unity = {
            backgroundImage: 'url(/demo_photos/6.jpg)',
            backgroundSize: '80px auto',
        }

        var net = {
            backgroundImage: 'url(/demo_photos/7.jpg)',
            backgroundSize: 'auto 80px',
        }

        return (
            <div>
                <div style={shadow}>
                    <div style={contentWrapper}>
                        <Link to='/' style={logo}><img src={'/watson_color.png'} style={logo}></img></Link>
                        <Link to='/' style={titleLink}>Watson Vision</Link>

                        <a href='/demo' key='a' style={[link, active]}>Demo</a>
                        <a href='/' key='b' style={link}>Pricing</a>
                        <a href='/' key='c' style={[link, last]}>Documentation</a>

                        <a style={{textDecoration: 'none'}} href='/tool'>
                            <Button
                                style={[button, {padding: '0 35px'}]}
                                id={'button--base--update-api-key'}
                                onClick={null}
                                text={localStorage.getItem('api_key') == 'undefined'
                                    || localStorage.getItem('api_key') == null
                                    || localStorage.getItem('api_key') == '' ? 'Login' : 'Vision Tool'}/>
                        </a>
                    </div>
                </div>

                <div style={section}>
                    <img src={'/demo_photos/1.jpg'} style={{
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                        borderRadius: '5px'
                    }}/>
                </div>

                <div style={results}>
                </div>

                <div style={bar}>
                    <ul style={{textAlign: 'center', padding: '0', margin: '0'}}>
                        <li style={{display: 'inline-block'}}>
                            <a key='node' style={[sdk, node, sdkActive]} title="Node.js" href="#">Node.js</a>
                        </li>
                        <li style={{display: 'inline-block'}}>
                            <a key='swift' style={[sdk, swift]} title="Swift" href="#">Swift</a>
                        </li>
                        <li style={{display: 'inline-block'}}>
                            <a key='android' style={[sdk, android]} title="Android" href="#">Android</a>
                        </li>
                        <li style={{display: 'inline-block'}}>
                            <a key='python' style={[sdk, python]} title="Python" href="#">Python</a>
                        </li>
                        <li style={{display: 'inline-block'}}>
                            <a key='java' style={[sdk, java]} title="Java" href="#">Java</a>
                        </li>
                        <li style={{display: 'inline-block'}}>
                            <a key='unity' style={[sdk, unity]} title="Unity" href="#">Unity</a>
                        </li>
                        <li style={{display: 'inline-block'}}>
                            <a key='net' style={[sdk, net]} title=".NET Standard" href="#">.NET Standard</a>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}
