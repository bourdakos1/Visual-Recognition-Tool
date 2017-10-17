import React from 'react'
import { Route, Switch } from 'react-router-dom'

import './styles/Tooling.css'
import TitleBar from 'components/TitleBar'
import ClassifierListContainer from 'containers/ClassifierListContainer'

const CreateClassifier = () => <div>Create Classifier</div>

const UpdateClassifier = () => <div>Update Classifier</div>

const Tooling = () => {
  var key = localStorage.getItem('api_key')
  return (
    <div>
      <TitleBar apiKey={key}>Visual Recognition Tool</TitleBar>
      <main className="Tooling-wrapper">
        <Switch>
          <Route exact path="/" component={ClassifierListContainer} />
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
