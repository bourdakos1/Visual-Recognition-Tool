import React from 'react'
import Radium from 'radium'

import Styles from './Styles'
import WorkSpace from './WorkSpace'
import i18next from 'i18next'

@Radium
export default class CreateClassifier extends React.Component {
    render() {
        return (
            <WorkSpace
                progressModalText={i18next.t('creating_classifier')}
                titleText={i18next.t('create_classifier_title')}
                subTitleText={i18next.t('create_classifier_description')}
                submitText={i18next.t('create')}
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
