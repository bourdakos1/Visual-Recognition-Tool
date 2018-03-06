import React from 'react'
import request from 'superagent'
import Radium from 'radium'
import { Tooltip } from 'reactstrap'

import Styles from './Styles'
import Strings from './Strings'
import ResultList from './ResultList'
import DropButton from './DropButton'
import Card from './Card'
import DropDown from './DropDown'

@Radium
export default class ClassifierDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tooltipOpen: false,
            error: this.props.failError
        }
    }

    classify = (req, uploadedImage, onProgress, onFinished) => {
        var self = this
        if (uploadedImage) {
            req.attach('file', uploadedImage)
        }

        req.query({api_key: localStorage.getItem('api_key')})

        req.on('progress', function(e) {
            if (e.direction == 'upload') {
                onProgress(e.percent / 2)
            } else if (e.direction == 'download') {
                if (e.percent < 100) {
                    onProgress(50 + e.percent / 2)
                }
            }
        })

        req.end(function(err, res) {
            onProgress(100)
            console.log(res)
            var results
            if (res.body != null && res.body.images != null) {
                if (res.body.images[0].classifiers != null && res.body.images[0].classifiers.length > 0 ) {
                    results = res.body.images[0].classifiers[0].classes
                    results.sort(function(a, b) {
                        return b.score - a.score
                    })
                } else if (res.body.images[0].faces != null && res.body.images[0].faces.length > 0) {
                    results = res.body.images[0].faces
                } else if (res.body.images[0].faces != null) {
                    self.setState({ error: Strings.faces_error }, self.stateChanged)
                } else if (res.body.images[0].error != null) {
                    console.error(res.body.images[0].error.description)
                    if (res.body.images[0].error.description == 'Image size limit exceeded (2935034 bytes > 2097152 bytes [2 MiB]).') {
                        self.setState({ error: Strings.mb2_error }, self.stateChanged)
                    } else {
                        self.setState({ error: res.body.images[0].error.description }, self.stateChanged)
                    }
                }
            } else if (res.body.error != null) {
                var error = res.body.error
                self.setState({ error: error }, self.stateChanged)
            } else {
                var error = Strings.unknown_error
                self.setState({ error: error }, self.stateChanged)
            }
            self.setState({ file: uploadedImage, results: results, link: null }, self.stateChanged)
            onFinished()
        })
    }

    toggle = () => {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        })
    }

    stateChanged = () => {
        this.setState({
            tooltipOpen: false
        })
        this.props.reDraw()
    }

    deleteClassifier = (e) => {
        e.preventDefault()
        if (confirm('Delete ' + this.props.name + '?') == true) {
            var req = request.del('/api/classifiers/' + this.props.classifierID)
            amplitude.getInstance().logEvent('Delete-classifier')
            var self = this
            req.query({api_key: localStorage.getItem('api_key')})
            req.end(function(err, res) {
                console.log('deleted')
                if (res.body.error != null) {
                    alert(res.body.error)
                }
                self.props.reData()
            })
        }
    }

    getName = () => {
      if (this.props.name == 'default') {
        return Strings.classifier_general
      } else if (this.props.name == 'food') {
        return Strings.classifier_food
      } else {
        return this.props.name
      }
    }

    resizeImage = (image, uploadedImage) => {
        var c = window.document.createElement('canvas')
        var ctx = c.getContext('2d')
        var ratio = image.width / image.height
        var maxSize = 1000

        if (image.width < maxSize && image.height < maxSize) {
           c.width = image.width
           c.height = image.height
        } else {
           c.width = (ratio > 1 ? maxSize : maxSize * ratio)
           c.height = (ratio > 1 ? maxSize / ratio : maxSize)
        }

        ctx.drawImage(image, 0, 0, c.width, c.height)
        return c.toDataURL('image/jpeg')
    }

