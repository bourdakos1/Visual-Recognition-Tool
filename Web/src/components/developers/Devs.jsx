import React from 'react'
import Radium from 'radium'
import { Link } from 'react-router-dom'

import Button from '../Button'
import Styles from '../Styles'

@Radium
export default class Devs extends React.Component {
    componentDidMount() {
        Prism.highlightAll()

        // var width = this.centerText.offsetWidth
        //
        // this.centerTextParent.style.width = width
        // this.centerText.style.width = width
    }

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
                <div style={[section, {
                        height: '600px',
                        margin: '0',
                        padding: '0',
                        backgroundColor: '#282c34',
                        marginTop: '-110px'
                }]}></div>


                <div style={[section, {
                        height: 'auto',
                        padding: '0',
                        marginTop: '100px',
                        maxWidth: '1200px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        paddingLeft: '20px',
                        paddingRight: '20px'
                }]}>
                    <div style={{
                        width: '100%',
                        font: Styles.fontDefault,
                        fontSize: '1.2em',
                        lineHeight: '1.4em',
                        color: Styles.colorTextDark,
                        opacity: '0.6',
                        paddingLeft: '40px',
                        paddingRight: '40px',
                        textAlign: 'center'
                    }}>
                        SERVICES
                    </div>
                </div>

                <div style={[section, {
                        height: 'auto',
                        padding: '0',
                        marginTop: '60px',
                        maxWidth: '1200px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        paddingLeft: '20px',
                        paddingRight: '20px',
                        marginBottom: '150px',
                }]}>
                    <a href='https://www.ibm.com/watson/developercloud/doc/conversation/index.html'
                        style={{
                        flex: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        alignSelf: 'flex-start',
                        marginRight: '40px',
                        textDecoration: 'none'
                    }}>
                        <img src={'/services/conversation.png'} style={{
                            width: '300px',
                            height: '300px'
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
                            opacity: '0.6'
                        }}>
                            Build chatbots that understand natural language and deploy them anywhere.
                        </div>
                    </a>

                    <a href='https://www.ibm.com/watson/developercloud/doc/discovery/index.html'
                        style={{
                        flex: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        alignSelf: 'flex-start',
                        marginRight: '40px',
                        marginLeft: '40px',
                        textDecoration: 'none'
                    }}>
                        <img src={'/services/discovery.png'} style={{
                            width: '300px',
                            height: '300px'
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
                            opacity: '0.6'
                        }}>
                            Rapidly build a cognitive search and content analytics engine.
                        </div>
                    </a>

                    <a href='https://www.ibm.com/watson/developercloud/doc/visual-recognition/index.html'
                        style={{
                        flex: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        alignSelf: 'flex-start',
                        marginLeft: '40px',
                        textDecoration: 'none'
                    }}>
                        <img src={'/services/vision.png'} style={{
                            width: '300px',
                            height: '300px'
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
                            opacity: '0.6'
                        }}>
                            Tag photos, recognize food, locate faces, and find similar images in a collection.
                        </div>
                    </a>
                </div>


                <div style={[section, {
                        height: 'auto',
                        padding: '0',
                        marginTop: '60px',
                        maxWidth: '1200px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        paddingLeft: '20px',
                        paddingRight: '20px',
                        marginBottom: '150px',
                }]}>
                    <a href='https://www.ibm.com/watson/developercloud/doc/speech-to-text/index.html'
                        style={{
                        flex: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        alignSelf: 'flex-start',
                        marginRight: '40px',
                        textDecoration: 'none'
                    }}>
                        <img src={'/services/speech-to-text.png'} style={{
                            width: '300px',
                            height: '300px'
                        }}/>

                        <div style={{
                            font: Styles.fontTitle,
                            fontSize: '2.8em',
                            color: Styles.colorTextDark,
                            fontWeight: '200',
                            marginBottom: '12px'
                        }}>
                            Speech To Text
                        </div>
                        <div style={{
                            font: Styles.fontDefault,
                            fontSize: '1.2em',
                            lineHeight: '1.4em',
                            color: Styles.colorTextDark,
                            opacity: '0.6'
                        }}>
                            Convert human voice into written word and recognize multiple different speakers.
                        </div>
                    </a>

                    <a href='https://www.ibm.com/watson/developercloud/doc/language-translator/index.html'
                        style={{
                        flex: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        alignSelf: 'flex-start',
                        marginRight: '40px',
                        marginLeft: '40px',
                        textDecoration: 'none'
                    }}>
                        <img src={'/services/translation.png'} style={{
                            width: '300px',
                            height: '300px'
                        }}/>

