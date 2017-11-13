import React from 'react'

import './styles/StatusIndicator.css'

const Indicator = ({ status }) => {
  if (status === 'ready') {
    return <span className="StatusIndicator StatusIndicator-ready" />
  } else if (status === 'training' || status === 'retraining') {
    return <span className="StatusIndicator StatusIndicator-training" />
  } else {
    return <span className="StatusIndicator StatusIndicator-failed" />
  }
}

function ucfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const StatusIndicator = ({ status }) => (
  <div className="StatusIndicator-text font-caption">
    <Indicator status={status} /> {ucfirst(status)}{' '}
  </div>
)

export default StatusIndicator
