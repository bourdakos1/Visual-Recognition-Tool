import React from 'react'
import { Link } from 'react-router-dom'

import './styles/ClassifierDetail.css'
import 'styles/fonts.css'
import Card from 'components/Card'
import CustomDropButton from 'components/CustomDropButton'
import StatusIndicator from 'components/StatusIndicator'
import LoadingIndicator from 'components/LoadingIndicator'
import ThreeDotMenu from 'components/ThreeDotMenu'
import CopyButton from 'components/CopyButton'
import error from 'images/ic_error_white.svg'

var optionsReady = [
  { name: 'Test', link: '#' },
  { name: 'Update', link: '#' },
  {}, // Divider.
  { name: 'Delete', link: '#', distructive: true }
]

var optionsTraining = [
  { name: 'Test', link: '#', disabled: true },
  { name: 'Update', link: '#', disabled: true },
  {}, // Divider.
  { name: 'Delete', link: '#', distructive: true }
]

const isCustom = classifierId =>
  classifierId && classifierId !== 'food' && classifierId !== 'default'

const Failed = ({ name }) => (
  <div className="ClassifierDetail">
    <div>
      <div className="ClassifierDetail-failed font-body2">
        <img className="ClassifierDetail-failed-icon" src={error} alt="error" />
        <span>Failed</span>
      </div>

      <div className="ClassifierDetail-name font-title ClassifierDetail-fail">
        {name}
      </div>
    </div>

    <div>
      <div className="ClassifierDetail-failed-message-header font-body2">
        The classifier could not be trained.
      </div>

      <div className="ClassifierDetail-failed-message font-body1">
        Verify the usage of at least 10 unique training images per class and at
        least 2 classes.
      </div>
    </div>
  </div>
)

const ReadyDefault = ({ name, classifierId }) => (
  <div className="ClassifierDetail">
    <div className="ClassifierDetail-name font-title">{name}</div>

    <div>
      <div className="ClassifierDetail-classifier-id font-body1">
        <div className="ClassifierDetail-classifier-id-text">
          {classifierId}
        </div>
      </div>

      <CustomDropButton
        accept="image/jpeg, image/png, .jpg, .jpeg, .png"
        explanationText="Drag images here to classify them"
      />
    </div>
  </div>
)

const ReadyCustom = ({ name, classifierId }) => (
  <div className="ClassifierDetail">
    <ThreeDotMenu options={optionsReady} />

    <Link
      className="font-title ClassifierDetail-name ClassifierDetail-link"
      to={'/' + classifierId}
    >
      {name}
    </Link>

    <div>
      <div className="ClassifierDetail-classifier-id font-body1">
        <div className="ClassifierDetail-classifier-id-text">
          {classifierId}
        </div>
        <CopyButton copyValue={classifierId} />
      </div>

      <CustomDropButton
        accept="image/jpeg, image/png, .jpg, .jpeg, .png"
        explanationText="Drag images here to classify them"
      />
    </div>
  </div>
)

const Training = ({ name, classifierId }) => (
  <div className="ClassifierDetail">
    <ThreeDotMenu options={optionsTraining} />

    <Link
      className="font-title ClassifierDetail-name ClassifierDetail-link"
      to={'/' + classifierId}
    >
      {name}
    </Link>

    <div>
      <div className="ClassifierDetail-classifier-id font-body1">
        <div className="ClassifierDetail-classifier-id-text">
          {classifierId}
        </div>
        <CopyButton copyValue={classifierId} />
      </div>

      <div className="ClassifierDetail-training">
        <div className="ClassifierDetail-training-text font-body2">
          Training
        </div>
        <LoadingIndicator />
      </div>
    </div>
  </div>
)

const ClassifierDetailWrapper = ({ name, classifierId, status }) => {
  if (status === 'failed') {
    return <Failed name={name} />
  }

  if (status === 'ready' && isCustom(classifierId)) {
    return <ReadyCustom name={name} classifierId={classifierId} />
  }

  if (status === 'ready') {
    return <ReadyDefault name={name} classifierId={classifierId} />
  }

  if (status === 'training') {
    return <Training name={name} classifierId={classifierId} />
  }
}

const ClassifierDetail = ({ name, classifierId, status }) => (
  <Card>
    <ClassifierDetailWrapper
      name={name}
      classifierId={classifierId}
      status={status}
    />
  </Card>
)

export default ClassifierDetail
