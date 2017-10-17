import React from 'react'

import './styles/ClassifierDetail.css'
import 'styles/fonts.css'
import Card from 'components/Card'
import StatusIndicator from 'components/StatusIndicator'

const ClassifierDetail = ({ name, classifierId, status }) => (
  <Card>
    <div className="ClassifierDetail-name font-header">{name}</div>
    <div className="ClassifierDetail-classifier-id font-default">
      {classifierId}
    </div>
    <StatusIndicator status={status} />
  </Card>
)

export default ClassifierDetail
