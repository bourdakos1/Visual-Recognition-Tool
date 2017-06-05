import React from 'react'
import ReactDOM from 'react-dom'
import { Route, BrowserRouter, IndexRoute } from 'react-router-dom'

import Base from './components/Base'
import Classifiers from './components/Classifiers'
import CreateClassifier from './components/CreateClassifier'
import UpdateClassifier from './components/UpdateClassifier'
import CredentialsModal from './components/CredentialsModal'
import LandingPage from './components/LandingPage'
import Radium, {StyleRoot} from 'radium';
import Bidi from './Bidi';

// Must load strings to get localization
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
        this.bidi = new Bidi({enabled: true, textDir: "auto", numShapingType: "national"});
    }

	getChildContext() {
    	return {bidi: this.bidi};
	}
    	
    // Our two points of entry (CredentialsModal/LandingPage) should give us
    // valid credentials or null.
    setCredentials = (username, password) => {
        localStorage.setItem('username', username)
        localStorage.setItem('password', password)
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
          <StyleRoot dir={this.bidi.guiDir}>
            <BrowserRouter>
                {localStorage.getItem('username') == 'undefined'
                    || localStorage.getItem('username') == null
                    || localStorage.getItem('username') == '' ?
                    <LandingPage setCredentials={this.setCredentials}/> :
                    <Base showModal={this.showModal}>
                        <Route exact path='/' component={Classifiers}/>
                        <Route exact path='/create_classifier' component={CreateClassifier}/>
                        <Route exact path='/update_classifier/:classifierID' component={UpdateClassifier}/>
                        <CredentialsModal
                            visible={this.state.showModal}
                            setCredentials={this.setCredentials}
                            onHidden={this.hideModal}/>
                    </Base>
                }
            </BrowserRouter>
          </StyleRoot>
        )
    }
}

App.childContextTypes = {
 	bidi: React.PropTypes.object
};
	
// This takes our app and injects it into the "main" element in index.html
ReactDOM.render(<App />, document.getElementById('main'))
