import React from 'react'
import Radium from 'radium'

import Styles from './Styles'
import Strings from './Strings'
import WorkSpace from './WorkSpace'

@Radium
export default class CreateClassifier extends React.Component {
    render() {
        return (
            <WorkSpace
                progressModalText={Strings.creating_classifier}
                titleText={Strings.create_classifier_title}
                subTitleText={Strings.create_classifier_description}
                submitText={Strings.create}
                classesInfo={true}
                classifier={{name: '', fixed: false}}
                classes={[
                    {name: '', file: null, id: 0},
                    {name: '', file: null, id: 1},
                    {negative: true, file: null, id: 2},
                ]} />
        )
    }
}