                        <div style={{
                            font: Styles.fontTitle,
                            fontSize: '2.8em',
                            color: Styles.colorTextDark,
                            fontWeight: '200',
                            marginBottom: '12px'
                        }}>
                            Translation
                        </div>
                        <div style={{
                            font: Styles.fontDefault,
                            fontSize: '1.2em',
                            lineHeight: '1.4em',
                            color: Styles.colorTextDark,
                            opacity: '0.6',
                        }}>
                            Translate text from one language to another.
                        </div>
                    </a>

                    <a href='https://www.ibm.com/watson/developercloud/doc/text-to-speech/index.html'
                        style={{
                        flex: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        alignSelf: 'flex-start',
                        marginLeft: '40px',
                        textDecoration: 'none'
                    }}>
                        <img src={'/services/translation.png'} style={{
                            width: '300px',
                            height: '300px'
                        }}/>

                        <div style={{
                            font: Styles.fontTitle,
                            fontSize: '2.8em',
                            color: Styles.colorTextDark,
                            fontWeight: '200',
                            marginBottom: '12px'
                        }}>
                            Text To Speech
                        </div>
                        <div style={{
                            font: Styles.fontDefault,
                            fontSize: '1.2em',
                            lineHeight: '1.4em',
                            color: Styles.colorTextDark,
                            opacity: '0.6'
                        }}>
                            Detect location of faces in a photo, including data such as gender and age.
                        </div>
                    </a>
                </div>

                <div style={[section, {
                        height: 'auto',
                        padding: '0',
                        marginTop: '60px',
                        maxWidth: '1200px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        paddingLeft: '20px',
                        paddingRight: '20px',
                        marginBottom: '150px',
                }]}>
                    <a href='https://www.ibm.com/watson/developercloud/doc/document-conversion/index.html'
                        style={{
                        flex: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        alignSelf: 'flex-start',
                        marginRight: '40px',
                        textDecoration: 'none'
                    }}>
                        <img src={'/services/translation.png'} style={{
                            width: '300px',
                            height: '300px'
                        }}/>

                        <div style={{
                            font: Styles.fontTitle,
                            fontSize: '2.8em',
                            color: Styles.colorTextDark,
                            fontWeight: '200',
                            marginBottom: '12px'
                        }}>
                            Document Conversion
                        </div>
                        <div style={{
                            font: Styles.fontDefault,
                            fontSize: '1.2em',
                            lineHeight: '1.4em',
                            color: Styles.colorTextDark,
                            opacity: '0.6'
                        }}>
                            Understand the contents of images through various keyword tags.
                        </div>
                    </a>

                    <a href='https://www.ibm.com/watson/developercloud/doc/tone-analyzer/index.html'
                        style={{
                        flex: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        alignSelf: 'flex-start',
                        marginRight: '40px',
                        marginLeft: '40px',
                        textDecoration: 'none'
                    }}>
                        <img src={'/services/translation.png'} style={{
                            width: '300px',
                            height: '300px'
                        }}/>

                        <div style={{
                            font: Styles.fontTitle,
                            fontSize: '2.8em',
                            color: Styles.colorTextDark,
                            fontWeight: '200',
                            marginBottom: '12px'
                        }}>
                            Tone Analyzer
                        </div>
                        <div style={{
                            font: Styles.fontDefault,
                            fontSize: '1.2em',
                            lineHeight: '1.4em',
                            color: Styles.colorTextDark,
                            opacity: '0.6'
                        }}>
                            Enhanced specificity and accuracy for food items, based on over 2,000 tags.
                        </div>
                    </a>

                    <a href='https://www.ibm.com/watson/developercloud/doc/personality-insights/index.html'
                        style={{
                        flex: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        alignSelf: 'flex-start',
                        marginLeft: '40px',
                        textDecoration: 'none'
                    }}>
                        <img src={'/services/translation.png'} style={{
                            width: '300px',
                            height: '300px'
                        }}/>

                        <div style={{
                            font: Styles.fontTitle,
                            fontSize: '2.8em',
                            color: Styles.colorTextDark,
                            fontWeight: '200',
                            marginBottom: '12px'
                        }}>
                            Personality Insights
                        </div>
                        <div style={{
                            font: Styles.fontDefault,
                            fontSize: '1.2em',
                            lineHeight: '1.4em',
                            color: Styles.colorTextDark,
                            opacity: '0.6'
                        }}>
                            Detect location of faces in a photo, including data such as gender and age.
                        </div>
                    </a>
                </div>

            </div>
        )
    }
}
