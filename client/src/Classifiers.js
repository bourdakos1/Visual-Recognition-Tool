import React from 'react'
import { Link } from 'react-router-dom'

import './Classifiers.css'
import createButton from './btn_create.png'
import Button from './Button'

function Classifiers() {
  return (
    <div>
      <Link to="/create_classifier">
        <Button className="Classifiers-button" icon={createButton} bold>
          Create classifier
        </Button>
      </Link>
    </div>
  )
}

export default Classifiers
