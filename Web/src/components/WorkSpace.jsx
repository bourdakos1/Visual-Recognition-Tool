import React from 'react'
import Radium from 'radium'
import request from 'superagent'
import StackGrid from 'react-stack-grid'
import { Link, Redirect } from 'react-router-dom'

import Styles from './Styles'
import TitleCard from './TitleCard'
import Button from './Button'
import Class from './Class'
import ProgressModal from './ProgressModal'
import i18next from 'i18next'

@Radium
export default class WorkSpace extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            classifier: props.classifier,
            classes: props.classes,
            errors: false,
            upload: false,
            finished: false,
        }
        this.myNum = this.state.classes.length
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            classifier: newProps.classifier,
            classes: newProps.classes,
            finished: false
        })
        this.myNum = newProps.classes.length
    }

    onTextChange = (text) => {
        this.setState({
            classifier: {
                name: text.target.value
            }
        })
    }

    setClassFile = (file, key) => {
        var newClasses = $.extend([], this.state.classes)
        newClasses[key].file = file
        this.setState({ classes: newClasses })
    }

    setClassName = (text, key) => {
        var newClasses = $.extend([], this.state.classes)
        newClasses[key].name = text.target.value
        this.setState({ classes: newClasses })
    }

    deleteClass = (key) => {
        var newClasses = $.extend([], this.state.classes)
        newClasses.splice(key, 1)
        this.setState({classes: newClasses})
    }

    errorCheck = () => {
        var self = this
        self.setState({errors: false, error: null, titleError: null}, () => {
            // This should not throw any errors for update,
            // because it would have passed earlier on.
            var titleError = null
            var errors = this.state.errors
            if (this.state.classifier.name == null || this.state.classifier.name == '') {
                errors = true
                titleError = i18next.t('classifier_name_required_error')
                this.setState({errors: errors, titleError: titleError})
            } else if (/[*\\|{}$/'`"\-]/.test(this.state.classifier.name)) {
                errors = true
                var invalidChars = this.state.classifier.name.match(/[*\\|{}$/'`"\-]/g)
                titleError = i18next.t('invalid_chars_error') + invalidChars.join(' ')
                this.setState({errors: errors, titleError: titleError})
            }

            var validClasses = 0
            var hasNeg = false

            var totalbytes = 0

            // State takes time, so we can just take a tally here
            this.state.classes.map(function(c) {
                if (c.file != null) {
                    totalbytes += c.file[0].size
                }
                if (c.negative || c.defaultClass) {
                     if (c.file != null) {
                         validClasses++
                         hasNeg = true
                     }
                     return
                }
                if (c.name == null || c.name == '') {
                    errors = true
                    self.setState({errors: errors})
                    return
                }
                if (c.file == null) {
                    errors = true
                    self.setState({errors: errors})
                    return
                }
                validClasses++
            })

            var error = null

            var dupes = {}
            var classCount = 0
            this.state.classes.map(function(c) {
                if (c.name != null && c.name != '') {
                    dupes[c.name] = 1
                    classCount++
                    if (/[*\\|{}$/'`"\-]/.test(c.name)) {
                        errors = true
                        var invalidChars = c.name.match(/[*\\|{}$/'`"\-]/g)
                        error = i18next.t('invalid_chars_error') + invalidChars.join(' ')
                        self.setState({errors: errors, error: error})
                    }
                }
            })
            console.log(Object.keys(dupes).length + ' / ' + classCount)
            if (Object.keys(dupes).length < classCount) {
                errors = true
                error = i18next.t('conflicting_class_name_error')
                self.setState({errors: errors, error: error})
                return
            }

            console.log('total size: ' + totalbytes / (1000 * 1000) + 'MB')
            console.log('valid: ' + validClasses)

            if (totalbytes / (1000 * 1000) > 256) {
                errors = true
                error = i18next.t('mb250_error')
                self.setState({errors: errors, error: error})
                return
            }

            console.log(this.props.match)

            if (this.props.match) {
                // THIS IS FOR UPDATE
                if (validClasses < 1) {
                    errors = true
                    error = i18next.t('modify_class')
                    this.setState({errors: errors})
                    return
                }
            } else {
                // THIS IS FOR CREATE
                if (validClasses < 2) {
                    errors = true
                    if (hasNeg) {
                        error = i18next.t('add_class_error')
                    } else if (validClasses == 1) {
                        error = i18next.t('add_neg_or_class_error')
                    } else {
                        error = i18next.t('no_classes_error')
                    }
                    this.setState({errors: errors, error: error})
                    return
                }
            }

            if (!errors) {
                this.setState({upload: true})
            }
        })
    }

    // This is kind of messy but helps show progress faster
    create = (onProgress, onFinished) => {
        if (this.props.match) {
            var req = request.put('/api/classifiers/' + this.props.match.params.classifierID)
        } else {
            var req = request.post('/api/classifiers')
        }

        var self = this

        this.state.classes.map(function(c) {
            if (c.file != null) {
                name = c.name
                if (c.negative) {
                    name = 'NEGATIVE_EXAMPLES'
                }
                req.attach('files', c.file[0], name)
            }
        })

        req.query({ api_key: localStorage.getItem('api_key') })

        req.query({ name: this.state.classifier.name })

        req.on('progress', function(e) {
            if (e.direction == 'upload') {
                console.log(e.percent)
                onProgress(e.percent)
            }
        })

        req.then(function(res, err) {
            console.log(res)
            if (res.body == null) {
                alert(i18next.t('generic_error'))
            } else if (res.body.error != null) {
                alert(res.body.error)
            }
            onFinished()
            self.setState({upload: false, finished: true})
        })
    }

    addClass = (e) => {
      var newClasses = $.extend([], this.state.classes)
      newClasses.splice(newClasses.length - 1, 0, {
        name: "",
        file: null,
        id: this.myNum
      })
      this.myNum++
      this.setState({classes: newClasses})
    }

    reloadServerData = () => {
        this.forceUpdate()
    }

    render() {
        var textStyles = {
            base: {
                color: Styles.colorTextDark,
                font: Styles.fontDefault,
                maxWidth: '550px',
                letterSpacing: '.01rem',
                fontWeight: '400',
                fontStyle: 'normal',
                lineHeight: '1.58',
                letterSpacing: '-.003em',
            },
            header: {
                color: Styles.colorTextDark,
                font: Styles.fontHeader,
                letterSpacing: '-.02em',
                fontWeight: '700',
                fontStyle: 'normal',
                fontSize: '32px',
                marginLeft: '-2.5px',
                lineHeight: '1.04',
                letterSpacing: '-.028em',
            },
            header2: {
                color: Styles.colorTextDark,
                font: Styles.fontHeader,
                letterSpacing: '-.02em',
                fontWeight: '700',
                fontStyle: 'normal',
                fontSize: '24px',
                marginLeft: '-1.5px',
                lineHeight: '1.22',
                letterSpacing: '-.018em',
            },
            title: {
                color: Styles.colorTextDark,
                font: Styles.fontTitle,
                letterSpacing: '-.02em',
                fontWeight: '700',
                fontStyle: 'normal',
                fontSize: '24px',
                marginLeft: '-1.5px',
                lineHeight: '1.22',
                letterSpacing: '-.018em',
                padding: '12px',
                paddingLeft: '20px',
            }
        }

        var margin = {
            marginTop: '5px',
        }

        var titleError = {
            paddingBottom: '10px',
            textDecoration:'none',
            display:'block',
            whiteSpace:'nowrap',
            overflow:'hidden',
            textOverflow:'ellipsis',
            color: '#F44336',
            font: Styles.fontDefault,
        }

        var error = {
            paddingTop: '5px',
            paddingLeft: '10px',
            textDecoration:'none',
            display:'block',
            whiteSpace:'nowrap',
            overflow:'hidden',
            textOverflow:'ellipsis',
            color: '#F44336',
            font: Styles.fontDefault,
        }

        const RGB=Styles.colorPrimary
        const A='0.1'
        const RGBA='rgba('+parseInt(RGB.substring(1,3),16)+','+parseInt(RGB.substring(3,5),16)+','+parseInt(RGB.substring(5,7),16)+','+A+')'
        const A2='0.3'
        const RGBA2='rgba('+parseInt(RGB.substring(1,3),16)+','+parseInt(RGB.substring(3,5),16)+','+parseInt(RGB.substring(5,7),16)+','+A2+')'

        var self = this
        return (
            <div id='create-classifier'>
                <div style={[textStyles.header, {marginTop: '30px', marginBottom: '5px'}]}>
                    {this.props.titleText}
                </div>
                <div style={[textStyles.base, {marginTop: '5px', marginBottom: '36px'}]}>
                    {this.props.subTitleText}
                </div>

                {self.state.titleError ?
                    <div id='error--create-classifier--title' style={titleError}>
                        {self.state.titleError}
                    </div> :
                    null
                }

                <TitleCard
                    inputId='input--create-classifier--classifier-name'
                    maxlength='30'
                    errors={self.state.errors}
                    placeholder={i18next.t('classifier_name')}
                    title={self.state.classifier.name}
                    fixedTitle={self.state.classifier.fixed}
                    onChange={this.onTextChange}
                    inputStyle={textStyles.title}>

                    {this.props.classesInfo ?
                        <div
                            style={{
                                margin: '10px',
                                marginTop: '10px',
                                marginBottom: '30px',
                                border: 'none',
                            }}>
                            <div style={[textStyles.header2, {marginBottom: '5px'}]}>
                                {i18next.t('classes')}
                            </div>
                            <div style={[textStyles.base]}>
                                {i18next.t('classifier_requirements')}
                            </div>
                        </div> :
                        null
                    }

                    {self.state.error ?
                        <div id='error--create-classifier--class' style={error}>
                            {self.state.error}
                        </div> :
                        null
                    }

                    <StackGrid
                        className='gridz-are-real'
                        columnWidth={292}
                        gutterWidth={40}
                        style={{marginTop: '10px'}}>
                        {this.state.classes.map(function(c, i) {
                            return (
                                <Class
                                    inputClassName='input--create-classifier--class-name'
                                    dropzoneClassName='dropzone--create-classifier'
                                    errors={self.state.errors}
                                    fixedTitle={c.defaultClass}
                                    negative={c.negative}
                                    title={c.name}
                                    style={{maxWidth:'30rem'}}
                                    key={c.id}
                                    id={i}
                                    setClassFile={self.setClassFile}
                                    setClassName={self.setClassName}
                                    delete={self.deleteClass}/>
                            )
                        })}
                    </StackGrid>
                    <div style={{textAlign: 'right'}}>
                        <Button
                            id='button--create-classifier--add-class'
                            onClick={this.addClass}
                            text={i18next.t('add_class')}
                            style={{float: 'left'}}/>
                        <Link to='/'>
                            <Button
                                id='button--create-classifier--cancel'
                                text={i18next.t('cancel')}
                                style={{marginRight: '20px'}}/>
                        </Link>
                        <Button
                            id='button--create-classifier--create'
                            onClick={this.errorCheck}
                            text={i18next.t('create')}
                            kind='bold'/>
                    </div>
                </TitleCard>
                <ProgressModal
                    visible={this.state.upload}
                    title={this.props.progressModalText}
                    load={this.create}/>
                {this.state.finished ? <Redirect to='/'/> : null}
            </div>
        )
    }
}
