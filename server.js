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

// Multer config
const upload = multer({
  limits: {
    files: 1,
    fileSize: 2 * 1024 * 1024 // 2mb
  },
  fileFilter: function(req, file, cb) {
    var type = file.mimetype
    if (type !== 'image/png' && type !== 'image/jpg' && type !== 'image/jpeg') {
      cb(new Error('Invalid image type'))
    } else {
      cb(null, true)
    }
  },
  storage: storage
})

var fileUpload = upload.single('file')
app.post('/api/classify', function(req, res) {
  fileUpload(req, res, function(err) {
    if (err) {
      res.send(err)
      return
    }

    var visual_recognition = new VisualRecognitionV3({
      api_key: req.query.api_key,
      version_date: req.query.version || '2016-05-19'
    })

    var params = req.query

    params.images_file = fs.createReadStream(req.file.path)

    visual_recognition.classify(params, function(err, data) {
      fs.unlinkSync(req.file.path)
      if (err) {
        res.send(err)
        return
      }
      res.send(data)
    })
  })
})

const port = process.env.PORT || 3001
app.listen(port, function() {
  console.log('Server listening on port ' + port)
})
