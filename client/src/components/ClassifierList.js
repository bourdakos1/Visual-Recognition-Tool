import React from 'react'
import StackGrid from 'react-stack-grid'
import { Link } from 'react-router-dom'

import './styles/ClassifierList.css'
import createButton from 'images/btn_create.png'
import Button from 'components/Button'

const ClassifierList = ({ classifiers }) => {
  return (
    <div>
      <Link to="/create_classifier">
        <Button className="ClassifierList-button" icon={createButton} bold>
          Create classifier
        </Button>
      </Link>
      <StackGrid
        className="ClassifierList-grid"
        columnWidth={300}
        gutterWidth={50}
      >
        {classifiers.map(c => {
          return <div>{c.name}</div>
        })}
      </StackGrid>
    </div>
  )
}

export default ClassifierList
