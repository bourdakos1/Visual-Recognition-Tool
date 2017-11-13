const VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3')
const express = require('express')
const app = express()

app.use(express.static(`${__dirname}/client/build`))

app.get('/api/classifiers', function(req, res) {
  var visual_recognition = new VisualRecognitionV3({
    api_key: req.query.api_key,
    version_date: req.query.version || '2016-05-19'
  })

  visual_recognition.listClassifiers(req.query, function(err, data) {
    if (err) {
      res.send(err)
      return
    }
    res.send(data)
  })
})

const port = process.env.PORT || 3001
app.listen(port, function() {
  console.log('Server listening on port ' + port)
})

// const setup = require('@console/create-bluemix-server').default
// const bluemixHelpers = require('@console/create-bluemix-server').bluemixHelpers
//
// const app = setup.createBluemixExpressApp({
//   appConfig: {
//     context: '/',
//     port: 8080
//   }
// })
//
// const render = setup.getTemplateRenderFunction()
//
// // This helper returns the context from appConfig.
// const context = bluemixHelpers.getContextRoot()
//
// app.get(context, render('index'))
//
// // Starts the server at http://localhost:4895 (uses the port from appConfig).
// setup.startServer(app)
