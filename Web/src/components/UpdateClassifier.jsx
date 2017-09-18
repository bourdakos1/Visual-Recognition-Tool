import React from 'react'
import request from 'superagent'
import nocache from 'superagent-no-cache'
import Radium from 'radium'

import Styles from './Styles'
import Strings from './Strings'
import WorkSpace from './WorkSpace'

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
        amplitude.getInstance().logEvent('List-classifier')
        
        req.use(nocache)

        req.query({ api_key: localStorage.getItem('api_key') })

        req.end((err, res) => {
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
                progressModalText={Strings.updating_classifier}
                titleText={Strings.update_classifier}
                subTitleText={Strings.update_classifier_description}
                submitText={Strings.update}
                classesInfo={false}
                classifier={this.state.classifier}
                classes={this.state.classes} />
        )
    }
}
