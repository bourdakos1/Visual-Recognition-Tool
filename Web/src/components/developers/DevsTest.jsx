import React from 'react'
import Radium from 'radium'
import { Link } from 'react-router-dom'

import Button from '../Button'
import Styles from '../Styles'

@Radium
export default class DevsTest extends React.Component {
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
            color: 'white',
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
            // background: '#fff',
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
            height: 'auto',
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

        return (
            <div>
                {/* START OF SERVICES */}

                <div style={{
                    flex: '2',
                    font: Styles.fontDefault,
                    fontSize: '18px',
                    lineHeight: '1.2',
                    fontWeight: '700',
                    color: Styles.colorTextDark,
                    maxWidth: '1000px',
                    // opacity: '0.6',
                    marginTop: '80px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    textAlign: 'center'
                }}>
                    Choose a service to get started
                </div>

                <div style={[section, {
                        height: 'auto',
                        padding: '0',
                        marginTop: '10px',
                        maxWidth: '1000px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                }]}>

                {/* ROW 1 */}
                <div style={[section, {
                    height: 'auto',
                    padding: '0',
                    marginTop: '20px',
                    maxWidth: '1000px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    border: '1px solid #f3f3f3',
                    borderRadius: '5px',
                }]}>

                {/* CONVERSATION */}
                    <a href='/docs/guide/conversation'
                        key={0}
                        style={{
                        flex: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        alignSelf: 'flex-start',
                        textDecoration: 'none',
                        borderRight: '1px solid #f3f3f3',
                        paddingBottom: '20px',
                        transition: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
                        overflow: 'hidden',
                        borderRadius: '5px 0 0 5px',
                        ':hover': {
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        }
                    }}>
                        <img src={'/services/conversation.png'} style={{
                            width: '200px',
                            height: '200px'
                        }}/>

                        <div style={{
                            font: Styles.fontTitle,
                            fontSize: '2.8em',
                            color: Styles.colorTextDark,
                            fontWeight: '200',
                            marginBottom: '12px'
                        }}>
                            Conversation
                        </div>
                        <div style={{
                            font: Styles.fontDefault,
                            fontSize: '1.2em',
                            lineHeight: '1.4em',
                            color: Styles.colorTextDark,
                            opacity: '0.6',
                            textAlign: 'center'
                        }}>
                            Build chatbots that understand natural language and deploy them anywhere.
                        </div>
                    </a>

                    {/* DISCOVERY */}
                    <a href='https://www.ibm.com/watson/developercloud/doc/discovery/index.html'
                        key={1}
                        style={{
                        flex: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        alignSelf: 'flex-start',
                        textDecoration: 'none',
                        paddingBottom: '20px',
                        transition: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
                        overflow: 'hidden',
                        borderRadius: '0',
                        ':hover': {
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        }
                    }}>
                        <img src={'/services/discovery.png'} style={{
                            width: '200px',
                            height: '200px'
                        }}/>

                        <div style={{
                            font: Styles.fontTitle,
                            fontSize: '2.8em',
                            color: Styles.colorTextDark,
                            fontWeight: '200',
                            marginBottom: '12px'
                        }}>
                            Discovery
                        </div>
                        <div style={{
                            font: Styles.fontDefault,
                            fontSize: '1.2em',
                            lineHeight: '1.4em',
                            color: Styles.colorTextDark,
                            opacity: '0.6',
                            textAlign: 'center'
                        }}>
                            Rapidly build a cognitive search and content analytics engine.
                        </div>
                    </a>

                    {/* VISION */}
                    <a href='/docs/guide/vision'
                        key={2}
                        style={{
                        flex: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        alignSelf: 'flex-start',
                        textDecoration: 'none',
                        borderLeft: '1px solid #f3f3f3',
                        paddingBottom: '20px',
                        transition: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
                        overflow: 'hidden',
                        borderRadius: '0 5px 5px 0',
                        ':hover': {
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        }
                    }}>
                        <img src={'/services/vision3.png'} style={{
                            width: '200px',
                            height: '200px'
                        }}/>

                        <div style={{
                            font: Styles.fontTitle,
                            fontSize: '2.8em',
                            color: Styles.colorTextDark,
                            fontWeight: '200',
                            marginBottom: '12px'
                        }}>
                            Vision
                        </div>
                        <div style={{
                            font: Styles.fontDefault,
                            fontSize: '1.2em',
                            lineHeight: '1.4em',
                            color: Styles.colorTextDark,
                            opacity: '0.6',
                            textAlign: 'center'
                        }}>
                            Tag photos, recognize food, locate faces, and find similar images in a collection.
                        </div>
                    </a>
                </div>
                </div>

            </div>
        )
    }
}