<<<<<<< Updated upstream
    convertDataURLtoFile = (imageDataURL, fileName, preview) => {
=======
    convertDataURLtoFile = (imageDataURL, fileName) => {
>>>>>>> Stashed changes
        var imageType = imageDataURL.substring(imageDataURL.indexOf(':') + 1, imageDataURL.indexOf(';'))
        var imageDataBase64 = imageDataURL.substring(imageDataURL.indexOf(',') + 1, imageDataURL.length)
        var byteCharacters = atob(imageDataBase64)
        var byteNumbers = new Array(byteCharacters.length)
        for (var i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        var byteArray = new Uint8Array(byteNumbers)
        var blob = new Blob([byteArray], {type: imageType})

<<<<<<< Updated upstream
        blob.preview = preview

        return blob
=======
        return new File([blob], fileName, {type: imageType, lastModified: Date.now()})
>>>>>>> Stashed changes
    }

    onDrop = (files, rejects, onFinished, onProgress) => {
        var self = this
        var req

        self.clearClassifier()
        self.setState({ error: null }, self.stateChanged)

        if (files == null || files.length <= 0) {
            self.setState({ error: Strings.invalid_image_error }, self.stateChanged)
            return
        }

        if (this.props.classifierID == null && this.props.name == Strings.classifier_face) {
            req = request.post('/api/faces')
        } else {
            req = request.post('/api/classify')
            req.query({classifier_ids: [this.props.classifierID || this.props.name.toLowerCase()]})
            req.query({threshold: 0.0})
        }

        if (this.props.classifierID == null) {
            amplitude.getInstance().logEvent('Classify-' + this.props.name.toLowerCase())
        } else {
            amplitude.getInstance().logEvent('Classify-custom')
        }

        var uploadedImage = files[0]
<<<<<<< Updated upstream
=======
        this.setState({filePreview: files[0].preview})
>>>>>>> Stashed changes

        // resize uploaded image if greater than 2MB
        if (files[0].size > 2000000) {
            var name = files[0].name
<<<<<<< Updated upstream
            var preview = files[0].preview
=======
>>>>>>> Stashed changes
            var reader = new FileReader()
            reader.onload = () => {
                var image = new Image()
                image.src = reader.result
                image.onload = () => {
<<<<<<< Updated upstream
                    uploadedImage = this.convertDataURLtoFile(this.resizeImage(image), name, preview)
=======
                    uploadedImage = this.convertDataURLtoFile(this.resizeImage(image), name)
>>>>>>> Stashed changes
                    this.classify(req, uploadedImage, onProgress, onFinished)
                }
            }
            reader.readAsDataURL(files[0])

        } else {
            this.classify(req, uploadedImage, onProgress, onFinished)
        }
    }

    onLink = (link, onFinished, onProgress) => {
        var self = this
        var req

        self.setState({ error: null }, self.stateChanged)

        if (this.props.classifierID == null && this.props.name == Strings.classifier_face) {
            req = request.get('/api/faces')
        } else {
            req = request.get('/api/classify')
            req.query({classifier_ids: [this.props.classifierID]})
            req.query({threshold: 0.0})
        }

<<<<<<< Updated upstream
        if (this.props.name == Strings.classifier_general || this.props.name == Strings.classifier_food || this.props.name == Strings.classifier_face) {
=======
        if (this.props.classifierID == null) {
>>>>>>> Stashed changes
            amplitude.getInstance().logEvent('Classify-' + this.props.name.toLowerCase())
        } else {
            amplitude.getInstance().logEvent('Classify-custom')
        }

        req.query({url: link})

        req.query({api_key: localStorage.getItem('api_key')})

        req.on('progress', function(e) {
            if (e.direction == 'upload') {
                onProgress(e.percent / 2)
            } else if (e.direction == 'download') {
                if (e.percent < 100) {
                    onProgress(50 + e.percent / 2)
                }
            }
        })

        var img = new Image()
        img.onload = () => {
            var width = img.width
            var height = img.height
            req.end(function(err, res) {
                onProgress(100)
                var results
                if (res.body != null && res.body.images != null) {
                    if (res.body.images[0].classifiers != null && res.body.images[0].classifiers.length > 0 ) {
                        results = res.body.images[0].classifiers[0].classes
                        results.sort(function(a, b) {
                            return b.score - a.score
                        })
                    } else if (res.body.images[0].faces != null && res.body.images[0].faces.length > 0) {
                        results = res.body.images[0].faces
                    } else if (res.body.images[0].faces != null) {
                        self.setState({ error: Strings.faces_error }, self.stateChanged)
                    } else if (res.body.images[0].error != null) {
                        console.error(res.body.images[0].error.description)
                        if (res.body.images[0].error.description == 'Image size limit exceeded (2935034 bytes > 2097152 bytes [2 MiB]).') {
                            self.setState({ error: Strings.mb2_error }, self.stateChanged)
                        } else {
                            self.setState({ error: res.body.images[0].error.description }, self.stateChanged)
                        }
                    }
                } else if (res.body.code == 'LIMIT_FILE_SIZE') {
                    self.setState({ error: Strings.mb2_error }, self.stateChanged)
                } else if (res.body.error != null) {
                    var error = res.body.error
                    self.setState({ error: error }, self.stateChanged)
                } else {
                    var error = Strings.unknown_error
                    self.setState({ error: error }, self.stateChanged)
                }
                console.log(width + ', ' + height)
                self.setState({ file: null, results: results, link: {url: link, width: width, height: height} }, self.stateChanged)
                onFinished()
            })
        }
        img.src = link
    }

    clearClassifier = () => {
        this.setState({ file: null, results: null, link: null }, this.stateChanged)
    }

    render() {
        var textStyle = {
            paddingTop: '5px',
            textDecoration:'none',
            display:'block',
            whiteSpace:'nowrap',
            overflow:'hidden',
            textOverflow:'ellipsis',
            color: Styles.colorTextLight,
            font: Styles.fontDefault,
        }

        var titleStyle = {
            textDecoration:'none',
            display:'block',
            whiteSpace:'nowrap',
            overflow:'hidden',
            textOverflow:'ellipsis',
            color: Styles.colorTextDark,
            font: Styles.fontHeader,
        }

        var status = {
            marginBottom: '-1px',
            marginRight: '5px',
            display: 'inline-block',
            width: '10px',
            height: '10px',
            borderRadius: '5px',
        }

        var error = {
            paddingBottom: '10px',
            textDecoration:'none',
            display:'block',
            overflow:'wrap',
            color: '#F44336',
            font: Styles.fontDefault,
        }

        var color
        if (this.props.status == 'ready') {
            color = '#64dd17'
        } else if (this.props.status == 'training'  || this.props.status == 'retraining'){
            color = '#ffab00'
        } else {
            color = '#F44336'
        }

        return(
            <Card style={{maxWidth:'30rem'}}>
                {this.props.classifierID !== 'default' && this.props.classifierID !== 'food' && this.props.classifierID !== null && this.props.classifierID !== undefined ?
                    <DropDown className='dropdown--classifier-detail' delete={this.deleteClassifier} classifierID={this.props.classifierID}/>:
                    null
                }

                <div style={titleStyle}>{this.getName()}</div>
                <div style={textStyle}>{this.props.classifierID}</div>
                <div style={textStyle}><div style={[status, {background: color}]}/>{this.props.status}</div>

                {/*To soothe my pain*/}
                {this.props.classifierID ? null : <div style={{height: '1em', marginTop: '2px'}}></div>}

                <div style={{width: '100%', height:'20px'}}></div>
                {this.state.error ? <div id='error--classifier-detail' style={error}>{this.state.error}</div> : null}
                {this.props.status == 'ready' ?
                    <DropButton
                        style={this.state.results ?
                            {
                                borderRadius: '0px',
                                borderTopColor: '#dedede',
                                borderBottomColor: '#dedede',
                                borderLeftColor: '#c2c2c2',
                                borderRightColor: '#c2c2c2',
                            } :
                                {
                                    borderTopColor: '#dedede',
                                    borderBottomColor: '#c2c2c2',
                                    borderLeftColor: '#c2c2c2',
                                    borderRightColor: '#c2c2c2',
                                }
                            }
                        id={this.props.classifierID || this.props.name}
                        className='dropzone--classifier-detail'
                        accept={'image/jpeg, image/png, .jpg, .jpeg, .png'}
                        upload={true}
                        onLink={this.onLink}
                        onDrop={this.onDrop}
                        text={Strings.drag_image}
                        subtext={Strings.choose_image} />
                    :
                    <DropButton
                        style={{
                            border: 'solid thin',
                            borderTopColor: '#dedede',
                            borderBottomColor: 'transparent',
                            borderLeftColor: 'transparent',
                            borderRightColor: 'transparent',
                        }}
                        id={this.props.classifierID || this.props.name}
                        text={Strings.drag_image}
                        subtext={Strings.choose_image}
                        disabled={true}/>
                }
                {this.state.results ?
                    <ResultList
                        id={this.props.classifierID || this.props.name}
                        clearClassifier={this.clearClassifier}
                        file={this.state.file}
                        filePreview={this.state.filePreview}
                        link={this.state.link}
                        results={this.state.results}/> :
                        null
                }
            </Card>
        )
    }
}
