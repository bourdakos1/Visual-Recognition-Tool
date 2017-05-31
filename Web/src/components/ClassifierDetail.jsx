import React from 'react'
import request from 'superagent'
import Radium from 'radium'
import { Tooltip } from 'reactstrap'

import Styles from './Styles'
import i18next from 'i18next'
import ResultList from './ResultList'
import DropButton from './DropButton'
import Card from './Card'
import DropDown from './DropDown'

@Radium
export default class ClassifierDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tooltipOpen: false
        }
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

        if (confirm(i18next.t('delete') + ' ' + this.props.name + '?') == true) {
            var req = request.del('/api/classifiers/' + this.props.classifierID)
            var self = this

            req.query({username: localStorage.getItem('username')})
            req.query({password: localStorage.getItem('password')})
            req.query({lang: i18next.languages[0]})

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
        return i18next.t('classifier_general')
      } else if (this.props.name == 'food') {
        return i18next.t('classifier_food')
      } else {
        return this.props.name
      }
    }

    getStatus = () => {
      if ( this.props.status == 'ready') {
        return i18next.t('status_ready')
      } else if (this.props.status == 'training') {
        return i18next.t('status_training')
      } else if (this.props.status == 'retraining') {
        return i18next.t('status_retraining')
      } else {
        return i18next.t('status_failed')
      }
    }

    onDrop = (files, rejects, onFinished, onProgress) => {
        var self = this
        var req

        self.setState({ error: null }, self.stateChanged)

        if (files == null || files.length <= 0) {
            if (rejects != null && rejects[0].size > 2 * 1024 * 1024
                && (rejects[0].type == 'image/jpeg'
                || rejects[0].type == 'image/png')) {
                self.setState({ error: i18next.t('mb2_error') }, self.stateChanged)
                return
            }
            self.setState({ error: i18next.t('invalid_image_error') }, self.stateChanged)
            return
        }

        if (this.props.classifierID == null && this.props.name == i18next.t('classifier_face')) {
            req = request.post('/api/faces')
        } else {
            req = request.post('/api/classify')
            req.query({classifier_ids: [this.props.classifierID || this.props.name.toLowerCase()]})
            req.query({threshold: 0.0})
        }

        if (files[0]) {
            req.attach('file', files[0])
        }

        req.query({username: localStorage.getItem('username')})
        req.query({password: localStorage.getItem('password')})

        req.query({lang: i18next.languages[0]})

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
            var results
            if (res.body != null && res.body.images != null) {
                if (res.body.images[0].classifiers != null) {
                    var classifier = res.body.images[0].classifiers.filter((classifier) => {
                        return classifier.classifier_id == self.props.classifierID || classifier.classifier_id == self.props.name.toLowerCase()
                    })

                    results = classifier[0].classes
                    results.sort(function(a, b) {
                        return b.score - a.score
                    })
                } else if (res.body.images[0].faces != null && res.body.images[0].faces.length > 0) {
                    results = res.body.images[0].faces
                } else if (res.body.images[0].faces != null) {
                    self.setState({ error: i18next.t('faces_error') }, self.stateChanged)
                } else if (res.body.images[0].error != null) {
                    console.error(res.body.images[0].error.description)
                    if (res.body.images[0].error.description == 'Image size limit exceeded (2935034 bytes > 2097152 bytes [2 MiB]).') {
                        self.setState({ error: i18next.t('mb2_error') }, self.stateChanged)
                    } else {
                        self.setState({ error: res.body.images[0].error.description }, self.stateChanged)
                    }
                }
            } else if (res.body.code == 'LIMIT_FILE_SIZE') {
                self.setState({ error: i18next.t('mb2_error') }, self.stateChanged)
            } else if (res.body.error != null) {
                var error = res.body.error
                self.setState({ error: error }, self.stateChanged)
            } else {
                var error = i18next.t('unknown_error')
                self.setState({ error: error }, self.stateChanged)
            }
            self.setState({ file: files[0], results: results, link: null }, self.stateChanged)
            onFinished()
        })
    }

    onLink = (link, onFinished, onProgress) => {
        var self = this
        var req

        self.setState({ error: null }, self.stateChanged)

        if (this.props.classifierID == null && this.props.name == i18next.t('classifier_face')) {
            req = request.get('/api/faces')
        } else {
            req = request.get('/api/classify')
            req.query({classifier_ids: [this.props.classifierID || this.props.name.toLowerCase()]})
            req.query({threshold: 0.0})
        }

        req.query({url: link})

        req.query({username: localStorage.getItem('username')})
        req.query({password: localStorage.getItem('password')})

        req.query({lang: i18next.languages[0]})

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
                        self.setState({ error: i18next.t('faces_error') }, self.stateChanged)
                    } else if (res.body.images[0].error != null) {
                        console.error(res.body.images[0].error.description)
                        if (res.body.images[0].error.description == 'Image size limit exceeded (2935034 bytes > 2097152 bytes [2 MiB]).') {
                            self.setState({ error: i18next.t('mb2_error') }, self.stateChanged)
                        } else {
                            self.setState({ error: res.body.images[0].error.description }, self.stateChanged)
                        }
                    }
                } else if (res.body.code == 'LIMIT_FILE_SIZE') {
                    self.setState({ error: i18next.t('mb2_error') }, self.stateChanged)
                } else if (res.body.error != null) {
                    var error = res.body.error
                    self.setState({ error: error }, self.stateChanged)
                } else {
                    var error = i18next.t('unknown_error')
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
            whiteSpace:'nowrap',
            overflow:'hidden',
            textOverflow:'ellipsis',
            color: '#F44336',
            font: Styles.fontDefault,
        }

        var color
        if (this.props.status == 'ready') {
            color = '#64dd17'
        } else if (this.props.status == 'training' || this.props.status == 'retraining'){
            color = '#ffab00'
        } else {
            color = '#F44336'
        }

        return(
            <Card style={{maxWidth:'30rem'}}>
                {this.props.classifierID ?
                    <DropDown className='dropdown--classifier-detail' delete={this.deleteClassifier} classifierID={this.props.classifierID}/>:
                    null
                }

                <div style={titleStyle}>{this.getName()}</div>
                <div style={textStyle}>{this.props.classifierID}</div>
                <div style={textStyle}><div style={[status, {background: color}]}/>{this.getStatus()}</div>

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
                        maxSize={10 * 1024 * 1024}
                        upload={true}
                        onLink={this.onLink}
                        onDrop={this.onDrop}
                        text={i18next.t('drag_image')}
                        subtext={i18next.t('choose_image')} />
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
                        text={i18next.t('drag_image')}
                        subtext={i18next.t('choose_image')}
                        disabled={true}/>
                }
                {this.state.results ?
                    <ResultList
                        id={this.props.classifierID || this.props.name}
                        clearClassifier={this.clearClassifier}
                        file={this.state.file}
                        link={this.state.link}
                        results={this.state.results}/> :
                        null
                }
            </Card>
        )
    }
}
