import React from 'react'
import { Route, Switch } from 'react-router-dom'

import './styles/Tooling.css'
import TitleBar from 'components/TitleBar'
import Classifiers from 'containers/Classifiers'

function CreateClassifier() {
  return <div>Create Classifier</div>
}

function UpdateClassifier() {
  return <div>Update Classifier</div>
}

function Tooling() {
  var key = localStorage.getItem('api_key')
  return (
    <div>
      <TitleBar apiKey={key}>Visual Recognition Tool</TitleBar>
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
