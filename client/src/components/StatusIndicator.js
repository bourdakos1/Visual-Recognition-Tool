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

const StatusIndicator = ({ status }) => (
  <div className="StatusIndicator-text">
    <Indicator status={status} />
    {status}
  </div>
)

export default StatusIndicator
