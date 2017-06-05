import React from 'react'
import Radium, { StyleRoot } from 'radium'
import request from 'superagent'
import { Link } from 'react-router-dom'
import Dropzone from 'react-dropzone'

import Button from './Button'
import DropButton from './DropButton'
import Styles from './Styles'
import Strings from './Strings'
import ColorFinder from './ColorFinder'

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function lumanance(color) {
    var r = hexToR(color)
    var g = hexToG(color)
    var b = hexToB(color)

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

function cutHex(h) {
    return (h.charAt(0) == "#") ? h.substring(1, 7) : h
}

function hexToR(h) {
    return parseInt((cutHex(h)).substring(0, 2), 16)
}

function hexToG(h) {
    return parseInt((cutHex(h)).substring(2, 4), 16)
}

function hexToB(h) {
    return parseInt((cutHex(h)).substring(4, 6), 16)
}

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
            thumbs: [
                '/demo_photos/thumbs/1.jpg',
                '/demo_photos/thumbs/2.jpg',
                '/demo_photos/thumbs/3.jpg',
                '/demo_photos/thumbs/4.jpg',
                '/demo_photos/thumbs/5.jpg',
                '/demo_photos/thumbs/6.jpg',
                '/demo_photos/thumbs/7.jpg',
            ],
            // This is pretty lazy
            imageSizes: [
                {width: 0, height: 0},
                {width: 0, height:0},
                {width: 450, height: 300},
                {width: 0, height: 0},
                {width: 0, height: 0},
                {width: 490, height: 400},
                {width: 0, height: 0},
            ],
            faceBoxes: [],
            activeImage: 0,
            loading: true
        }
    }

    findFace = (face, size) => {
        var faceBox = {
            display: 'block',
            position: 'absolute',
            zIndex: '2',
            left: (face.face_location.left/size.width) * 100 + '%',
            top: (face.face_location.top/size.height) * 100 + '%',
            width: (face.face_location.width/size.width) * 100 + '%',
            height: (face.face_location.height/(size.height)) * 100 + '%',
            border: '2px solid ' + Styles.colorPrimary,
            boxShadow: '0px 0px 1px 1px rgba(255,255,255,.6)',
        }
        this.setState({
            faceBoxes: [...this.state.faceBoxes, faceBox]
        })
    }

    computeTextColor = (color) => {
        var L = lumanance(color)

        return (L > 0.27403703492) ? 'rgba(0, 0, 0, .75)' : '#ffffff'
    }

    computeBorder = (color) => {
        var L = lumanance(color)

        return (L > 1 - 0.27403703492)
    }

    borderColor = (color) => {
        var r = hexToR(color) - 20
        var g = hexToG(color) - 20
        var b = hexToB(color) - 20

        return 'rgb(' + r + ', ' + g + ', ' + b + ')'
    }

    findColor = (name) => {
        return ColorFinder.filter((color) => {
            return color[1].toLowerCase() == name.slice(0, -6).toLowerCase()
        })
    }

    componentDidMount() {
        this.classify(0)
    }

    isHover = () => {
        this.setState({hover: true})
    }

    notHover = () => {
        this.setState({hover: false})
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

        self.setState({ loading: true, error: null, faceBoxes: [], lastReq: this.state.images[i] })

        req = request.post('/api/classify')
        req.query({classifier_ids: ['default', 'food']})
        req.query({threshold: 0.0})

        // Just send the url of the image, we have the file on the server.
        req.query({fileUrl: this.state.images[i]})

        req.query({api_key: localStorage.getItem('api_key')})

        req.end(function(err, res) {
            console.log(res)
            if (res.body[2].fileUrl != self.state.lastReq) {
                return
            }
            var general
            var food
            var colors
            var faces
            if (res.body != null) {
                res.body.map((classification) => {
                    if (classification.images != null) {
                        if (classification.images[0].classifiers != null && classification.images[0].classifiers.length > 0 ) {
                            classification.images[0].classifiers.map((classifier) => {
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

                        if (classification.images[0].faces != null && classification.images[0].faces.length > 0 ) {
                            classification.images[0].faces.map((face) => {
                                self.findFace(face, self.state.imageSizes[self.state.activeImage])
                            })

                            faces = classification.images[0].faces
                            faces.sort(function(a, b) {
                                return b.score - a.score
                            })
                        }
                    }
                })
            }
            self.setState({ general: general, food: food, colors: colors, faces: faces, loading: false})
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
            // textIndent: '101%',
            whiteSpace: 'nowrap',
            margin: '5px 20px',
            // display: 'block',
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

        var rotateKeyframes = Radium.keyframes({
            '0%': {transform: 'rotate(0deg)'},
            '100%': {transform: 'rotate(360deg)'},
        }, 'rotate');

        var loader = {
            margin: '40px auto',
            border: '4px solid rgba(' + hexToR(Styles.colorPrimary) + ',' + hexToG(Styles.colorPrimary) + ',' + hexToB(Styles.colorPrimary) + ',0.25)',
            borderRadius: '50%',
            borderTop: '4px solid ' + Styles.colorPrimary,
            width: '32px',
            height: '32px',
            animation: 'x .6s linear infinite',
            animationName: rotateKeyframes,
        }

        var droplink = {
            textDecoration: 'none'
        }

        var dropButton = {
            cursor: 'pointer',
            backgroundColor: '#fcfcfc',
            listStyle: 'none',
            height: '80px',
            margin: '5px 20px',
            overflow: 'hidden',
            border: '2px dashed #c2c2c2',
            borderRadius: '0px'
        }

        if (this.state.hover) {
            droplink.textDecoration = 'underline'
            dropButton.border = '2px dashed #959595'
        } else {
            droplink.textDecoration = 'none'
            dropButton.border = '2px dashed #c2c2c2'
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
                    <div style={{
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                        borderRadius: '5px',
                        position: 'relative',
                        display: 'inline-flex',
                        margin: 'auto',
                        maxHeight: '80%',
                        maxWidth: '80%',
                    }}>
                    <img src={this.state.images[this.state.activeImage]} style={{
                        borderRadius: '5px',
                        maxHeight: '100%',
                        maxWidth: '100%'
                    }}/>
                    {this.state.faceBoxes?
                        this.state.faceBoxes.map((faceBox) => {
                            return (
                                <div style={faceBox}/>
                            )
                        }):
                        null
                    }
                    </div>

                </div>

                <div style={results}>
                    {this.state.loading?
                        <StyleRoot>
                            <div style={loader}/>
                        </StyleRoot>:
                        <div style={{overflowY: 'auto', height: '100%'}}>

                            {this.state.faces && this.state.faces.length > 0?
                                <div>
                                    <div style={[classSection, {border: 'none'}]}>Face Detection</div>
                                    <ul style={list}>
                                        {this.state.faces.map(function(face, index){
                                            var color = '#64dd17'
                                             if (face.gender.score <= .50) {
                                                color = '#F44336'
                                            } else if (face.gender.score <= .75) {
                                                color = '#ffab00'
                                            }

                                            var color2 = '#64dd17'
                                             if (face.age.score <= .50) {
                                                color2 = '#F44336'
                                            } else if (face.age.score <= .75) {
                                                color2 = '#ffab00'
                                            }
                                            return (
                                                <li key={index}>
                                                    <div style={resultStyle, {display: 'flex', alignItems: 'center', marginBottom: '14px'}}>
                                                        <div style={[textStyles.base, textStyles.dark, {display: 'flex', marginRight: 'auto'}]}><b>{capitalizeFirstLetter(face.gender.gender)}</b></div>
                                                        <div style={[progressWrapSmall, progressSmall, {display: 'flex', marginRight: '10px'}]}>
                                                            <div style={[progressBarSmall, progressSmall, {width: ~~(face.gender.score * 100) + '%', background: color}]}></div>
                                                        </div>
                                                        <div style={[textStyles.base, {display: 'flex'}]}>{Number(face.gender.score).toFixed(2)}</div>
                                                    </div>

                                                    <div style={resultStyle, {display: 'flex', alignItems: 'center', marginBottom: '14px'}}>
                                                        <div style={[textStyles.base, textStyles.dark, {display: 'flex', marginRight: 'auto'}]}>
                                                            {face.age.min == null || face.age.max == null ?
                                                                <b>age {face.age.min || face.age.max}</b> :
                                                                <b>age {face.age.min} - {face.age.max}</b>
                                                            }
                                                        </div>
                                                        <div style={[progressWrapSmall, progressSmall, {display: 'flex', marginRight: '10px'}]}>
                                                            <div style={[progressBarSmall, progressSmall, {width: ~~(face.age.score * 100) + '%', background: color2}]}></div>
                                                        </div>
                                                        <div style={[textStyles.base, {display: 'flex'}]}>{Number(face.age.score).toFixed(2)}</div>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>:
                                null
                            }

                            {this.state.food && this.state.food.length > 0?
                                <div>
                                    <div style={[classSection, this.state.faces && this.state.faces.length > 0 ? {null}:{borderTop: '0px solid #d3d3d3'}]}>Food</div>
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
                                    <div style={[classSection, this.state.food && this.state.food.length > 0 || this.state.faces && this.state.faces.length > 0 ? {null}:{borderTop: '0px solid #d3d3d3'}]}>General</div>
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
                    }
                </div>

                <div style={bar}>
                    <ul style={{display: 'flex', justifyContent: 'center', alignSelf: 'center', padding: '0', margin: '0', paddingTop: '2px'}}>
                        {
                            this.state.images.map((url, i) => {
                                return (
                                    <li style={{listStyle: 'none'}}>
                                        <div key={i} id={i} style={[
                                            image,
                                            {backgroundImage: 'url(' + url + ')'},
                                            this.state.activeImage == i ? imageActive : null
                                        ]} onClick={this.chooseImage}>

                                        </div>
                                    </li>
                                )
                            })
                        }
                        <li style={dropButton}>
                            <Dropzone
                                style={{height: '80px', padding: '0px 32px', display: 'flex'}}
                                preventDropOnDocument={true}
                                accept={'image/jpeg, image/png, .jpg, .jpeg, .png'}
                                maxSize={2 * 1024 * 1024}
                                onDrop={null}
                                multiple={false}
                                onMouseEnter={this.isHover}
                                onMouseLeave={this.notHover}>
                                <div style={{alignSelf: 'center'}}>
                                    <div style={{color: Styles.colorTextLight, font: Styles.fontBold, marginBottom: '7px', textAlign: 'center'}}>
                                        {Strings.drag_image}
                                    </div>
                                    <div style={{color: Styles.colorTextLight, font: Styles.fontDefault, textAlign: 'center', marginBottom: '3px'}}>
                                        {Strings.or} <span style={[droplink, {color: Styles.colorPrimary}]}>{Strings.choose_image}</span>
                                    </div>
                                </div>
                            </Dropzone>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}
