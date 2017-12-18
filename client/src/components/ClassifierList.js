import React from 'react'
import StackGrid from 'react-stack-grid'
import { Link } from 'react-router-dom'

import './styles/ClassifierList.css'
import createButton from 'images/btn_create.svg'
import Button from 'components/Button'
import ClassifierDetail from 'components/ClassifierDetail'

const ClassifierList = ({ classifiers }) => (
  <div>
    <div className="ClassifierList-top">
      <div className="ClassifierList-your">Your classifiers</div>
      <Link to="/create_classifier">
        <Button icon={createButton} bold>
          New classifier
        </Button>
      </Link>
    </div>

    <StackGrid
      className="ClassifierList-grid"
      columnWidth={300}
      gutterWidth={50}
    >
      {classifiers.map(c => {
        return (
          <ClassifierDetail
            name={c.name}
            classifierId={c.classifier_id}
            status={c.status}
          />
        )
      })}
    </StackGrid>
  </div>
)

export default ClassifierList
