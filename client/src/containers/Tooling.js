import React from 'react'
import { Route, Switch } from 'react-router-dom'

import 'containers/Tooling.css'
import TitleBar from 'components/TitleBar'
import Classifiers from 'containers/Classifiers'

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
