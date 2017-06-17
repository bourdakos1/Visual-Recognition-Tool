import React from 'react'
import ReactDOM from 'react-dom'
import { Route, BrowserRouter, IndexRoute } from 'react-router-dom'

import Base from './components/Base'
import Classifiers from './components/Classifiers'
import CreateClassifier from './components/CreateClassifier'
import UpdateClassifier from './components/UpdateClassifier'
import CredentialsModal from './components/CredentialsModal'
import LandingPage from './components/LandingPage'

import DevBase from './components/developers/Base'
import TestPage from './components/developers/TestPage'
import Demo from './components/developers/Demo'
import ConversationDemo from './components/developers/ConversationDemo'
import Devs from './components/developers/Devs'
import DevsTest from './components/developers/DevsTest'
import DevsGuide from './components/developers/DevsGuide'
import ConversationDevsGuide from './components/developers/ConversationDevsGuide'
import Strings from './components/Strings'

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
                    <Route path='/docs' render={(props) => (
                        <DevBase {...props}>
                            <Route exact path={Strings.DEMO_PATH + '/vision'} component={Demo}/>
                            <Route exact path={Strings.DEMO_PATH + '/conversation'} component={ConversationDemo}/>

                            <Route exact path={Strings.GUIDE_PATH + '/vision'} component={DevsGuide}/>
                            <Route exact path={Strings.GUIDE_PATH + '/conversation'} component={ConversationDevsGuide}/>

                            <Route exact path={Strings.API_PATH + '/vision'} component={DevsGuide}/>
                            <Route exact path={Strings.API_PATH + '/conversation'} component={DevsGuide}/>

                            <Route exact path={Strings.DEVELOPER_PATH} component={DevsTest}/>
                        </DevBase>
                    )}/>

                    <Route path='/tool' render={(props) => (
                        <div>
                            {
                                localStorage.getItem('api_key') == 'undefined'
                                    || localStorage.getItem('api_key') == null
                                    || localStorage.getItem('api_key') == '' ?

                                <LandingPage setCredentials={this.setCredentials}/> :
                                <div>
                                    <Base showModal={this.showModal}>
                                        <Route exact path='/tool' component={Classifiers}/>
                                        <Route exact path='/tool/create_classifier' component={CreateClassifier}/>
                                        <Route exact path='/tool/update_classifier/:classifierID' component={UpdateClassifier}/>
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
