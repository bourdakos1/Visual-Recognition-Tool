import React from 'react'

import './styles/ClassifierDetail.css'
import 'styles/fonts.css'
import Card from 'components/Card'
import CustomDropButton from 'components/CustomDropButton'
import StatusIndicator from 'components/StatusIndicator'

const ClassifierDetail = ({ name, classifierId, status }) => (
  <div className="ClassifierDetail">
    <Card>
      <div className="ClassifierDetail-name font-header">{name}</div>
      <div className="ClassifierDetail-classifier-id font-default">
        {classifierId}
      </div>
      <StatusIndicator status={status} />

      {!classifierId && <div className="ClassifierDetail-spacer" />}

      <CustomDropButton
        accept="image/jpeg, image/png, .jpg, .jpeg, .png"
        explanationText="Drag images here to classify them"
      />
    </Card>
  </div>
)

export default ClassifierDetail
