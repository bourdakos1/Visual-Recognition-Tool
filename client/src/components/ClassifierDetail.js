import React from 'react'

import './styles/ClassifierDetail.css'
import 'styles/fonts.css'
import Card from 'components/Card'
import StatusIndicator from 'components/StatusIndicator'

const ClassifierDetail = ({ name, classifierId, status }) => {
  return (
    <Card>
      <div className="ClassifierDetail-text ClassifierDetail-name font-header">
        {name}
      </div>
      <div className="ClassifierDetail-text ClassifierDetail-classifier-id font-default">
        {classifierId}
      </div>
      <StatusIndicator status={status} />
    </Card>
  )
}

export default ClassifierDetail
