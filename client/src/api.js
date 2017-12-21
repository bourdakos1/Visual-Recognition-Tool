function listClassifiers(cb) {
  return fetch(
    `/api/classifiers?api_key=${localStorage.getItem('api_key')}&verbose=true`
  )
    .then(checkStatus)
    .then(parseJSON)
    .then(responseJson => {
      if (responseJson.error != null) {
        const error = new Error('responseJson.error')
        throw error
      }

      var classifiers = responseJson.classifiers

      classifiers.sort((a, b) => {
        return new Date(b.created) - new Date(a.created)
      })

      classifiers.unshift({
        name: 'Test This REALLLYY long name t o s e e how it goes',
        classifier_id: 'foobar_and_an_even_longer_classifier_id123456789',
        status: 'ready'
      })

      classifiers.unshift({
        name: 'AAAAAABBBBBBBBCCCCCCCCCDDDDDDDDEEEEEEEEFFFFFFFFGGGGGGG',
        classifier_id: 'foobar_and_an_even_longer_classifier_id123456789',
        status: 'ready'
      })

      classifiers.unshift({
        name: 'Test This REALLLYY long name t o s e e how it goes',
        classifier_id: 'foobar_and_an_even_longer_classifier_id123456789',
        status: 'failed'
      })

      classifiers.unshift({
        name: 'AAAAAABBBBBBBBCCCCCCCCCDDDDDDDDEEEEEEEEFFFFFFFFGGGGGGG',
        classifier_id: 'foobar_and_an_even_longer_classifier_id123456789',
        status: 'failed'
      })

      classifiers.unshift({
        name: 'Test',
        classifier_id: 'foobar',
        status: 'training'
      })

      classifiers.push(
        { name: 'General', classifier_id: 'default', status: 'ready' },
        { name: 'Food', classifier_id: 'food', status: 'ready' },
        { name: 'Face Detection', status: 'ready' }
      )

      return classifiers
    })
    .then(cb)
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  const error = new Error('Failed to load')
  throw error
}

function parseJSON(response) {
  return response.json()
}

const Api = { listClassifiers }
export default Api
