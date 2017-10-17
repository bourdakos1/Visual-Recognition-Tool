import React, { Component } from 'react'

import api from 'api'
import './styles/ClassifierListContainer.css'
import ClassifierList from 'components/ClassifierList'

class ClassifierListContainer extends Component {
  state = {
    classifiers: [],
    training: []
  }

  componentDidMount() {
    this.loadClassifiers()
  }

  loadClassifiers = () => {
    api
      .listClassifiers(classifiers => {
        var training = []

        classifiers.forEach(c => {
          if (c.status === 'training') {
            training.push(c.classifier_id)
          }
        })

        this.setState({ classifiers: classifiers, training: training }, () => {
          if (this.state.training.length > 0) {
            this.reloadTraining(30)
          }
        })
      })
      .catch(reason => {
        alert(reason)
      })
  }

  loadClassifier = classifier_id => {
    api
      .getClassifier(classifier_id, classifier => {
        if (classifier.status === 'ready') {
          var oldClassifiers = [...this.state.classifiers]

          var newClassifiers = oldClassifiers.map(oldClassifier => {
            if (oldClassifier.classifier_id === classifier.classifier_id) {
              return classifier
            }
            return oldClassifier
          })

          this.setState({ classifiers: newClassifiers, training: [] })
        } else {
          this.reloadTraining(30)
        }
      })
      .catch(reason => {
        alert(reason)
      })
  }

  reloadTraining = timeout => {
    setTimeout(() => {
      if (this.state.training.length === 1) {
        this.loadClassifier(this.state.training[0])
      } else if (this.state.training.length > 0) {
        this.loadClassifiers()
      }
    }, timeout * 1000)
  }

  render() {
    return <ClassifierList classifiers={this.state.classifiers} />
  }
}

export default ClassifierListContainer
