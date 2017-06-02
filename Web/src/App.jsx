import React from 'react'
import ReactDOM from 'react-dom'
import { Route, BrowserRouter, IndexRoute } from 'react-router-dom'

import Base from './components/Base'
import Classifiers from './components/Classifiers'
import CreateClassifier from './components/CreateClassifier'
import UpdateClassifier from './components/UpdateClassifier'
import CredentialsModal from './components/CredentialsModal'
import LandingPage from './components/LandingPage'
import TestPage from './components/TestPage'
import Demo from './components/Demo'


// This is the base of the App
// It holds our "Base" component which is just a TitleBar and content
// Depending on the path; the "Models", "CreateModel" or "UpdateModel" component
// are shown.
class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showModal: false
        }
    }

    // Our two points of entry (CredentialsModal/LandingPage) should give us
    // valid credentials or null.
    setCredentials = (apiKey) => {
        localStorage.setItem('api_key', apiKey)
        this.forceUpdate()
    }

    showModal = () => {
        this.setState({
            showModal: true
        })
    }

    hideModal = () => {
        this.setState({
            showModal: false
        })
    }

    render() {
        return (
            <BrowserRouter>
                <div>
                    <Route exact path='/' component={TestPage}/>
                    <Route exact path='/demo' component={Demo}/>

                    <Route exact path='/tool' render={(props) => (
                        <div>
                            {
                                localStorage.getItem('api_key') == 'undefined'
                                    || localStorage.getItem('api_key') == null
                                    || localStorage.getItem('api_key') == '' ?

                                <LandingPage setCredentials={this.setCredentials}/> :
                                <div>
                                    <Base showModal={this.showModal}>
                                        <Classifiers {...props}/>
                                    </Base>
                                    <CredentialsModal
                                        visible={this.state.showModal}
                                        setCredentials={this.setCredentials}
                                        onHidden={this.hideModal}/>
                                </div>
                            }
                        </div>
                    )}/>

                    <Route exact path='/tool/create_classifier' render={(props) => (
                        <div>
                            {
                                localStorage.getItem('api_key') == 'undefined'
                                    || localStorage.getItem('api_key') == null
                                    || localStorage.getItem('api_key') == '' ?

                                <LandingPage setCredentials={this.setCredentials}/> :
                                <div>
                                    <Base showModal={this.showModal}>
                                        <CreateClassifier {...props}/>
                                    </Base>
                                    <CredentialsModal
                                        visible={this.state.showModal}
                                        setCredentials={this.setCredentials}
                                        onHidden={this.hideModal}/>
                                </div>
                            }
                        </div>
                    )}/>

                    <Route exact path='/tool/update_classifier/:classifierID' render={(props) => (
                        <div>
                            {
                                localStorage.getItem('api_key') == 'undefined'
                                    || localStorage.getItem('api_key') == null
                                    || localStorage.getItem('api_key') == '' ?

                                <LandingPage setCredentials={this.setCredentials}/> :
                                <div>
                                    <Base showModal={this.showModal}>
                                        <UpdateClassifier {...props}/>
                                    </Base>
                                    <CredentialsModal
                                        visible={this.state.showModal}
                                        setCredentials={this.setCredentials}
                                        onHidden={this.hideModal}/>
                                </div>
                            }
                        </div>
                    )}/>
                </div>
            </BrowserRouter>
        )
    }
}

// This takes our app and injects it into the "main" element in index.html
ReactDOM.render(<App />, document.getElementById('main'))
