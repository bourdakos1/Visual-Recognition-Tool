import React from 'react'
import request from 'superagent'
import nocache from 'superagent-no-cache'
import Radium from 'radium'

import Styles from './Styles'
import WorkSpace from './WorkSpace'
import i18next from 'i18next'

var myNum = 0

@Radium
export default class UpdateClassifier extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            classifier: {
                name: '',
                fixed: true
            },
            classes: []
        }
    }

    loadClasses = () => {
        var self = this
        var classes = []

        var req = request.get('/api/classifiers/' + this.props.match.params.classifierID)
        req.use(nocache)

        req.query({username: localStorage.getItem('username')})
        req.query({password: localStorage.getItem('password')})
        req.query({lang: i18next.languages[0]})

        req.end(function(err, res) {
            if (err != null) {
                console.error('Server error')
            }
            if (res.body != null) {
                self.setState({
                    classifier: {
                        name: res.body.name,
                        fixed: true
                    }
                })
                res.body.classes.map(function(c) {
                    classes.push({
                        name: c.class,
                        file: null,
                        id: myNum++,
                        defaultClass: true,
                    })
                })
            }
            classes.push({negative: true, file: null, id: myNum++})
            self.setState({classes: classes})
        })
    }

    componentDidMount() {
        this.loadClasses()
        this.forceUpdate()
    }

    render() {
        return (
            <WorkSpace
                match = {this.props.match}
                progressModalText={i18next.t('updating_classifier')}
                titleText={i18next.t('update_classifier')}
                subTitleText={i18next.t('update_classifier_description')}
                classesInfo={false}
                classifier={this.state.classifier}
                classes={this.state.classes} />
        )
    }
}
