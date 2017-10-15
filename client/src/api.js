function sayHello(cb) {
  return fetch('/api/hello')
    .then(checkStatus)
    .then(parseJSON)
    .then(cb)
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  const error = new Error(`HTTP Error ${response.statusText}`)
  error.status = response.statusText
  error.response = response
  console.error(error)
  throw error
}

function parseJSON(response) {
  return response.json()
}

const Api = { sayHello }
export default Api
