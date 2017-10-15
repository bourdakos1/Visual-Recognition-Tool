const express = require('express')
const app = express()

app.use(express.static(`${__dirname}/client/build`))

app.get('/api/hello', function (req, res) {
  res.json({message: "Hello World"})
})

const port = process.env.PORT || 3001
app.listen(port, function() {
  console.log('Server listening on port ' + port)
})
