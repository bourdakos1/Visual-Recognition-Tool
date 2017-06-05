import React from 'react'
import Dropzone from 'react-dropzone'
import Radium, { StyleRoot } from 'radium'

import Styles from './Styles'
import i18next from 'i18next'

@Radium
export default class DropButton extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            files: [],
            value: '',
            progress: 0,
            opacity: 0,
            hover: false,
            clearHover: false
         }
    }

    static onDocumentDragOver = (e) => {
        // allow the entire document to be a drag target
        if (e.target.getAttribute('type') == 'text') {
            return
        }
        e.preventDefault()
    }

    componentDidMount() {
        document.addEventListener('dragover', DropButton.onDocumentDragOver, false)
        document.addEventListener('drop', this.onDocumentDrop, false)
    }

    componentWillUnmount() {
        document.removeEventListener('dragover', DropButton.onDocumentDragOver)
        document.removeEventListener('drop', this.onDocumentDrop)
    }

    onDocumentDrop = (e) => {
        if (this.node.contains(e.target)) {
            return
        }
        if (e.target.getAttribute('type') == 'text') {
            return
        }
        e.preventDefault()
    }

    onLinkTextChange = (e) => {
        var self = this
        var link = ''
        var link2 = ''
        if (e.dataTransfer) {
            link = e.dataTransfer.getData('text/uri-list')
            link2 = e.dataTransfer.getData('text/html')
            if (link2 != '') {
                var el = document.createElement('html')
                el.innerHTML = link2
                link2 = el.getElementsByTagName('img')[0].getAttribute('src')
            }
        } else {
            link = e.target.value
        }
        this.setState({
            showInput: false
        })

        //make sure we remove any nasty GET params
        var uri = link.split('?')[0]
        //split the uri into parts that had dots before them
        var parts = uri.split('.')
        //get the last part ( should be the extension )
        var extension = parts[parts.length-1]
        //define some image types to test against
        var imageTypes = ['jpg','jpeg','png']
        //check if the extension matches anything in the list.
        if(imageTypes.indexOf(extension) !== -1) {
            e.stopPropagation()
            e.preventDefault()
            // Fake load data
            self.setState({ progress: 50, opacity: 1 })
            this.props.onLink(uri, () => {
                setTimeout(() => {
                    self.setState({ opacity: 0 })
                    setTimeout(() => {
                        self.setState({ progress: 0 })
                    }, 500)
                }, 500)
            }, (p) => {
                self.setState({ progress: p, opacity: 1 })
            })
        } else {
            uri = link.split('?imgurl=')[1]
            if (uri != undefined) {
                uri = uri.split('&')[0]
                var parts = uri.split('.')
                var extension = parts[parts.length-1]
                var imageTypes = ['jpg','jpeg','png']
                uri = decodeURIComponent(uri)
                if(imageTypes.indexOf(extension) !== -1) {
                    e.stopPropagation()
                    e.preventDefault()
                    // Fake load data
                    self.setState({ progress: 50, opacity: 1 })
                    this.props.onLink(uri, () => {
                        setTimeout(() => {
                            self.setState({ opacity: 0 })
                            setTimeout(() => {
                                self.setState({ progress: 0 })
                            }, 500)
                        }, 500)
                    }, (p) => {
                        self.setState({ progress: p, opacity: 1 })
                    })
                }
            }
        }
        if (link2 != '') {
            uri = decodeURIComponent(link2)
            e.stopPropagation()
            e.preventDefault()
            // Fake load data
            self.setState({ progress: 50, opacity: 1 })
            this.props.onLink(uri, () => {
                setTimeout(() => {
                    self.setState({ opacity: 0 })
                    setTimeout(() => {
                        self.setState({ progress: 0 })
                    }, 500)
                }, 500)
            }, (p) => {
                self.setState({ progress: p, opacity: 1 })
            })
        }
        this.setState({
            value: ''
        })
    }

    onDrop = (files, rejects) => {
        var self = this
        this.setState({ files: files }, function() {
            this.props.onDrop(this.state.files, rejects, function() {
                self.setState({ files: [] })
                setTimeout(function() {
                    self.setState({ opacity: 0 })
                    setTimeout(function() {
                        self.setState({ progress: 0 })
                    }, 500);
                }, 500);
            }, function(p) {
                self.setState({ progress: p, opacity: 1 })
            })
        })
        this.setState({hover: true, clearHover: false})
    }

    onOpenClick = () => {
        this.refs.dropzone.open()
        this.setState({hover: true, clearHover: false})
    }

    isHover = () => {
        this.setState({hover: true})
    }

    notHover = () => {
        this.setState({hover: false, clearHover: false})
    }

    isClearHover = () => {
        this.setState({clearHover: true})
    }

    notClearHover = () => {
        this.setState({clearHover: false})
    }

    clear = (e) => {
        e.stopPropagation()
        this.props.onDrop(null)
        this.setState({
            files: [],
            progress: 0,
            opacity: 0,
            hover: false,
            clearHover: false
        })
    }

    render() {
        var bidi = this.context.bidi
    	var isRtl = bidi.guiDir === "rtl"
        var textStyles = {
            base: {
                color: Styles.colorTextLight,
                font: Styles.fontDefault,
            },
            link: {
                color: Styles.colorPrimary,
            },
            header: {
                font: Styles.fontBold,
                marginTop: '3px',
                marginBottom: '7px',
                textAlign: 'center',
            },
            subheader: {
                textAlign: 'center',
                marginBottom: '3px',
            },
            uploading: {
                font: Styles.fontBold,
                display: 'inline-flex',
                verticalAlign: 'middle',
            },
            ellipsis: {
                /* Required for text-overflow to do anything */
                maxWidth: '200px',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
            },
            clip: {
                /* Required for text-overflow to do anything */
                maxWidth: '200px',
                textOverflow: 'clip',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
            }
        }

        if (this.state.hover) {
            textStyles.link.textDecoration = 'underline'
        } else {
            textStyles.link.textDecoration = 'none'
        }

        const RGB=Styles.colorPrimary;
        const A='0.2';
        const RGBA='rgba('+parseInt(RGB.substring(1,3),16)+','+parseInt(RGB.substring(3,5),16)+','+parseInt(RGB.substring(5,7),16)+','+A+')';


        // Tempory fix of setting the maxHeight
        var dropzoneStyle = {
            position: 'relative',
            marginLeft: '-13px',
            marginRight: '-13px',
            marginBottom: '-13px',
            cursor: 'pointer',
            alignSelf: 'center',
            borderRadius: '0 0 5px 5px',
            borderColor: '#959595',
            borderWidth: 'thin',
            borderStyle: 'dashed',
            background:  '#fcfcfc',
            padding: '32px 0px',
            // maxHeight: '135px',
        }

        //////////////////////////////////////////
        // Polyfill
        //////////////////////////////////////////
        if (typeof Object.assign != 'function') {
            Object.assign = function(target) {
                'use strict';
                if (target == null) {
                    throw new TypeError('Cannot convert undefined or null to object');
                }

                target = Object(target);
                for (var index = 1; index < arguments.length; index++) {
                    var source = arguments[index];
                    if (source != null) {
                        for (var key in source) {
                            if (Object.prototype.hasOwnProperty.call(source, key)) {
                                target[key] = source[key];
                            }
                        }
                    }
                }
                return target;
            };
        }

        dropzoneStyle = Object.assign(dropzoneStyle, this.props.style)

        if (this.props.errors && this.state.files.length == 0) {
            dropzoneStyle = Object.assign(dropzoneStyle, {
                borderColor: '#F44336',
                background:  '#feeceb',
            })
        }

        var imgStyle = {
            display: 'inline-flex',
            margin: 'auto',
            maxHeight: '100%',
            maxWidth: '100%',
        }

        var containerStyles = {
            base: {
                width: '100%',
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
            },
            image: {
                width: '45px',
                height: '45px',
                border: '1px solid #dedede',
            }
        }
        
        if (isRtl)
        	containerStyles.image.marginLeft = '10px'
        else
        	containerStyles.image.marginRight = '10px'
        
        var cover = {
            position: 'absolute',
            top: '0',
            left: '0',
            width: `${this.state.progress}%`,
            height: '100%',
            backgroundColor: RGBA,
            transition: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
            borderRadius: '2px',
            opacity: this.state.opacity
        }

        var opacityKeyframes = Radium.keyframes({
            '0%': {opacity: '.2'},
            '20%': {opacity: '1'},
            '80%': {opacity: '1'},
            '100%': {opacity: '.2'},
        }, 'opacity');

        var dot = {
            animationName: opacityKeyframes,
            animationDuration: '1.4s',
            animationIterationCount: 'infinite',
            animationFillMode: 'both',
        }

        var two = {
            animationDelay: '.2s',
        }

        var three = {
            animationDelay: '.4s',
        }

        var deleteStyle = {
            position: 'absolute',
            top: '5px',
            right: '5px',
            backgroundColor: 'transparent',
            backgroundImage: `url(${'/btn_delete.png'})`,
            height: '25px',
            width: '25px',
            backgroundPosition: '0 0',
            backgroundSize: '75px 25px',
            backgroundRepeat: 'no-repeat',
            border: 'none',
            ':active': {
                backgroundPosition: '-50px 0',
            }
        }

        if (this.state.clearHover) {
            deleteStyle.backgroundPosition = '-25px 0'
        } else {
            deleteStyle.backgroundPosition = '0 0'
        }

        return (
            <div ref={(ref) => {this.node = ref}}>
                {this.props.disabled ?
                    <div id={this.props.id} style={[dropzoneStyle, {opacity: '0.4', cursor: 'default'}]}>
                        <div style={[textStyles.base, textStyles.header]}>
                            {this.props.text}
                        </div>
                        <div style={[textStyles.base, textStyles.subheader]}>
                            {i18next.t('or')} <span style={[textStyles.base, textStyles.link]}>{this.props.subtext}</span>
                        </div>
                    </div>
                    :
                    <Dropzone
                        preventDropOnDocument={false}
                        className={this.props.className}
                        id={this.props.id}
                        accept={this.props.accept}
                        maxSize={this.props.maxSize}
                        onDrop={this.onDrop}
                        multiple={false}
                        style={dropzoneStyle}
                        onMouseEnter={this.isHover}
                        onMouseLeave={this.notHover}>
                        <div
                            style={{backgroundColor: 'transparent', position: 'absolute', top: '0', left: '0', right: '0', bottom: '0'}}
                            onDragEnter={(e) => {
                                const dt = e.dataTransfer
                                if (dt.items) {
                                    this.setState({showInput: false})
                                    return
                                }
                                if (!(dt.types && (dt.types.indexOf ? dt.types.indexOf( "Files" ) !== -1 : dt.types.contains( "Files" )))) {
                                    this.setState({showInput: true})
                                } else {
                                    this.setState({showInput: false})
                                }
                            }}
                            onDrop={(e) => {
                                this.onLinkTextChange(e)
                            }}
                             />
                        {this.state.files.length > 0 ?
                            <div style={containerStyles.base}>
                                {this.state.hover && this.props.clear ?
                                    <button style={deleteStyle}
                                        onMouseEnter={this.isClearHover}
                                        onMouseLeave={this.notClearHover}
                                        onClick={this.clear}>
                                    </button> :
                                    null
                                }
                                {this.state.files.map((file) => <div key={file.name} style={[containerStyles.base, containerStyles.image]}><img style={imgStyle} src={file.preview}/></div> )}
                                {this.props.upload ?
                                    <div id="loading-ellipsis" style={[textStyles.base, textStyles.uploading]}>
                                        <div style={textStyles.clip}>{i18next.t('uploading') + bidi.convert(this.state.files[this.state.files.length - 1].name, {sttType: bidi.FILE_NAME, isolate: true})}</div>
                                        <StyleRoot>
                                            <span style={dot}>.</span>
                                            <span style={[dot, two]}>.</span>
                                            <span style={[dot, three]}>.</span>
                                        </StyleRoot>
                                    </div> :
                                    <div id="loading-ellipsis" style={[textStyles.base, textStyles.uploading]}>
                                        <div style={textStyles.ellipsis}>{bidi.convert(this.state.files[this.state.files.length - 1].name, {sttType: bidi.FILE_NAME})}</div>
                                    </div>
                                }
                            </div> :
                            <div>
                                <div style={[textStyles.base, textStyles.header]}>
                                    {this.props.text}
                                </div>
                                <div style={[textStyles.base, textStyles.subheader]}>
                                    {i18next.t('or')} <span style={[textStyles.base, textStyles.link]}>{this.props.subtext}</span>
                                </div>
                            </div>
                        }
                        <div style={cover}></div>
                    </Dropzone>
                }

                <input
                    ref={(ref) => {this.inputNode = ref}}
                    value={this.state.value}
                    onChange={this.onLinkTextChange}
                    onDragLeave={(e) => {
                        this.setState({
                            showInput: false
                        })
                    }}
                    type='text'
                    style={[{
                        opacity: '0',
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        right: '0',
                        bottom: '0',
                        width: '100%',
                        cursor: 'pointer',
                        alignSelf: 'center',
                        borderRadius: '5px',
                        borderColor: 'transparent',
                        borderWidth: 'none',
                        borderStyle: 'none',
                        background:  'transparent',
                        // background:  'rgba(255, 0, 0, 0.3)',
                        padding: '25px 0px',
                    }, this.state.showInput ?
                    {display: 'block'} :
                    {display: 'none'}]} />
            </div>
        )
    }
}

DropButton.contextTypes = {
  bidi: React.PropTypes.object
}
