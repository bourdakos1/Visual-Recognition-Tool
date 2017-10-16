import React from 'react'

import './styles/ClassifierDetail.css'
import Card from 'components/Card'
import StatusIndicator from 'components/StatusIndicator'

const ClassifierDetail = ({ name, classifierId, status }) => {
  return (
    <Card>
      <div>{name}</div>
      <div>{classifierId}</div>
      <StatusIndicator status={status} />
    </Card>
  )
}

export default ClassifierDetail
