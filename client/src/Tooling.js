import React from 'react'
import { Route, Switch } from 'react-router-dom'

import './Tooling.css'
import TitleBar from './TitleBar'
import Classifiers from './Classifiers'

function CreateClassifier() {
  return <div>Create Classifier</div>
}

function UpdateClassifier() {
  return <div>Update Classifier</div>
}

function Tooling() {
  return (
    <div>
      <TitleBar />
      <main className="Tooling-wrapper">
        <Switch>
          <Route exact path="/" component={Classifiers} />
          <Route exact path="/create_classifier" component={CreateClassifier} />
          <Route
            exact
            path="/update_classifier/:classifierID"
            component={UpdateClassifier}
          />
        </Switch>
      </main>
    </div>
  )
}

export default Tooling
