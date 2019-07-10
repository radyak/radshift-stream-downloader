const bodyParser = require('body-parser')
const express = require('express')
const app = express()

require('express-ws')(app)

app.use(
  bodyParser.urlencoded({
    extended: false
  })
)
app.use(bodyParser.json())

app.use('/api/info', require('./src/routes/info'))
app.use('/api/audio', require('./src/routes/audio'))
app.use('/api/video', require('./src/routes/video'))
app.use('/api/files', require('./src/routes/files'))

const port = process.env.PORT || 3009
app.listen(port)
console.log(`Lisitening on port ${port}`)