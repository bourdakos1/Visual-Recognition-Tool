import React from 'react'
import request from 'superagent'
import nocache from 'superagent-no-cache'
import Radium from 'radium'
import StackGrid from 'react-stack-grid'
import { Link } from 'react-router-dom'

import ClassifierDetail from './ClassifierDetail'
import Button from './Button'
import Strings from './Strings'

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

        window.bluemixAnalytics.trackEvent('Read Object',{
            productTitle: 'Visual Recognition Tooling',
            category: 'Testing (Visual Recognition Tooling)',
            object: classifier_id,
            objectType: 'Classifier'
        });

        req.use(nocache)

        req.query({ api_key: localStorage.getItem('api_key') })

        req.end((err, res) => {
            if (res.body == null) {
                alert(Strings.generic_error)
            } else if (res.body.error != null) {
                alert(res.body.error)
            } else {
                if (res.body.status == Strings.status_ready) {
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
        console.log(localStorage.getItem('api_key'))

        var req = request.get('/api/classifiers')

        window.bluemixAnalytics.trackEvent('Read Object',{
            productTitle: 'Visual Recognition Tooling',
            category: 'Testing (Visual Recognition Tooling)',
            object: 'List',
            objectType: 'Classifier List'
        });

        req.use(nocache)

        req.query({ api_key: localStorage.getItem('api_key') })
        req.query({ verbose: true })

        req.end((err, res) => {
            console.log('loaded')
            var training = []
            var classifiers = []

            if (res.body == null) {
                if (res.text != null) {
                    // Fix invalid json with double commas
                    try {
                        classifiers = JSON.parse(res.text.replace(/(,)([ ,\n]*)(,)/g, ',')).classifiers

                        classifiers.sort((a, b) => {
                            return new Date(b.created) - new Date(a.created)
                        })

                        classifiers.push(
                            {name: Strings.classifier_general, status: Strings.status_ready},
                            {name: Strings.classifier_food, status: Strings.status_ready},
                            {name: Strings.classifier_face, status: Strings.status_ready}
                        )
                    } catch(err) {
                        alert(err)
                    }
                } else {
                    alert(Strings.generic_error)
                }
            } else if (res.body.error != null) {
                alert(res.body.error)
            } else {
                classifiers = res.body.classifiers
                classifiers.sort((a, b) => {
                    return new Date(b.created) - new Date(a.created)
                })

                classifiers.push(
                    {name: Strings.classifier_general, status: Strings.status_ready},
                    {name: Strings.classifier_food, status: Strings.status_ready},
                    {name: Strings.classifier_face, status: Strings.status_ready}
                )
            }

            for (var i in classifiers) {
                if (classifiers[i].status == Strings.status_training) {
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
            tmpKey: localStorage.getItem('api_key')
        }, this.loadClassifiers())
    }

    componentWillReceiveProps(newProps) {
        if (this.state.tmpKey != localStorage.getItem('api_key')) {
            this.setState({
                tmpKey: localStorage.getItem('api_key')
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
                        text={Strings.create_classifier}
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
