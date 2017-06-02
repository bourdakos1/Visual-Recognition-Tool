import React from 'react'
import Radium from 'radium'
import { Link } from 'react-router-dom'

import Button from './Button'
import Styles from './Styles'

@Radium
export default class TestPage extends React.Component {
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

        var section = {
            height: '566px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: '0 0 0 80px'
            // backgroundColor: 'red',
            // backgroundColor: Styles.colorPrimary,
        }

        var section2 = {
            height: '500px',
            // backgroundColor: 'blue',
            backgroundColor: Styles.colorPrimary,
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
            width: '41px',
            height: '40px',
            backgroundSize: '41px 40px',

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

        var bar = {
            margin: '1.5em 0 0',
            padding: '1em',
            background: '#F9F9FB',
            borderTop: '1px solid #d3d3d3',
        }

        var node = {
            backgroundImage: 'url(/sdk_icons/node.png)',
        }

        var swift = {
            backgroundImage: 'url(/sdk_icons/swift.png)',
        }

        var android = {
            backgroundImage: 'url(/sdk_icons/android.png)',
        }

        var python = {
            backgroundImage: 'url(/sdk_icons/python.png)',
        }

        var java = {
            backgroundImage: 'url(/sdk_icons/java.png)',
        }

        var unity = {
            backgroundImage: 'url(/sdk_icons/unity.png)',
        }

        var net = {
            backgroundImage: 'url(/sdk_icons/dot-net-standard.png)',
            width: '48px',
            height: '40px',
            backgroundSize: '48px 40px',
        }

        return (
            <div>
                <div style={shadow}>
                    <div style={contentWrapper}>
                        <Link to='/test_page' style={logo}><img src={'/watson_color.png'} style={logo}></img></Link>
                        <Link to='/test_page' style={titleLink}>Watson Vision</Link>

                        <div key='a' style={link}>Demo</div>
                        <div key='b' style={link}>Pricing</div>
                        <div key='c' style={[link, last]}>Documentation</div>

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
                    <div style={{flex: '1.31803398875'}}>
                        <img src={'/test.png'} style={{
                            width: '100%',
                            height: '100%'
                        }}></img>
                    </div>
                    <div style={{flex: '1'}}>
                        <div style={{
                            font: Styles.fontTitle,
                            fontWeight: '200',
                            textAlign: 'center',
                            marginBottom: '35px'}}>
                            Understand images in 5 lines of code
                        </div>
                        <div style={{textAlign: 'center'}}>
                            <a style={{textDecoration: 'none'}} href='https://console.ng.bluemix.net/catalog/services/visual-recognition/' target='_blank'>
                                <Button
                                    style={[apibutton]}
                                    onClick={null}
                                    kind={'bold'}
                                    text={'Get a free API key'}/>
                            </a>
                        </div>
                    </div>
                </div>
                <div style={section2}>
                    <div style={bar}>
                        <ul style={{textAlign: 'center', padding: '0', margin: '0'}}>
                            <li style={{display: 'inline-block'}}>
                                <a key='node' style={[sdk, node]} title="Node.js" href="#">Node.js</a>
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
                <div style={section}>
                </div>
            </div>
        )
    }
}
