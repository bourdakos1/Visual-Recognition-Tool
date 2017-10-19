import React from 'react'

import './styles/ClassifierDetail.css'
import 'styles/fonts.css'
import Card from 'components/Card'
import DropButton from 'components/DropButton'
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

      <DropButton
        style={{
          borderRadius: '0 0 5px 5px',
          borderTopColor: '#dedede',
          marginTop: '20px',
          marginBottom: '-13px',
          marginLeft: '-13px',
          marginRight: '-13px'
        }}
        accept="image/jpeg, image/png, .jpg, .jpeg, .png"
        explanationText="Drag images here to classify them"
      />
    </Card>
  </div>
)

export default ClassifierDetail
