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
