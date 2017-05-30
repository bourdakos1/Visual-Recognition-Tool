import React from 'react'
import request from 'superagent'
import nocache from 'superagent-no-cache'
import Radium from 'radium'
import StackGrid from 'react-stack-grid'
import { Link } from 'react-router-dom'

import ClassifierDetail from './ClassifierDetail'
import Button from './Button'
import i18next from 'i18next'

@Radium
export default class Classifiers extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            classifiers: []
        }
    }

    reloadTraining = (timeout) => {
        var self = this
        if (this.state.training != null && this.state.training.length == 1) {
            console.log('reload training data in ' + timeout + ' seconds')
            setTimeout(() => {
                self.loadClassifier(self.state.training[0])
            }, timeout * 1000)
        } else if (this.state.training != null && this.state.training.length > 0) {
            setTimeout(() => {
                self.loadClassifiers()
            }, timeout * 1000)
        }
    }

    loadClassifier = (classifier_id) => {
        var self = this

        var req = request.get('/api/classifiers/' + classifier_id)
        req.use(nocache)

        //req.query({ api_key: localStorage.getItem('api_key') })

        req.query({username: localStorage.getItem('username')})
        req.query({password: localStorage.getItem('password')})

        req.end(function(err, res) {
            if (res.body == null) {
                alert(i18next.t('generic_error'))
            } else if (res.body.error != null) {
                alert(res.body.error)
            } else {
                if (res.body.status == 'ready') {
                    var newClassifiers = $.extend([], self.state.classifiers)
                    for (var i in newClassifiers) {
                        if (newClassifiers[i].classifier_id == classifier_id) {
                            newClassifiers[i].status = res.body.status
                        }
                    }
                    self.setState({ classifiers: newClassifiers, training: null })
                } else {
                    self.reloadTraining(30)
                }
            }
        })
    }

    loadClassifiers = () => {
        var self = this
        var req = request.get('/api/classifiers')
        req.use(nocache)

        req.query({username: localStorage.getItem('username')})
        req.query({password: localStorage.getItem('password')})
        req.query({ verbose: true })

        req.end((err, res) => {
            console.log(res)
            var training = []
            var classifiers = []

            if (res.body == null) {
                alert(i18next.t('generic_error'))
            } else if (res.body.error != null) {
                alert(res.body.error)
            } else {
                classifiers = res.body.classifiers
                if (classifiers != null) {
                    classifiers.sort((a, b) => {
                        return new Date(b.created) - new Date(a.created)
                    })
                }

                classifiers.push(
                    {name: Strings.classifier_general, status: Strings.status_ready}
                )
            }

            for (var i in classifiers) {
                if (classifiers[i].status == 'training') {
                    training.push(classifiers[i].classifier_id)
                }
            }

            self.setState({ classifiers: classifiers, training: training }, () => {
                if (this.state.training != null) {
                    self.reloadTraining(30)
                }
            })
        })
    }

    componentDidMount() {
        this.setState({
            tmpUsr: localStorage.getItem('username'),
            tmpPswrd: localStorage.getItem('password')
        }, this.loadClassifiers())
    }

    componentWillReceiveProps(newProps) {
        if ((this.state.tmpUsr != localStorage.getItem('username')) &&
            (this.state.tmpPswrd != localStorage.getItem('password'))) {
            this.setState({
                tmpUsr: localStorage.getItem('username'),
                tmpPswrd: localStorage.getItem('password')
            }, this.loadClassifiers())
        }
    }

    reDraw = () => {
        this.forceUpdate()
    }

    reData = () => {
        this.loadClassifiers()
    }

    render() {
        var self = this
        return (
            <div>
                <Link to='/create_classifier'>
                    <Button
                        style={{margin: '21px 0px'}}
                        id="button--classifiers--create"
                        text={i18next.t('create_classifier')}
                        kind={"bold"}
                        icon={"/btn_create.png"}/>
                </Link>
                <StackGrid
                    style={{marginLeft: '-10px', marginRight: '-10px'}}
                    columnWidth={300}
                    gutterWidth={50}>
                    {this.state.classifiers.map((c) => {
                        return (
                            <ClassifierDetail
                                classifierID={c.classifier_id}
                                name={c.name}
                                status={c.status}
                                reDraw={self.reDraw}
                                reData={self.reData}
                                key={c.classifier_id || c.name}/>
                        )
                    })}
                </StackGrid>
            </div>
        )
    }
}
