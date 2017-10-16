import React from 'react'
import StackGrid from 'react-stack-grid'
import { Link } from 'react-router-dom'

import './Classifiers.css'
import createButton from './btn_create.png'
import api from './api'
import Button from './Button'

class Classifiers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      classifiers: [],
      training: []
    }
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
    return (
      <div>
        <Link to="/create_classifier">
          <Button className="Classifiers-button" icon={createButton} bold>
            Create classifier
          </Button>
        </Link>
        <StackGrid
          className="Classifier-grid"
          columnWidth={300}
          gutterWidth={50}
        >
          {this.state.classifiers.map(c => {
            return <div>{c.name}</div>
          })}
        </StackGrid>
      </div>
    )
  }
}

export default Classifiers
