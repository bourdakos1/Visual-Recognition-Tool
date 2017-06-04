import React from 'react'
import Radium from 'radium'
import request from 'superagent'
import { Link } from 'react-router-dom'

import Button from './Button'
import DropButton from './DropButton'
import Styles from './Styles'
import Strings from './Strings'
import ColorFinder from './ColorFinder'

@Radium
export default class Demo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            images: [
                '/demo_photos/1.jpg',
                '/demo_photos/2.jpg',
                '/demo_photos/3.jpg',
                '/demo_photos/4.jpg',
                '/demo_photos/5.jpg',
                '/demo_photos/6.jpg',
                '/demo_photos/7.jpg',
            ],
            activeImage: 0
        }
    }

    lumanance = (color) => {
        var r = this.hexToR(color)
        var g = this.hexToG(color)
        var b = this.hexToB(color)

        var uicolors = [r / 255, g / 255, b / 255]

        var c = uicolors.map((c) => {
            if (c <= 0.03928) {
                return c / 12.92
            } else {
                return Math.pow((c + 0.055) / 1.055, 2.4)
            }
        })

        return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
    }

    computeTextColor = (color) => {
        var L = this.lumanance(color)

        return (L > 0.27403703492) ? 'rgba(0, 0, 0, .75)' : '#ffffff'
    }

    computeBorder = (color) => {
        var L = this.lumanance(color)

        return (L > 1 - 0.27403703492)
    }

    borderColor = (color) => {
        var r = this.hexToR(color) - 20
        var g = this.hexToG(color) - 20
        var b = this.hexToB(color) - 20

        return 'rgb(' + r + ', ' + g + ', ' + b + ')'
    }

    cutHex = (h) => {
        return (h.charAt(0) == "#") ? h.substring(1, 7) : h
    }

    hexToR = (h) => {
        return parseInt((this.cutHex(h)).substring(0, 2), 16)
    }

    hexToG = (h) => {
        return parseInt((this.cutHex(h)).substring(2, 4), 16)
    }

    hexToB = (h) => {
        return parseInt((this.cutHex(h)).substring(4, 6), 16)
    }

    findColor = (name) => {
        return ColorFinder.filter((color) => {
            return color[1].toLowerCase() == name.slice(0, -6).toLowerCase()
        })
    }

    componentDidMount() {
        this.classify(0)
    }

    chooseImage = (i) => {
        this.setState({
            activeImage: i.target.id
        })

        this.classify(i.target.id)
    }

    classify = (i) => {
        var self = this
        var req

        self.setState({ error: null })

        req = request.post('/api/classify')
        req.query({classifier_ids: ['default', 'food']})
        req.query({threshold: 0.0})

        // Just send the url of the image, we have the file on the server.
        req.query({fileUrl: this.state.images[i]})

        req.query({api_key: localStorage.getItem('api_key')})

        req.end(function(err, res) {
            var general
            var food
            var colors
            if (res.body != null && res.body.images != null) {
                console.log(res.body.images[0].classifiers)
                if (res.body.images[0].classifiers != null && res.body.images[0].classifiers.length > 0 ) {
                    res.body.images[0].classifiers.map((classifier) => {
                        if (classifier.name == 'food') {
                            food = classifier.classes.filter((item) => {
                                return item.class != 'non-food'
                            })
                            food.sort(function(a, b) {
                                return b.score - a.score
                            })
                        } else if (classifier.name == 'default') {
                            general = classifier.classes.filter((item) => {
                                // Check if its negitive one first, otherwise if the world is 4 letters it won't show
                                return item.class.toLowerCase().indexOf("color") == -1 || item.class.toLowerCase().indexOf("color") != item.class.length - 5
                            })
                            colors = classifier.classes.filter((item) => {
                                // We could do >= 0 zero but the first word shouldn't ever be color...
                                return item.class.toLowerCase().indexOf("color") > 0 && item.class.toLowerCase().indexOf("color") == item.class.length - 5
                            })
                            general.sort(function(a, b) {
                                return b.score - a.score
                            })
                            colors.sort(function(a, b) {
                                return b.score - a.score
                            })
                        }
                    })
                }
            }
            self.setState({ general: general, food: food, colors: colors })
        })
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
            width: '360px',
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

        var image = {
            width: '80px',
            height: '80px',
            cursor: 'pointer',

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
            backgroundSize: 'cover',
            ':hover': {
                opacity: '1',
            }
        }

        var imageActive = {
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

        var classSection = {
            padding: '14px',
            borderTop: '1px solid #d3d3d3',
            color: '#999999',
            font: Styles.fontDefault
        }

        var textStyles = {
            base: {
                color: Styles.colorTextLight,
                font: Styles.fontDefault,
            },
            dark: {
                color: Styles.colorTextDark,
            },
            topClass: {
                color: Styles.colorTextDark,
                font: Styles.fontHeader,
            },
            topScore: {
                color: Styles.colorTextLight,
                font: Styles.fontHeader,
                fontWeight: '200',
            },
        }

        var resultStyle = {
            paddingLeft: '15px',
            paddingRight: '15px',
            paddingTop: '10px',
        }

        var progressSmall = {
          width: '80px',
          height: '5px',
        }

        var progressWrapSmall = {
            borderRadius: '2.5px',
            background: '#e1e1e1',
            margin: '0 0 0 0',
            overflow: 'hidden',
            position: 'relative',
        }

        var progressBarSmall = {
            borderRadius: '2.5px',
            left: '0',
            position: 'absolute',
            top: '0',
        }

        var list = {
            padding: '0',
            margin: '14px',
            marginTop: '6px',
            marginBottom: '20px',
            listStyle: 'none',
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
                    <img src={this.state.images[this.state.activeImage]} style={{
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                        borderRadius: '5px',
                        display: 'inline-flex',
                        margin: 'auto',
                        maxHeight: '80%',
                        maxWidth: '80%'
                    }}/>
                </div>

                <div style={results}>
                    <div style={{overflowY: 'auto', height: '100%'}}>
                        {this.state.food && this.state.food.length > 0?
                            <div>
                                <div style={[classSection, {border: 'none'}]}>Food</div>
                                <ul style={list}>
                                    {this.state.food.map(function(result, index){
                                        var color = '#64dd17'
                                         if (result.score <= .50) {
                                            color = '#F44336'
                                        } else if (result.score <= .75) {
                                            color = '#ffab00'
                                        }
                                        return (
                                            <li key={result.class}>
                                                <div style={resultStyle, {display: 'flex', alignItems: 'center', marginBottom: '14px'}}>
                                                    <div style={[textStyles.base, textStyles.dark, {display: 'flex', marginRight: 'auto'}]}><b>{result.class}</b></div>
                                                    <div style={[progressWrapSmall, progressSmall, {display: 'flex', marginRight: '10px'}]}>
                                                        <div style={[progressBarSmall, progressSmall, {width: ~~(result.score * 100) + '%', background: color}]}></div>
                                                    </div>
                                                    <div style={[textStyles.base, {display: 'flex'}]}>{Number(result.score).toFixed(2)}</div>
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>:
                            null
                        }

                        {this.state.general && this.state.general.length > 0?
                            <div>
                                <div style={[classSection, this.state.food && this.state.food.length > 0 ? {null}:{borderTop: '0px solid #d3d3d3'}]}>General</div>
                                    <ul style={list}>
                                        {this.state.general.map(function(result, index){
                                            var color = '#64dd17'
                                             if (result.score <= .50) {
                                                color = '#F44336'
                                            } else if (result.score <= .75) {
                                                color = '#ffab00'
                                            }
                                            return (
                                                <li key={result.class}>
                                                    <div style={resultStyle, {display: 'flex', alignItems: 'center', marginBottom: '14px'}}>
                                                        <div style={[textStyles.base, textStyles.dark, {display: 'flex', marginRight: 'auto'}]}><b>{result.class}</b></div>
                                                        <div style={[progressWrapSmall, progressSmall, {display: 'flex', marginRight: '10px'}]}>
                                                            <div style={[progressBarSmall, progressSmall, {width: ~~(result.score * 100) + '%', background: color}]}></div>
                                                        </div>
                                                        <div style={[textStyles.base, {display: 'flex'}]}>{Number(result.score).toFixed(2)}</div>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </ul>
                            </div>:
                            null
                        }

                        {this.state.colors && this.state.colors.length > 0?
                            <div>
                                <div style={classSection}>Colors</div>
                                {this.state.colors.map((item) => {
                                    return (
                                        <div style={{
                                            border: this.computeBorder(this.findColor(item.class)[0][0])? '1px solid ' + this.borderColor(this.findColor(item.class)[0][0]): '0px solid black',
                                            color: this.computeTextColor(this.findColor(item.class)[0][0]),
                                            font: Styles.fontDefault,
                                            borderRadius: '5px',
                                            margin: '14px',
                                            marginTop: '0px',
                                            padding: 15 * item.score + 'px',
                                            paddingLeft: '14px',
                                            paddingRight: '14px',
                                            width: 'auto',
                                            backgroundColor: '#' + this.findColor(item.class)[0][0]
                                        }}><b>{item.class}</b></div>
                                    )
                                })}
                            </div>:
                            null
                        }
                    </div>
                </div>

                <div style={bar}>
                    <ul style={{textAlign: 'center', padding: '0', margin: '0'}}>
                        {
                            this.state.images.map((url, i) => {
                                return (
                                    <li style={{display: 'inline-block'}}>
                                        <div key={i} id={i} style={[
                                            image,
                                            {backgroundImage: 'url(' + url + ')'},
                                            this.state.activeImage == i ? imageActive : null
                                        ]} onClick={this.chooseImage}>
                                            Image
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }
}
